import { AsyncStorage } from "react-native";
import { zip, keyBy } from "lodash";

const makeIdMap = (objects, idKey = "id") => {
  var byId = {};

  objects.forEach(o => {
    if (o.has) {
      byId[o[idKey]] = o;
    }
  });

  return byId;
};

const setObj = async (key, val) => {
  try {
    return await AsyncStorage.setItem(`@Store:${key}`, JSON.stringify(val));
  } catch (error) {
    return null;
  }
};

const setObjs = async (keys, vals) => {
  const namespacedKeys = keys.map(k => `@Store:${k}`);
  const stringVals = vals.map(v => JSON.stringify(v));
  const arrays = zip(namespacedKeys, stringVals);

  try {
    return await AsyncStorage.multiSet(arrays);
  } catch (error) {
    return null;
  }
};

const getObj = async key => {
  try {
    let itemString = await AsyncStorage.getItem(`@Store:${key}`);
    return JSON.parse(itemString);
  } catch (error) {
    return null;
  }
};

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
  const categoriesById = keyBy(categories, "id");
  const subCategoriesById = keyBy(subCategories, "id");
  const groupsById = keyBy(groups, "id");

  await setObjs(
    [
      "categories",
      "subCategoriesByCategoryId",
      "groupsBySubCategoryId",
      "mediaByListId",
      "mediaById",
      "sorting"
    ],
    [
      categories,
      subCategories,
      groups,
      { ...categoryLists, ...subCategoryLists, ...groupLists },
      mediaById,
      sorting
    ]
  );

  // console.debug("stored categories");
};
