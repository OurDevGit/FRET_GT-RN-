import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { connect } from "react-redux";

import * as actions from "../../redux/actions";
import {
  setCategoryIndex,
  setSubCategoryIndex,
  getUIState
} from "../../models/Store";

import Categories from "./Categories";
import SubCategories from "./SubCategories";
import Media from "./Media";

class Store extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      categoryIndex: props.categoryIndex || 0,
      category: null,
      subCategory: null,
      subCategoryIndex: props.subCategoryIndex || 0,
      subCategories: [],
      media: [],
      isStore: true
    };
  }

  isMounted_ = false;

  render() {
    // console.debug(`Store render()`);
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          flexDirection: "row",
          backgroundColor: "white"
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
        <KeyboardAvoidingView style={styles.media} behavior="padding">
          <Media
            detailMediaId={this.props.detailMediaId || ""}
            style={styles.media}
            category={this.state.category}
            subCategory={this.state.subCategory}
            group={this.state.group}
            onIsStoreChange={this.handleIsStoreChange}
            onChoose={this.handleChooseMedia}
            onClose={this.props.onClose}
            isNavigableSubCategory={
              (this.state.subCategory || {}).isNavigable === true
            }
          />
        </KeyboardAvoidingView>
      </View>
    );
  }

  async componentWillMount() {
    // load the UI state

    // load the sub/category index from props or fall back to the saved UI State
    const uiState = await getUIState();
    const categoryIndex =
      this.state.categoryIndex === 0
        ? uiState.categoryIndex
        : this.state.categoryIndex;
    const subCategoryIndex =
      this.state.subCategoryIndex === 0
        ? uiState.subCategoryIndex
        : this.state.subCategoryIndex;

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
  }

  componentDidMount() {
    this.isMounted_ = true;

    // sync with the backend
    this.props.refreshStore();
  }

  componentWillUnmount() {
    this.isMounted_ = false;
  }

  componentWillReceiveProps(newProps) {
    // console.debug("Store gets props");

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
    // since this function is async, the component can unmount here
    if (this.isMounted_ !== true) {
      return;
    }

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
    // const groups = this.props.groups[subCategory.id];
    setSubCategoryIndex(subCategoryIndex);

    this.setState({
      subCategory,
      subCategoryIndex
    });
  };

  handleChooseMedia = async media => {
    // action
    this.props.chooseMedia(media.mediaID);

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
      if (
        subCategories !== undefined &&
        subCategoryIndex !== undefined &&
        subCategoryIndex !== null
      ) {
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
  detailMediaId: PropTypes.string,
  categoryIndex: PropTypes.number,
  subCategoryIndex: PropTypes.number,
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
