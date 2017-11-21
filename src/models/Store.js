import { keyBy } from "lodash";
import { uniq, values, flatten, includes } from "lodash";
import { getIsPhone } from "../utils";

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

  const deviceIsPhone = getIsPhone();
  const liveMedia = media.filter(m => {
    var isCompatible = true;

    if (m.device) {
      if (
        (m.device === "phone" && deviceIsPhone === false) ||
        (m.device === "tablet" && deviceIsPhone === true)
      ) {
        isCompatible = false;
      }
    }

    return m.isLive === true && isCompatible;
  });

  const listedMediaIds = uniq(
    flatten(
      values(subCategoryLists)
        .concat(values(categoryLists))
        .concat(values(groupLists))
    )
  );

  const sortMedia = liveMedia.map(m => ({
    ...m,
    sortTitle:
      m.title !== undefined && m.title.toLowerCase().indexOf("the ") === 0
        ? m.title.slice(4)
        : m.title,
    sortArtist:
      m.artist !== undefined && m.artist.toLowerCase().indexOf("the ") === 0
        ? m.artist.slice(4)
        : m.artist
  }));

  const listedMedia = sortMedia.filter(m =>
    includes(listedMediaIds, m.mediaID)
  );

  const mediaById = keyBy(sortMedia, "mediaID");
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
    // listedMediaIds,
    listedMedia,
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
    "storeSorting",
    "listedMedia"
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

export const setCategoryIndex = async index => {
  return Store.setObj("categoryIndex", index);
};

export const setSubCategoryIndex = async index => {
  return Store.setObj("subCategoryIndex", index);
};

export const setGroupIndex = async index => {
  return Store.setObj("groupIndex", index);
};

export const setTabIndex = async index => {
  return Store.setObj("tabIndex", index);
};

export const getUIState = async () => {
  const categoryIndex = await Store.getObj("categoryIndex");
  const subCategoryIndex = await Store.getObj("subCategoryIndex");
  const groupIndex = await Store.getObj("groupIndex");
  const tabIndex = (await Store.getObj("tabIndex")) || 0;

  return {
    categoryIndex,
    subCategoryIndex,
    groupIndex,
    tabIndex
  };
};

export default Store;
