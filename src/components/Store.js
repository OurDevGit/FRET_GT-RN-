import React from "react";
import { View, Text, FlatList } from "react-native";
import { realmify } from "../realm";

import { syncStore } from "../Store";

import Categories from "./Categories";
import SubCategories from "./SubCategories";

class Store extends React.PureComponent {
  state = {
    subCategories: []
  };

  handleChooseCategory = category => {
    if (category.subCategories.length === 0) {
      console.debug("no sub categories");
    } else {
      console.debug(` ${category.subCategories.length} sub categories`);
    }

    this.setState({
      subCategories: category.subCategories
    });
  };

  handleChooseSubCategory = subCategory => {};

  render() {
    return (
      <View
        style={{
          alignSelf: "flex-end",
          width: "50%",
          height: "100%",
          backgroundColor: "#eee",
          flexDirection: "row"
        }}
      >
        <Categories
          categories={this.props.categories}
          onChoose={this.handleChooseCategory}
          style={{ width: 50 }}
        />
        <SubCategories
          subCategories={this.state.subCategories}
          onChoose={this.handleChooseSubCategory}
          style={{ width: 50 }}
        />
      </View>
    );
  }

  componentDidMount() {
    // syncStore();
  }

  componentWillReceiveProps(newProps) {}
}

const mapQueriesToProps = (realm, ownProps) => {
  console.debug({ ownProps });

  return {
    categories: realm.objects("Category")
  };
};

export default realmify(mapQueriesToProps)(Store);
