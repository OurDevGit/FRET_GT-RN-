import { makeStore } from "./StorageFactory";
import SQLite from "react-native-sqlite-storage";
import { Sentry } from "react-native-sentry";

var db_ = null;

// SQLite database
// SQLite.DEBUG(true);
SQLite.enablePromise(true);
const dbName = "Chords and Scales";

const Patterns = makeStore("HomeCache");

export const getSync = async () => {
  const sync = (await Patterns.getObj("SYNC")) || 0;
  const syncTime = sync;

  // return 1488549848 / 1000; // use this to force a sync for testing

  return syncTime;
};

export const setSync = time => Patterns.setObj("SYNC", time);

/**
 * Patterns in the SQLite database
 */

const getDb = async () => {
  if (db_ !== null) {
    if (db_.openDBs[dbName] === "OPEN") {
      // console.debug("database already open");
      return db_;
    }
  }

  db_ = await SQLite.openDatabase({
    name: dbName,
    createFromLocation: "~data/cs.db"
  });

  return db_;
};

export const importNewPatterns = async patterns => {
  // console.debug("import new patterns");
  // console.debug(patterns.length);
  //console.debug("importNewPatterns", patterns);

  const buildDelete = pattern =>
    `DELETE FROM chords_and_scales WHERE patternId = "${pattern.patternId}"`;

  const buildInsert = pattern => {
    return [
      `INSERT INTO chords_and_scales (
        patternId,
        noteData, 
        sortIndex, 
        category, 
        type, 
        key, 
        position, 
        imageName, 
        altImage,
        title,
        subTitle
      ) VALUES (
        "${pattern.patternId}",
        ?, 
        "${pattern.sortIndex}", 
        "${pattern.csCategory}",
        "${pattern.csType}",
        "${pattern.csKey}",
        "${pattern.csPosition}",
        "${pattern.imageName}",
        "${pattern.altImage}",
        "${pattern.title}",
        "${pattern.subTitle}"
      )`,
      [JSON.stringify(pattern.noteData)]
    ];
  };

  try {
    const db = await getDb();

    const deletes = patterns.map(buildDelete);
    const inserts = patterns.map(buildInsert);
    const statements = deletes.concat(inserts);
    // console.debug(deletes);
    // console.debug(deletes.length, inserts.length);
    // console.debug(statements);

    await db.sqlBatch(statements);

    return true;
  } catch (err) {
    console.warn(err);

    return false;
  }
};

const makePattern = sqlRow => {
  if (sqlRow === undefined) {
    return undefined;
  }

  var p = sqlRow;
  p.noteData = JSON.parse(sqlRow.noteData);

  // if any values are the string "undefined", make them actually undefined
  Object.keys(p).forEach(key => {
    if (p[key] === "undefined") {
      delete p[key];
    }
  });

  return p;
};

const makePatterns = rows => {
  return rows.map(makePattern);
};

export const getAllCsCategories = async () => {
  const db = await getDb();

  const rows = (await db.executeSql(
    `SELECT * FROM chords_and_scales WHERE category != "undefined"`
  ))[0].rows
    .raw()
    .sort((a, b) => a.sortIndex - b.sortIndex);

  const categories = rows.map(r => r.category);
  return Array.from(new Set(categories));
};

const rowsForSelections = async (category, type, key, position) => {
  var query = `SELECT * FROM chords_and_scales WHERE category = ?`;
  var params = [category];

  if (type !== undefined) {
    query += ` AND type = ?`;
    params.push(type);
  }

  if (key !== undefined) {
    query += ` AND key = ?`;
    params.push(key);
  }

  if (position !== undefined) {
    query += ` AND position = ?`;
    params.push(position);
  }

  const db = await getDb();
  const rows = (await db.executeSql(query, params))[0].rows
    .raw()
    .sort((a, b) => a.sortIndex - b.sortIndex);

  return rows;
};

export const getCsTypes = async category => {
  let rows = await rowsForSelections(category);
  const types = rows.map(r => r.type);
  return Array.from(new Set(types));
};

export const getCsKeys = async (category, type) => {
  let rows = await rowsForSelections(category, type);
  const keys = rows.map(r => r.key);
  return Array.from(new Set(keys));
};

export const getCsPositions = async (category, type, key) => {
  let rows = await rowsForSelections(category, type, key);
  const positions = rows.map(r => r.position);
  return Array.from(new Set(positions));
};

export const getCsPattern = async (category, type, key, position) => {
  let rows = await rowsForSelections(category, type, key, position);
  // because we don't know if selection is complete
  // return only if there is one pattern
  return rows.length < 2 ? makePattern(rows[0]) : undefined;
};

export const getCsPatterns = async (category, type, key) => {
  let rows = await rowsForSelections(category, type, key);
  return makePatterns(rows);
};

export const getCsPatternById = async id => {
  const db = await getDb();

  const rows = (await db.executeSql(
    `SELECT * FROM chords_and_scales WHERE patternId = ?`,
    [id]
  ))[0].rows.raw();

  return makePattern(rows[0]);
};

export const countPatterns = async () => {
  const db = await getDb();

  const result = await db.executeSql(`SELECT * FROM chords_and_scales`);
  const length = result[0].rows.length;

  return length;
};
