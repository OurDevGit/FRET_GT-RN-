// import { createSelector } from "reselect";
import { List, Seq, Map } from "immutable";

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

const getSubCategories = (state, categoryId) => {
  return state.get("subCategoriesByCategoryId").get(categoryId);
};

const getMediaForCategory = (state, category) => {
  if (category.isGrouped) {
    const subCats = getSubCategories(state, category.id);
    const media = subCats.map(o => {
      const data = getMediaByListId(state, o.get("id")) || List();
      return Map({ data, title: o.get("title") });
    });
    return media;
  } else {
    console.log("not grouped");
    return List([Map({ data: getMediaByListId(category.id) })]);
  }
};

export const selectMedia = (state, category, subCategory, group) => {
  // console.debug({ category });
  // console.debug({ subCategory });
  // console.debug({ group });

  if (category) {
    if (category.isClientSided === true) {
      return getClientSidedMedia(state, category);
    } else if (subCategory === undefined) {
      console.debug("media for cat...");
      const catMedia = getMediaForCategory(state, category);
      console.debug(catMedia);
      return catMedia;
    }
  }

  return Seq();
};
