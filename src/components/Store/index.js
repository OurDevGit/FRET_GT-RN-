import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";

import * as actions from "../../redux/actions";
import {
  getStore,
  getProductDetails,
  setCategoryIndex,
  setSubCategoryIndex,
  setGroupIndex,
  setTabIndex,
  getUIState
} from "../../models/Store";
import { loadedPurchased } from "../../models/Purchases";

import Categories from "./Categories";
import SubCategories from "./SubCategories";
import Media from "./Media";

class Store extends Component {
  state = {
    isMounted: false,
    categoryIndex: 0,
    category: null,
    subCategory: null,
    subCategoryIndex: null,
    subCategories: [],
    media: [],
    isStore: true
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
          style={styles.media}
          category={this.state.category}
          subCategory={this.state.subCategory}
          group={this.state.group}
          onIsStoreChange={this.handleIsStoreChange}
          isStore={this.state.isStore}
          onChoose={this.handleChooseMedia}
          onClose={this.props.onClose}
          isNavigableSubCategory={
            (this.state.subCategory || {}).isNavigable === true
          }
        />
      </View>
    );
  }

  async componentWillMount() {
    // load the Store data from storage
    const storeObjects = await getStore();
    const productDetails = await getProductDetails();
    const purchases = await loadedPurchased();

    this.props.setPurchasedMedia(purchases);
    this.props.storeLoaded(storeObjects);
    this.props.productDetailsLoaded(productDetails);

    // load the UI state
    const { categoryIndex, subCategoryIndex } = await getUIState();
    const category = this.props.categories[categoryIndex];
    const subCategory = this.getSubCategory(
      this.props,
      category,
      subCategoryIndex
    );

    this.handleChooseCategory(
      category,
      categoryIndex,
      subCategory,
      subCategoryIndex
    );
    this.handleChooseSubCategory(subCategory, subCategoryIndex);

    this.setState({ isMounted: true });
  }

  async componentDidMount() {
    // sync with the backend
    this.props.refreshStore();
  }

  componentWillReceiveProps(newProps) {
    // console.debug("Store gets props");

    // skip if we aren't mounted. componentWillMount is async here, so this can happen too soon.
    if (this.state.isMounted !== true) {
      return;
    }

    // console.debug(newProps.categories.length);
    if (newProps.categories.length > this.state.categoryIndex) {
      const category = newProps.categories[this.state.categoryIndex];
      const subCategory = this.getSubCategory(
        newProps,
        category,
        this.state.subCategoryIndex
      );
      this.handleChooseCategory(
        newProps.categories[this.state.categoryIndex],
        this.state.categoryIndex,
        subCategory,
        this.state.subCategoryIndex
      );
    }
  }

  handleChooseCategory = async (
    category,
    categoryIndex,
    subCategory,
    subCategoryIndex
  ) => {
    // console.debug(categoryIndex, category);

    if (!category) {
      return;
    }

    await setCategoryIndex(categoryIndex);
    const subCategories = this.props.subCategories[category.id];

    // category without sub-categories
    if (subCategories === undefined) {
      this.setState({
        categoryIndex,
        category,
        subCategoryIndex: null,
        subCategory: null,
        subCategories: []
      });
    } else {
      // category with Grouped sub-categories
      if (category.isGrouped === true) {
        this.setState({
          categoryIndex,
          category,
          subCategoryIndex: null,
          subCategory: null,
          subCategories: []
        });
      } else {
        // select the first subcategory in this category
        this.setState({
          categoryIndex,
          category,
          subCategories
        });

        this.handleChooseSubCategory(
          subCategory || subCategories[0],
          subCategoryIndex || 0
        );
      }
    }
  };

  handleChooseSubCategory = (subCategory, subCategoryIndex) => {
    if (!subCategory) {
      return;
    }
    const groups = this.props.groups[subCategory.id];
    setSubCategoryIndex(subCategoryIndex);

    this.setState({
      subCategory,
      subCategoryIndex
    });
  };

  handleChooseMedia = async media => {
    // action
    this.props.chooseMedia(media);

    // if we re-choose the current media, then nothing will change in props and the Store won't close.
    // In this case, we close manually here
    if (media.mediaID === this.props.currentMedia) {
      this.props.onClose();
    }
  };

  handleIsStoreChange = isStore => {
    this.setState({ isStore });
  };

  getSubCategory = (props, category, subCategoryIndex) => {
    if (category !== undefined && category !== null) {
      const subCategories = this.props.subCategories[category.id];
      if (subCategoryIndex !== undefined && subCategoryIndex !== null) {
        return subCategories[subCategoryIndex];
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
}

Store.propTypes = {
  currentMedia: PropTypes.string,
  categories: PropTypes.array,
  subCategories: PropTypes.object,
  group: PropTypes.array,
  chooseMedia: PropTypes.func.isRequired, // action
  onClose: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  media: {
    flexGrow: 1
  }
});

const mapStateToProps = state => {
  // console.debug("mapping state to props in Store/index");
  const cats = state.get("categories");

  return {
    categories: cats.toJS(),
    subCategories: state.get("subCategoriesByCategoryId").toJS(),
    groups: state.get("groupsBySubCategoryId").toJS(),
    currentMedia: state.get("currentMedia")
  };
};

export default connect(mapStateToProps, actions)(Store);
