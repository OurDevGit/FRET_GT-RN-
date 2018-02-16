import { fetchChordsAndScalesData } from "../api";
import {
  getSync,
  setSync,
  importNewPatterns,
  getAllCsCategories,
  getCsTypes,
  getCsKeys,
  getCsPositions,
  getCsPattern,
  getCsPatternById,
  getCsPatterns
  // countPatterns
} from "../models/Patterns";

export const syncChordsAndScales = async () => {
  // const csCount = await countPatterns();
  // console.debug(`${csCount} rows before`);

  // console.debug("syncing C&S");
  const syncTime = await getSync();
  // console.debug({ syncTime });
  const apiResult = await fetchChordsAndScalesData(syncTime);

  const importDidFinish = await importNewPatterns(apiResult);
  if (importDidFinish === true) {
    // console.debug("sync finished!");
    const now = new Date().valueOf() / 1000;
    // console.debug({ now });
    await setSync(now);

    // let csCount2 = await countPatterns();
    // console.debug(`${csCount2} rows after`);
  }

  /**
   * API testing for all the queries
   */
  const doTestQueries = false;

  if (doTestQueries === true) {
    try {
      const categories = await getAllCsCategories();
      const category = categories[1];
      const types = await getCsTypes(category);
      const type = types[0];
      const keys = await getCsKeys(category, type);
      const key = keys[0];
      const positions = await getCsPositions(category, type, key);
      const position = positions[0];
      const pattern = await getCsPattern(category, type, key, position);
      const idPattern = await getCsPatternById(pattern.patternId);
      const patterns = await getCsPatterns(category, type, key);

      console.debug({
        categories,
        types,
        keys,
        positions,
        idPattern,
        patterns
      });
    } catch (err) {
      console.debug(err);
    }
  }
};
