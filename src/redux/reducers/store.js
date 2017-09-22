import Immutable, { List } from "immutable";

export const categories = (state = List(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.categories);
    default:
      return state;
  }
};

export const subCategoriesByCategoryId = (state = [], action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.subCategoriesByCategoryId);
    default:
      return state;
  }
};

export const groupsBySubCategoryId = (state = [], action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.groupsBySubCategoryId);
    default:
      return state;
  }
};

export const mediaByListId = (state = [], action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.mediaByListId);
    default:
      return state;
  }
};

export const mediaById = (state = [], action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.mediaById);
    default:
      return state;
  }
};

export const storeSorting = (state = [], action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.storeSorting);
    default:
      return state;
  }
};
