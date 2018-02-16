import { AsyncStorage } from "react-native";
import { toPairs, fromPairs, mapKeys, mapValues } from "lodash";

const makeNamespacedKey = (name, key) => `@${name}:${key}`;
const unNamespaceKey = (name, key) => key.slice(name.length + 2);

export const makeStore = storeName => {
  return {
    // set a single object
    setObj: async (key, val) => {
      try {
        return await AsyncStorage.setItem(
          makeNamespacedKey(storeName, key),
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
        const nameKey = makeNamespacedKey(storeName, key);
        // console.debug(`going to AsyncStorage for item: ${nameKey}`);
        let itemString = await AsyncStorage.getItem(nameKey);
        // console.debug(`got value for ${nameKey}`);
        return JSON.parse(itemString);
      } catch (error) {
        console.error(error);
        return null;
      }
    },

    // get multiple objects
    getObjs: async keys => {
      try {
        const namespacedKeys = keys.map(key =>
          makeNamespacedKey(storeName, key)
        );
        // console.debug(`going to AsyncStorage for items: ${namespacedKeys}`);
        const objs = await AsyncStorage.multiGet(namespacedKeys);
        // console.debug(`got _${objs.length}_ values`);
        const keyValsNamespaced = fromPairs(objs);
        const keyValsPlainKeys = mapKeys(keyValsNamespaced, (val, key) =>
          unNamespaceKey(storeName, key)
        );
        const keyVals = mapValues(keyValsPlainKeys, val => JSON.parse(val));
        return keyVals;
      } catch (error) {
        console.error(error);
        return [];
      }
    },

    // set multiple objects
    setObjs: async keyValMap => {
      const namespaced = mapKeys(keyValMap, (v, k) =>
        makeNamespacedKey(storeName, k)
      );
      const stringified = mapValues(namespaced, val => JSON.stringify(val));
      const pairs = toPairs(stringified);

      try {
        return await AsyncStorage.multiSet(pairs);
      } catch (error) {
        return null;
      }
    },

    getAllKeys: async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const myAllKeys = allKeys.filter(
          key => key.indexOf(`@${storeName}`) === 0
        );
        const withoutNamespace = myAllKeys.map(key =>
          key.slice(storeName.length + 2)
        );
        return withoutNamespace;
      } catch (error) {
        console.error(error);
      }
    },

    deleteKey: async key => {
      try {
        return await AsyncStorage.removeItem(makeNamespacedKey(storeName, key));
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  };
};
