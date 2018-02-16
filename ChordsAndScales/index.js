const sqlite3 = require("sqlite3").verbose();
const chordsScalesData = require("./chordsAndScales.json");

// console.log(chordsScalesData);
// console.log(chordsScalesData.length);

const buildInsert = entry => {
  var sql = `INSERT INTO chords_and_scales (
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
    "${entry.patternId}", 
    ?, 
    "${entry.sortIndex}", 
    "${entry.csCategory}",
    "${entry.csType}",
    "${entry.csKey}",
    "${entry.csPosition}",
    "${entry.imageName}",
    "${entry.altImage}",
    "${entry.title}",
    "${entry.subTitle}"
  )`;
  // console.log(sql);
  return sql;
};

// open the database connection
let db = new sqlite3.Database("./db/cs.db");

const doImport = () => {
  chordsScalesData.forEach(entry => {
    const sql = buildInsert(entry);

    // console.log(sql);

    db.run(sql, [JSON.stringify(entry.noteData)], function(err) {
      if (err) {
        return console.error(err.message);
      }
      console.log(`Rows inserted ${this.changes}`);
    });
  });
};

doImport();

db.close();
