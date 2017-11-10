import Immutable, { List, Map } from "immutable";

export const categories = (state = List(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.categories) || List();
    case "SET_BOOTSTRAP":
      return Immutable.fromJS(action.payload.storeObjects.categories) || List();
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
    case "SET_BOOTSTRAP":
      return (
        Immutable.fromJS(
          action.payload.storeObjects.subCategoriesByCategoryId
        ) || Map()
      );
    default:
      return state;
  }
};

export const groupsBySubCategoryId = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.groupsBySubCategoryId) || Map();
    case "SET_BOOTSTRAP":
      return (
        Immutable.fromJS(action.payload.storeObjects.groupsBySubCategoryId) ||
        Map()
      );
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
    case "SET_BOOTSTRAP": {
      const byId =
        Immutable.fromJS(action.payload.storeObjects.mediaByListId) || Map();
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
    case "SET_BOOTSTRAP":
      return Immutable.fromJS(action.payload.storeObjects.mediaById) || Map();
    default:
      return state;
  }
};

export const listedMedia = (state = List(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.listedMedia) || List();
    case "SET_BOOTSTRAP":
      return (
        Immutable.fromJS(action.payload.storeObjects.listedMedia) || List()
      );
    default:
      return state;
  }
};

export const storeSorting = (state = Map(), action) => {
  switch (action.type) {
    case "STORE_LOADED":
      return Immutable.fromJS(action.payload.storeSorting) || Map();
    case "SET_BOOTSTRAP":
      return (
        Immutable.fromJS(action.payload.storeObjects.storeSorting) || Map()
      );
    default:
      return state;
  }
};
