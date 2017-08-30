import React from "react";
import Realm from "realm";
import { omit } from "lodash";
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

const updateQueries = (queries, mapQueriesUserFunc, ownProps) => {
  // remove any existing listeners
  let mappedQueries = mapQueriesUserFunc(realm, ownProps);

  return mappedQueries;
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
      // console.debug("componentDidMount");

      let queries = updateQueries(
        this.state.queries,
        mapQueriesUserFunc,
        this.props
      );

      for (key in queries) {
        queries[key].removeAllListeners();

        queries[key].addListener((objs, changes) => {
          console.debug("update via componentDidMount!");
          // console.debug(setState);
          // update this key with the latest
          queries[key] = objs;
          this.setState({
            queries
          });
        });
      }

      this.setState({
        queries
      });
    },

    componentWillReceiveProps(newProps) {
      // console.debug("componentWillReceiveProps");

      let queries = updateQueries(
        this.state.queries,
        mapQueriesUserFunc,
        this.props,
        this
      );

      for (key in queries) {
        queries[key].removeAllListeners();

        queries[key].addListener((objs, changes) => {
          console.debug("update via componentWillReceiveProps!");
          // update this key with the latest
          queries[key] = objs;
          this.setState({
            queries
          });
        });
      }

      this.setState({
        queries
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

  return compose(
    queriesWrapperHOC,
    mapProps(props => {
      return {
        ...omit(props, ["queries", "mutations"]),
        ...props.queries,
        ...props.mutations
      };
    })
  );
};
