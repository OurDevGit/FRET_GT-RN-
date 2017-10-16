import { AsyncStorage } from "react-native";
import { keyBy } from "lodash";

import { makeStore } from "./StorageFactory";

const Store = makeStore("Store");
// const ProductDetails = makeStore("ProductDetails")

export const setStore = async store => {
  const {
    categories,
    subCategories,
    groups,
    categoryLists,
    subCategoryLists,
    groupLists,
    media,
    mediaLists,
    sorting
  } = store;

  const mediaById = keyBy(media, "mediaID");
  const subCategoriesByCategoryId = subCategories;
  const groupsBySubCategoryId = groups;
  const mediaByListId = {
    ...categoryLists,
    ...subCategoryLists,
    ...groupLists
  };
  const storeSorting = sorting;

  const storeObjects = {
    categories,
    subCategoriesByCategoryId,
    groupsBySubCategoryId,
    mediaByListId,
    mediaById,
    storeSorting
  };

  await Store.setObjs(storeObjects);

  return storeObjects;
  // console.debug("stored categories");
  // console.debug(await Store.getObj("categories"));
};

export const getStore = async () => {
  const storeObjects = await Store.getObjs([
    "categories",
    "subCategoriesByCategoryId",
    "groupsBySubCategoryId",
    "mediaByListId",
    "mediaById",
    "storeSorting"
  ]);

  return storeObjects;
};

export const setProductDetails = async productDetails => {
  await Store.setObj("ProductDetails", productDetails);
  return;
};

export const getProductDetails = async () => {
  const pd = await Store.getObj("ProductDetails");
  return pd;
};

export default Store;
