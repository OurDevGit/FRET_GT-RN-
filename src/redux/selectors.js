// import { createSelector } from "reselect";
import { List, Seq, Map, Stack } from "immutable";
import { GetMediaButtonMode } from "../models/Media";

const getMediaByListIds = state => state.get("mediaByListId");
const getAllMedia = state => state.get("mediaById").valueSeq() || Seq();
const getMediaByListId = (state, id) => getMediaByListIds(state).get(id);

const getClientSidedMedia = (state, obj) => {
  switch (obj.title) {
    case "All Content":
      const allMedia = getAllMedia(state);
      return List([Map({ data: allMedia })]);
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

const getSubCategories = (state, categoryId) =>
  state.get("subCategoriesByCategoryId").get(categoryId);

const getGroups = (state, subCategoryId) =>
  state.get("groupsBySubCategoryId").get(subCategoryId);

const getMediaForCategory = (state, category) => {
  if (category.isGrouped) {
    const subCats = getSubCategories(state, category.id) || List();
    const media = subCats.map(subCategory => {
      const mediaIds = getMediaByListId(state, subCategory.get("id")) || List();
      const data = getMediaForIds(state, mediaIds);
      return Map({ data, title: subCategory.get("title") });
    });
    return media;
  } else {
    console.log("not grouped");
    const data = getMediaByListId(state, category.id) || List();
    return List([Map({ data })]);
  }
};

const getMediaforSubCategory = (state, subCategory) => {
  const groups = getGroups(state, subCategory.id);

  if (subCategory.isNavigable === true) {
    // TODO: implement
    return List([Map({ data: [], title: "TODO: navigable groups" })]);
  } else {
    console.debug("not a navigable Sub Category");
    if (groups !== undefined) {
      console.debug("Sub Category has Groups");
      const media = groups.map(group => {
        const mediaIds = getMediaByListId(state, group.get("id")) || List();
        const data = getMediaForIds(state, mediaIds);
        return Map({ data, title: group.get("title") });
      });

      return media;
    } else {
      console.debug("Sub Category without Groups");
      // sub-category without groups
      const mediaIds = getMediaByListId(state, subCategory.id) || List();
      const data = getMediaForIds(state, mediaIds);
      return List([Map({ data })]);
    }
  }
};

const getDownloadProgress = (state, mediaId) => {
  const downloadProgress = state.get("downloadProgress");
  return downloadProgress.get(mediaId);
};

const getFiles = (state, mediaId) => {
  const downloadFiles = state.get("downloadedMedia");
  return downloadFiles.get(mediaId);
};

const mergeProductDetails = (state, singleMedia) => {
  const productDetails = state.get("productDetails") || Map();
  const mediaId = singleMedia.get("mediaID").toLowerCase();

  return singleMedia.set("productDetails", productDetails);
};

const mergeGetMode = (state, singleMedia) => {
  const mediaId = singleMedia.get("mediaID").toLowerCase();

  const purchasedMedia = state.get("purchasedMedia");
  const isPurchased = purchasedMedia.has(mediaId);

  const downloadProgress = getDownloadProgress(state, mediaId);
  const isDownloading = downloadProgress !== undefined;

  const mediaFiles = getFiles(state, mediaId);
  const isDownloaded = mediaFiles !== undefined;

  let mode = GetMediaButtonMode.Purchase;
  if (isDownloaded === true) {
    mode = GetMediaButtonMode.Play;
  } else if (isDownloading === true) {
    mode = GetMediaButtonMode.Downloading;
  } else if (isPurchased === true) {
    mode = GetMediaButtonMode.Download;
  }

  // return singleMedia.set("getMode", GetMediaButtonMode.Downloading);
  return singleMedia.merge({ getMode: mode, downloadProgress });
};

const mergeMediaDetails = (state, mediaSections) => {
  if (mediaSections === undefined) {
    return mediaSections;
  }

  const productDetails = state.get("productDetails") || Map();
  const mediaWithProductDetails = mediaSections.map(mediaSection => {
    const media = mediaSection.get("data");
    // filter the media to just the stuff we have Product Details for (aka. if it's in Google Play as an In-App Product)
    const filteredData =
      state.get("productDetailsHaveLoaded") === true
        ? media.filter(
            m =>
              productDetails.get(m.get("mediaID").toLowerCase()) !== undefined
          )
        : media;
    const newData = filteredData.map(m => {
      const withProductDetails = mergeProductDetails(state, m);
      const withGetMode = mergeGetMode(state, withProductDetails);
      return withGetMode;
    });

    const newSection = mediaSection.set("data", newData);

    return newSection;
    // console.debug(mediaSection.toJS().data);
    // console.debug(m.get("mediaID"));
    // console.debug(details);
  });

  // console.debug(mediaWithProductDetails.toJS());

  return mediaWithProductDetails;
};

export const selectMedia = (state, category, subCategory, group) => {
  // console.debug({ category });
  // console.debug({ subCategory });
  // console.debug({ group });

  if (category) {
    if (category.isClientSided === true) {
      const media = getClientSidedMedia(state, category);
      return mergeMediaDetails(state, media);
    } else if (subCategory === undefined || subCategory === null) {
      const media = getMediaForCategory(state, category);
      return mergeMediaDetails(state, media);
    } else {
      const media = getMediaforSubCategory(state, subCategory);
      return mergeMediaDetails(state, media);
    }
  }

  return Seq();
};
