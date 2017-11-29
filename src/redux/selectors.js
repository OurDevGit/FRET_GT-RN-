import { List, Seq, Map, Stack } from "immutable";
import { GetMediaButtonMode } from "../models/Media";
import { isEqual } from "lodash";
import memoize from "fast-memoize";

const getMediaByListIds = state => state.get("mediaByListId");
const getMediaByListId = (state, id) => getMediaByListIds(state).get(id);
const getFaves = state => state.get("favorites");
const getPurchasedMedia = state => state.get("purchasedMedia");
const getSubCategories = (state, categoryId) =>
  state.get("subCategoriesByCategoryId").get(categoryId);
const getGroups = (state, subCategoryId) =>
  state.get("groupsBySubCategoryId").get(subCategoryId);
const getTitleSorting = (state, thing) =>
  (
    state.get("storeSorting").get((thing || {}).id) || Map({ isTitle: false })
  ).get("isTitle") === true;

export const getAllMedia = state => state.get("mediaById").valueSeq() || Seq();
export const getDownloadedMediaFiles = (state, mediaId) =>
  state.get("downloadedMedia").get(mediaId);
export const getMediaById = (state, mediaId) =>
  state.get("mediaById").get(mediaId);

const getClientSidedMedia = (state, obj, isStore) => {
  switch (obj.title) {
    case "All Content": {
      const allMedia = state.get("listedMedia").sort((m1, m2) => {
        return m1.get("sortTitle").localeCompare(m2.get("sortTitle"));
      });
      return List([Map({ data: allMedia })]);
    }
    case "Wishlist": {
      const allMedia = getAllMedia(state);
      const faves = getFaves(state);
      const purchased = getPurchasedMedia(state);
      const favedMedia = allMedia
        .filter(
          media =>
            faves.includes(media.get("mediaID")) &&
            purchased.includes(media.get("mediaID").toLowerCase()) ===
              (isStore === true ? false : true)
        )
        .sort((m1, m2) => {
          return m1.get("sortTitle").localeCompare(m2.get("sortTitle"));
        });
      return List([Map({ data: favedMedia })]);
    }
    default:
      return List();
  }
};

const getMediaForIds = (state, mediaIds) => {
  const media = state.get("mediaById").reduce((acc, val, key) => {
    if (mediaIds.includes(key)) {
      return acc.push(val);
    } else {
      return acc;
    }
  }, Stack());

  return media;
};

const getMediaForCategory = (state, category, categoryIsTitleSort) => {
  if (category.isGrouped) {
    const subCats = getSubCategories(state, category.id) || List();
    const media = subCats.map(subCategory => {
      const mediaIds = getMediaByListId(state, subCategory.get("id")) || List();
      const data = getMediaForIds(state, mediaIds).sort((m1, m2) => {
        return categoryIsTitleSort
          ? m1.get("sortTitle").localeCompare(m2.get("sortTitle"))
          : m1.get("sortArtist").localeCompare(m2.get("sortArtist"));
      });
      return Map({ data, title: subCategory.get("title") });
    });
    return media;
  } else {
    const data = getMediaByListId(state, category.id) || List();
    const sortedData = data.sort((m1, m2) => {
      return categoryIsTitleSort
        ? m1.get("sortTitle").localeCompare(m2.get("sortTitle"))
        : m1.get("sortArtist").localeCompare(m2.get("sortArtist"));
    });
    return List([Map({ data: sortedData })]);
  }
};

const getMediaforSubCategory = (
  state,
  subCategory,
  subCategoryIsTitleSort,
  groupIsTitleSort
) => {
  const groups = getGroups(state, subCategory.id);

  if (groups !== undefined) {
    const media = groups.map(group => {
      const mediaIds = getMediaByListId(state, group.get("id")) || List();
      const data = getMediaForIds(state, mediaIds).sort((m1, m2) => {
        return groupIsTitleSort
          ? m1.get("sortTitle").localeCompare(m2.get("sortTitle"))
          : m1.get("sortArtist").localeCompare(m2.get("sortArtist"));
      });
      return Map({ data, title: group.get("title") });
    });

    return media;
  } else {
    // sub-category without groups
    const mediaIds = getMediaByListId(state, subCategory.id) || List();
    const data = getMediaForIds(state, mediaIds).sort((m1, m2) => {
      return subCategoryIsTitleSort
        ? m1.get("sortTitle").localeCompare(m2.get("sortTitle"))
        : m1.get("sortArtist").localeCompare(m2.get("sortArtist"));
    });
    return List([Map({ data })]);
  }
};

