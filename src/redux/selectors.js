// import { createSelector } from "reselect";
import { List, Seq, Map, Stack } from "immutable";

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

const mergeProductDetails = (state, media) => {
  if (media === undefined) {
    return media;
  }

  const productDetails = state.get("productDetails") || Map();
  const mediaWithProductDetails = media.map(mediaSection => {
    const data = mediaSection.get("data");
    const newData = data.map(m => {
      // console.debug(m.toJS());
      const mediaId = m.get("mediaID").toLowerCase();
      const mDetails =
        productDetails.get(mediaId) || Map({ priceText: "LOADING" });
      // console.debug(details.toJS());
      return m.set("productDetails", mDetails);
    });

    const newSection = mediaSection.set("data", newData);

    return newSection;
    // console.debug(mediaSection.toJS().data);
    // console.debug(m.get("mediaID"));
    // console.debug(details);
  });

  console.debug(mediaWithProductDetails.toJS());

  return mediaWithProductDetails;
};

export const selectMedia = (state, category, subCategory, group) => {
  // console.debug({ category });
  // console.debug({ subCategory });
  // console.debug({ group });

  if (category) {
    if (category.isClientSided === true) {
      const media = getClientSidedMedia(state, category);
      return mergeProductDetails(state, media);
    } else if (subCategory === undefined) {
      const media = getMediaForCategory(state, category);
      return mergeProductDetails(state, media);
    } else {
      const media = getMediaforSubCategory(state, subCategory);
      return mergeProductDetails(state, media);
    }
  }

  return Seq();
};
