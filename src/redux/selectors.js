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

export const selectMedia = (state, category, subCategory, group) => {
  console.debug({ category });
  console.debug({ subCategory });
  console.debug({ group });

  if (category) {
    if (category.isClientSided === true) {
      return getClientSidedMedia(state, category);
    } else if (subCategory === undefined) {
      const catMedia = getMediaForCategory(state, category);
      return catMedia;
    } else {
      const media = getMediaforSubCategory(state, subCategory);
      return media;
    }
  }

  return Seq();
};
