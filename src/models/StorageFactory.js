import { AsyncStorage } from "react-native";
import { toPairs, mapKeys, mapValues } from "lodash";

const makeNamespacedKey = (name, key) => `@${name}:${key}`;

export const makeStore = name => {
  return {
    // set a single object
    setObj: async (key, val) => {
      try {
        return await AsyncStorage.setItem(
          makeNamespacedKey(name, key),
          JSON.stringify(val)
        );
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    // get a single object
    getObj: async key => {
      try {
        let itemString = await AsyncStorage.getItem(
          makeNamespacedKey(name, key)
        );
        return JSON.parse(itemString);
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    // set multiple objects
    setObjs: async keyValMap => {
      const namespaced = mapKeys(keyValMap, (v, k) =>
        makeNamespacedKey(name, k)
      );
      const stringified = mapValues(namespaced, val => JSON.stringify(val));
      const pairs = toPairs(stringified);

      try {
        return await AsyncStorage.multiSet(pairs);
      } catch (error) {
        return null;
      }
    }
  };
};
