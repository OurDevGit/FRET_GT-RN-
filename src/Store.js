import { fetchStore } from "./api";
import realm from "./realm";

const makeGroup = (group, store) => {
  return group;
};

const makeSubCategory = (subCategory, store) => {
  const groups = store.groups[subCategory.id] || [];

  // if (groups) {
  //   groups.forEach(group => {
  //     makeGroup(group, store);
  //   });
  // }

  return {
    ...subCategory,
    groups: groups.map(group => makeGroup(group, store))
  };
};

const saveCategory = (category, store) => {
  const subCategories = store.subCategories[category.id] || [];

  // if (subCategories) {
  //   subCategories.forEach(subCategory => {
  //     makeSubCategory(subCategory, store);
  //   });
  // }

  const treedCategory = {
    ...category,
    subCategories: subCategories.map(subCategory =>
      makeSubCategory(subCategory, store)
    )
  };

  console.debug(treedCategory);

  realm.create("Category", treedCategory, true);
};

const makeNormalizedMedia = media => {
  var byId = {};
  media.forEach(m => {
    byId[m.id] = m;
  });

  return byId;
};

export const syncStore = () => {
  fetchStore().then(store => {
    console.debug("got store");
    // console.debug(store);

    const {
      categories,
      categoryLists,
      groupLists,
      groups,
      media,
      mediaLists,
      sorting,
      subCategories,
      subCategoryLists
    } = store;

    console.debug(store);
    // groups.forEach(group => {
    //   console.debug(group);
    // });

    const mediaById = makeNormalizedMedia(media);

    console.debug(mediaById);

    realm.write(() => {
      categories.forEach(category => {
        saveCategory(category, { ...store, mediaById });
      });
    });
  });
};
