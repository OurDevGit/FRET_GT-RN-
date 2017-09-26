import { AsyncStorage } from "react-native";
import { keyBy } from "lodash";

import { makeStore } from "./StorageFactory";

const Faves = makeStore("Favorites");

export const getFave = async mediaId => {
  const isFaved = await Faves.getObj(mediaId);
  return isFaved === true ? true : false; // enforce we return only true or false (instead of null, etc. by accident)
};

export const toggleFave = async mediaId => {
  const isFaved = await getFave(mediaId);
  await Faves.setObj(mediaId, !isFaved);

  return !isFaved;
};
