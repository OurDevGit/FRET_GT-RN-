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
  Favorite
];
const migrationFunction1 = (oldRealm, newRealm) => {};

const realm = new Realm({ schema: schema0 });
export default realm;

const updateQueries = (queries, mapQueriesUserFunc, ownProps, setState) => {
  // remove any existing listeners
  for (key in queries) {
    queries[key].removeAllListeners();
  }

  let mappedQueries = mapQueriesUserFunc(realm, ownProps);

  // put a listener on each key so that when updates come through, we update the props
  for (key in mappedQueries) {
    mappedQueries[key].addListener((objs, changes) => {
      // update this key with the latest
      mappedQueries[key] = objs;
      setState({ queries: mappedQueries });
    });
  }
};

export const realmify = (
  mapQueriesUserFunc,
  makeMutationsUserFunc = () => {}
) => {
  // pass realm stuff to the user's makeMutations function
  var mutations = makeMutationsUserFunc({
    realm,
    delete: obj => {
      realm.delete(obj);
    },
    create: (className, obj) => {
      realm.create(className, obj);
    }
  });

  // wrap each mutation function in realm.write()
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

  // keep query results up to date by mapping them into the component lifecycle
  const queriesWrapperHOC = lifecycle({
    state: { queries: {}, mutations },

    componentDidMount() {
      console.debug("componentDidMount");

      this.setState({
        queries: updateQueries(
          this.state.queries,
          mapQueriesUserFunc,
          this.props,
          this.setState
        )
      });
    },

    componentWillReceiveProps(newProps) {
      console.debug("componentWillReceiveProps");

      this.setState({
        queries: updateQueries(
          this.state.queries,
          mapQueriesUserFunc,
          this.props,
          this.setState
        )
      });
    },

    componentWillUnmount() {
      console.debug("queriesWrapper will umount!");
      console.debug(this.state);
      console.debug(this.state.queries);

      for (key in this.state.queries) {
        this.state.queries[key].removeAllListeners();
      }
    }
  });

  const realmProps = { queries: {}, ...mutations };

  return compose(queriesWrapperHOC, withProps({ ...realmProps }));
};