const mergeProductDetails = (state, singleMedia, detailsHaveLoaded) => {
  const productDetails = state.get("productDetails") || Map();
  const mediaId = singleMedia.get("mediaID");
  const mediaDetails =
    productDetails.get(mediaId.toLowerCase()) ||
    // if the above is null/undefined then we fall back to LOADING / COMING SOON
    (singleMedia.get("isFree") === true
      ? Map({ priceText: "FREE" })
      : detailsHaveLoaded === true
        ? Map({ priceText: "COMING SOON" })
        : Map({ priceText: "LOADING" }));

  return singleMedia.set("productDetails", mediaDetails);
};

const mergeGetMode = (state, singleMedia) => {
  const mediaId = singleMedia.get("mediaID");

  // is intermediate
  const isIntermediate = state.get("intermediateMedia").includes(mediaId);

  // is purchased
  const purchasedMedia = state.get("purchasedMedia");
  const isPurchased = purchasedMedia.has(mediaId.toLowerCase());

  // is downloaded
  const mediaFiles = getDownloadedMediaFiles(state, mediaId);
  const isDownloaded = mediaFiles !== undefined;

  let mode = GetMediaButtonMode.Purchase;
  if (isDownloaded === true) {
    mode = GetMediaButtonMode.Play;
  } else if (isPurchased === true) {
    mode = GetMediaButtonMode.Download;
  } else if (isIntermediate === true) {
    mode = GetMediaButtonMode.Indeterminate;
  } else if (
    singleMedia.get("productDetails").get("priceText") === "COMING SOON"
  ) {
    mode = GetMediaButtonMode.ComingSoon;
  }

  return singleMedia.merge({ getMode: mode });
};

// Loop the media sections, and the media inside them.
// Merge in details to each media item, like the In-App Billing details (price),
// "get button mode" (i.e. downloading vs. downloaded)
const mergeMediaDetails = (state, mediaSections) => {
  if (mediaSections === undefined) {
    return mediaSections;
  }

  // const productDetails = state.get("productDetails") || Map();
  const mediaWithProductDetails = mediaSections.map(mediaSection => {
    const media = mediaSection.get("data");
    const detailsHaveLoaded = state.get("productDetailsHaveLoaded") === true;

    // merge in product details and Get Mode for each media item
    const newData = media.map(m => {
      const withProductDetails = mergeProductDetails(
        state,
        m,
        detailsHaveLoaded
      );
      const withGetMode = mergeGetMode(state, withProductDetails);
      return withGetMode;
    });

    const newSection = mediaSection.set("data", newData);

    return newSection;
  });

  // console.debug(mediaWithProductDetails.toJS());

  return mediaWithProductDetails;
};

const selectMediaRaw = (state, category, subCategory, group, isStore) => {
  // console.time("selectMediaRaw");

  console.debug(`selectMediaRaw()`);
  // console.debug({ category });
  // console.debug({ subCategory });
  // console.debug({ group });

  const categoryIsTitleSort = getTitleSorting(state, category);
  const subCategoryIsTitleSort = getTitleSorting(state, subCategory);
  const groupIsTitleSort = getTitleSorting(state, group);

  var result = null;

  if (category) {
    if (category.isClientSided === true) {
      const media = getClientSidedMedia(state, category, isStore);
      result = mergeMediaDetails(state, media);
    } else if (subCategory === undefined || subCategory === null) {
      const media = getMediaForCategory(state, category, categoryIsTitleSort);
      result = mergeMediaDetails(state, media);
    } else {
      const media = getMediaforSubCategory(
        state,
        subCategory,
        subCategoryIsTitleSort,
        groupIsTitleSort
      );
      result = mergeMediaDetails(state, media);
    }
  }

  // console.timeEnd("selectMediaRaw");
  return result || Seq();
};

export const selectMedia = memoize(selectMediaRaw);

export const getMediaForPlay = (state, mediaId) => {
  const files = state.get("downloadedMedia").get(mediaId) || Map();
  const details = state.get("mediaById").get(mediaId) || Map();

  if (details === undefined) {
    return Map();
  }

  const media = {
    ...details.toJS(),
    key: details.get("mediaID"),
    id: details.get("mediaID"),
    files: files.toJS()
  };

  return Map(media);
};
