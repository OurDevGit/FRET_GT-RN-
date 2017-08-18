import React from "react";
import Realm from "realm";
import Media from "./Media";
import Category from "./Category";
import SubCategory from "./SubCategory";
import Group from "./Group";
import Pattern from "./Pattern";
import PatternNote from "./PatternNote";
import PatternReference from "./PatternReference";
import PatternRoot from "./PatternRoot";

import { mapProps, withProps } from "recompose";

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

const realm = new Realm({ schema: schema0 });
export default realm;

// export const realmComp = WrappedComponent => withProps(WrappedComponent);
//   return class extends React.Component {
//     render() {
//       return <WrappedComponent />;
//     }
//   };
// };

export const realmify = (mapQueries, makeMutations = () => {}) => {
  console.debug("realmify");

  const queries = mapQueries(realm);
  const mutations = makeMutations(realm);

  console.debug("hi 2");

  const realmProps = { ...queries, ...mutations };

  return withProps({ ...realmProps });

  // return WrappedComponent => {
  //   console.debug("Wrapped!");
  //   return <WrappedComponent {...{ ...queries, ...mutations }} />;
  // };

  // return function(WrappedComponent)
};

// export const mapQueriesToProps = mapProps(props => );
