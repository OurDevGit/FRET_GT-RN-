import { fetchStore } from "./api";
import realm from "./realm";
import _ from "lodash";

const mediaForIds = (mediaIds, mediaById) => {
  if (_.isNil(mediaIds) || _.isNil(mediaById)) {
    return [];
  }

  const atted = _.at(mediaById, mediaIds);

  // console.debug(atted);

  return atted || [];
};

const makeGroup = (group, store) => {
  return group;
};

const makeSubCategory = (subCategory, store) => {
  const groups = store.groups[subCategory.id] || [];

  const subCat = {
    ...subCategory,
    media: mediaForIds(store.subCategoryLists[subCategory.id], store.mediaById),
    groups: groups.map(group => makeGroup(group, store))
  };

  // console.debug(
  //   `Sub-Category ${subCategory.title} has ${subCat.media.length} media`
  // );

  return subCat;
};

const saveCategory = (category, store) => {
  const subCategories = store.subCategories[category.id] || [];

  let treedCategory = {
    ...category,
    subCategories: subCategories.map(subCategory =>
      makeSubCategory(subCategory, store)
    )
  };

  // handle Client-Sided categories
  if (category.isClientSided) {
    if (category.title === "All Content") {
      treedCategory.media = store.media; // All Content gets all media
    } else if (category.title === "Wishlist") {
      // favorites here
    }
  } else {
    // regular (not client-sided) category media
    // treedCategory.media = store.categoryLists[category.id] || [];
  }

  // console.debug(treedCategory);

  realm.create("Category", treedCategory, true);
};

const makeNormalizedMedia = media => {
  // const datedMedia = media.map(m => {
  //   let dMedia = { ...m };
  //   dMedia.updated_at = new Date(dMedia.updated_at);
  //   return dMedia;
  // });

  var byId = {};
  media.forEach(m => {
    byId[m.mediaID] = m;
  });

  return byId;
};

export const syncStore = () => {
  fetchStore().then(store => {
    // console.debug("got store");
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

    const mediaById = makeNormalizedMedia(media);

    realm.write(() => {
      categories.forEach(category => {
        saveCategory(category, { ...store, mediaById });
      });
    });
  });
};