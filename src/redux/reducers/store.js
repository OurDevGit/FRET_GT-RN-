import Immutable, { List, Map } from "immutable";

export const categories = (state = List(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.categories);
    default:
      return state;
  }
};

export const subCategoriesByCategoryId = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.subCategoriesByCategoryId);
    default:
      return state;
  }
};

export const groupsBySubCategoryId = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.groupsBySubCategoryId);
    default:
      return state;
  }
};

export const mediaByListId = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      console.debug(action.payload.mediaByListId);
      const byId = Immutable.fromJS(action.payload.mediaByListId);
      console.debug(byId);
      return byId;
    default:
      return state;
  }
};

export const mediaById = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.mediaById);
    default:
      return state;
  }
};

export const storeSorting = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.storeSorting);
    default:
      return state;
  }
};

export const getList = (state, listId) => {
  const mediaIds = state[listId];
  console.debug(mediaIds);

  return mediaIds;
};
