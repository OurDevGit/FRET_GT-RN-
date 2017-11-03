import Immutable, { List, Map } from "immutable";

export const categories = (state = List(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.categories) || List();
    default:
      return state;
  }
};

export const subCategoriesByCategoryId = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return (
        Immutable.fromJS(action.payload.subCategoriesByCategoryId) || Map()
      );
    default:
      return state;
  }
};

export const groupsBySubCategoryId = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.groupsBySubCategoryId) || Map();
    default:
      return state;
  }
};

export const mediaByListId = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED": {
      const byId = Immutable.fromJS(action.payload.mediaByListId) || Map();
      return byId;
    }
    default:
      return state;
  }
};

export const mediaById = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.mediaById) || Map();
    default:
      return state;
  }
};

export const listedMedia = (state = List(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.listedMedia) || List();
    default:
      return state;
  }
};

export const storeSorting = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.storeSorting) || Map();
    default:
      return state;
  }
};

export const getList = (state, listId) => {
  const mediaIds = state[listId];
  console.debug(mediaIds);

  return mediaIds;
};
