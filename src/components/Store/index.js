import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { connect } from "react-redux";

import * as actions from "../../redux/actions";
import { loadPurchases } from "../../models/Products";
import { getStore, getProductDetails } from "../../models/Store";

import Categories from "./Categories";
import SubCategories from "./SubCategories";
import Media from "./Media";

class Store extends Component {
  state = {
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
          style={{ flexGrow: 1 }}
          category={this.state.category}
          subCategory={this.state.subCategory}
          group={this.state.group}
          onIsStoreChange={this.handleIsStoreChange}
          onChoose={this.handleChooseMedia}
          onClose={this.props.onClose}
        />
      </View>
    );
  }

  async componentWillMount() {
    // load the Store data from storage
    const storeObjects = await getStore();
    const productDetails = await getProductDetails();

    this.props.storeLoaded(storeObjects);
    this.props.productDetailsLoaded(productDetails);
  }

  async componentDidMount() {
    // sync with the backend
    this.props.refreshStore();

    // load which products we own from Google
    const purchasedMedia = await loadPurchases();
    this.props.setPurchasedMedia(purchasedMedia);
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

  handleChooseCategory = (category, categoryIndex) => {
    // console.debug(categoryIndex, category);

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

        this.handleChooseSubCategory(subCategories[0], 0);
      }
    }
  };

  handleChooseSubCategory = (subCategory, subCategoryIndex) => {
    console.debug(subCategoryIndex, subCategory);

    const groups = this.props.groups[subCategory.id];

    this.setState({
      subCategory,
      subCategoryIndex
    });
  };

  handleChooseMedia = async media => {
    // action
    this.props.chooseMedia(media);
  };

  handleIsStoreChange = isStore => {
    this.setState({ isStore });
  };
}

Store.propTypes = {
  chooseMedia: PropTypes.func.isRequired, // action
  onClose: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  // console.debug("mapping state to props in Store/index");
  const cats = state.get("categories");

  return {
    categories: cats.toJS(),
    subCategories: state.get("subCategoriesByCategoryId").toJS(),
    groups: state.get("groupsBySubCategoryId").toJS()
  };
};

export default connect(mapStateToProps, actions)(Store);
