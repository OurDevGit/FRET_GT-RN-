import { GetMediaButtonMode } from "../../../models/Media";

export const filterMedia = (media, tabIndex, navigableOpenSection) => {
  // console.time("filterMedia");
  var preFilteredMedia = media;

  if (navigableOpenSection !== null) {
    preFilteredMedia = media.map(mediaList => ({
      ...mediaList,
      data: mediaList.title === navigableOpenSection ? mediaList.data : []
    }));
  }

  var filteredMedia = null;
  switch (tabIndex) {
    case 1: {
      // filter just the stuff we've bought (don't show stuff with a GetMode of Purchase)
      filteredMedia = preFilteredMedia.map(mediaList => ({
        ...mediaList,
        data: mediaList.data.filter(
          m =>
            m.getMode !== GetMediaButtonMode.Purchase &&
            m.getMode !== GetMediaButtonMode.ComingSoon
        )
      }));
      break;
    }
    case 2:
      // filter just the stuff we can play
      filteredMedia = preFilteredMedia.map(mediaList => ({
        ...mediaList,
        data: mediaList.data.filter(m => m.getMode === GetMediaButtonMode.Play)
      }));
      break;
    default:
      filteredMedia = preFilteredMedia;
  }

  // console.time("filterMedia");
  return filteredMedia;
};

export const getItemLayout = (data, index) => {
  return {
    length: 51,
    offset: 51 * index,
    index
  };
};

export const extractItemKey = item => item.mediaID;
