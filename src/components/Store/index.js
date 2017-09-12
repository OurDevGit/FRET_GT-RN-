import React from "react";
import { View } from "react-native";
import { realmify } from "../../realm";

import { syncStore } from "../../Store";

import Categories from "./Categories";
import SubCategories from "./SubCategories";
import Media from "./Media";
import { StoreDark, StoreLight, LibraryDark, LibraryLight } from "../../design";

const testPurchase = media => {};

class Store extends React.PureComponent {
  state = {
    categoryIndex: 0,
    subCategoryIndex: null,
    subCategories: [],
    media: [],
    isStore: true
  };

  handleChooseCategory = (category, categoryIndex) => {
    if (category.subCategories.length === 0) {
      let m = category.media.sorted("title").slice(11, 23);

      this.setState({
        media: [{ data: m, title: "category list" }],
        subCategoryIndex: null,
        subCategories: [],
        categoryIndex
      });
    } else {
      if (category.isGrouped === true) {
        let media = category.subCategories.map(subCat => {
          return {
            data: subCat.media,
            title: subCat.title
          };
        });

        this.setState({
          media,
          subCategoryIndex: null,
          subCategories: []
        });
      } else {
        this.setState({
          categoryIndex,
          subCategoryIndex: 0,
          subCategories: category.subCategories
        });

        this.handleChooseSubCategory(category.subCategories[0], 0);
      }
    }
  };

  handleChooseSubCategory = (subCategory, subCategoryIndex) => {
    this.setState({
      media: [
        { data: subCategory.media.sorted("title"), title: "Sub Category" }
      ],
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
          style={{ width: 90, flexGrow: 0 }}
          selectedIndex={this.state.categoryIndex}
          isStore={this.state.isStore}
        />

        <SubCategories
          subCategories={this.state.subCategories}
          onChoose={this.handleChooseSubCategory}
          style={{ width: 90, flexGrow: 0 }}
          selectedIndex={this.state.subCategoryIndex}
          isStore={this.state.isStore}
        />

        <Media
          style={{ flexGrow: 1 }}
          media={this.state.media}
          onStoreChange={this.handleStoreChange}
        />
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

  handleStoreChange = isStore => {
    console.debug(`set store ${isStore}`);
    this.setState({ isStore });
  };
}

const mapQueriesToProps = (realm, ownProps) => {
  return {
    categories: realm.objects("Category")
  };
};

export default realmify(mapQueriesToProps)(Store);
