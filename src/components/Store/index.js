import React from "react";
import { View } from "react-native";
import { realmify } from "../../realm";

import { syncStore } from "../../Store";

import Categories from "./Categories";
import SubCategories from "./SubCategories";
import Media from "./Media";

const testPurchase = media => {};

class Store extends React.PureComponent {
  state = {
    categoryIndex: 0,
    subCategoryIndex: null,
    subCategories: [],
    media: []
  };

  handleChooseCategory = (category, categoryIndex) => {
    if (category.subCategories.length === 0) {
      this.setState({
        media: category.media.sorted("title").slice(11, 23),
        subCategoryIndex: null
      });
    } else {
      this.handleChooseSubCategory(category.subCategories[0], 0);
    }

    this.setState({
      subCategories: category.subCategories,
      categoryIndex
    });
  };

  handleChooseSubCategory = (subCategory, subCategoryIndex) => {
    this.setState({
      media: subCategory.media.sorted("title"),
      subCategoryIndex: subCategoryIndex
    });
  };

  handleChooseMedia = media => {
    testPurchase(media);
  };

  render() {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          flexDirection: "row"
        }}
      >
        <Categories
          categories={this.props.categories}
          onChoose={this.handleChooseCategory}
          style={{ width: 90, margin: 0, padding: 0, flexGrow: 0 }}
          selectedIndex={this.state.categoryIndex}
        />

        <SubCategories
          subCategories={this.state.subCategories}
          onChoose={this.handleChooseSubCategory}
          selectedIndex={this.state.subCategoryIndex}
          style={{
            width: 90,
            backgroundColor: "#0ff",
            margin: 0,
            padding: 0,
            flexGrow: 0
          }}
        />

        <Media style={{ flexGrow: 1 }} media={this.state.media} />
      </View>
    );
  }

  componentDidMount() {
    // syncStore();
  }

  componentWillReceiveProps(newProps) {
    // console.debug("Store gets props");
    // console.debug(newProps.categories.length);

    if (newProps.categories.length > this.state.categoryIndex) {
      this.handleChooseCategory(
        newProps.categories[this.state.categoryIndex],
        this.state.categoryIndex
      );
    }
  }
}

const mapQueriesToProps = (realm, ownProps) => {
  return {
    categories: realm.objects("Category")
  };
};

export default realmify(mapQueriesToProps)(Store);
