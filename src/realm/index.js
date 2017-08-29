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
import Favorite from "./Favorite";
import Loop from "./Loop";

import { mapProps, withProps, lifecycle, compose } from "recompose";

const schema0 = [
  Media,
  Category,
  SubCategory,
  Group,
  Pattern,
  PatternNote,
  PatternReference,
  PatternRoot,
  Favorite,
  Loop
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
  var queries = mapQueries(realm);
  var mutations = makeMutations({
    realm,
    delete: obj => {
      realm.delete(obj);
    },
    create: (className, obj) => {
      realm.create(className, obj);
    }
  });

  for (key in mutations) {
    let func = mutations[key];
    if (typeof func === "function") {
      mutations[key] = (...rest) => {
        realm.write(() => {
          func(...rest);
        });
      };
    }
  }

  const queriesWrapper = lifecycle({
    state: { queries, mutations },
    componentDidMount() {
      // put a listener on each key so that when updates come through, we update the props
      for (key in queries) {
        queries[key].addListener((objs, changes) => {
          // update this key with the latest
          queries[key] = objs;
          this.setState({ queries });
        });
      }
    },
    componentWillUnmount() {
      console.debug("queriesWrapper will umount!");
      for (key in queries) {
        queries[key].removeAllListeners();
      }
    }
  });

  const realmProps = { ...queries, ...mutations };

  return compose(queriesWrapper, withProps({ ...realmProps }));
};

// export const mapQueriesToProps = mapProps(props => );
