import Realm from "realm";
import Media from "./Media";
import Category from "./Category";
import SubCategory from "./SubCategory";
import Group from "./Group";
import Pattern from "./Pattern";
import PatternNote from "./PatternNote";
import PatternReference from "./PatternReference";
import PatternRoot from "./PatternRoot";

const schema0 = [
  Media,
  Category,
  SubCategory,
  Group,
  Pattern,
  PatternNote,
  PatternReference,
  PatternRoot
];
const migrationFunction1 = (oldRealm, newRealm) => {};

const schemas = [
  // { schema: schema1, schemaVersion: 1 } //,
  // { schema: schema2, schemaVersion: 2, migration: migrationFunction1 },
];

// the first schema to update to is the current schema version
// since the first schema in our array is at
let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);
console.log({ nextSchemaIndex });

var realm = null;

if (nextSchemaIndex === -1) {
  console.log("first realm");
  // const schema = schemas[schemas.length - 1];
  // console.debug(schema);
  realm = new Realm({ schema: schema0 });
} else {
  realm = new Realm({ schema: schema0 });
}

// while (nextSchemaIndex < schemas.length) {
//   const migratedRealm = new Realm(schemas[nextSchemaIndex++]);
//   migratedRealm.close();
// }

// // open the Realm with the latest schema
// Realm.open(schemas[schemas.length - 1])
//   .then(realm => {
//     console.debug(realm);
//   })
//   .catch(err => console.error(err));

export default realm;
