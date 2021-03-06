import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
  TouchableOpacity
} from "react-native";
import { getIsPhone } from "../../utils";
import { connect } from "react-redux";

import * as actions from "../../redux/actions";
import {
  setCategoryIndex,
  setSubCategoryIndex,
  getUIState
} from "../../models/Store";

import Categories from "./Categories";
import Media from "./Media";

const ModalOnTablet = ({ onClose, children }) =>
  getIsPhone() ? (
    children
  ) : (
    <Modal animationType="fade" transparent={true} onRequestClose={onClose}>
      <View style={styles.container}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <View activeOpacity={1} style={styles.content}>
          {children}
        </View>
      </View>
    </Modal>
  );

ModalOnTablet.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

class Store extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      categoryIndex: 0,
      category: null,
      subCategory: null,
      subCategoryIndex: 0,
      subCategories: [],
      media: [],
      isStore: true
    };
  }

  render() {
    return (
      <ModalOnTablet onClose={this.props.onClose}>
        <View
          style={{
            width: "100%",
            height: "100%",
            position: getIsPhone() ? "absolute" : "relative",
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
          {this.state.subCategories.length > 0 && (
            <Categories
              categories={this.state.subCategories}
              onChoose={this.handleChooseSubCategory}
              style={{ width: 90, flexGrow: 0 }}
              selectedIndex={this.state.subCategoryIndex}
              isStore={this.state.isStore}
            />
          )}
          <View style={{ flexShrink: 1 }}>
            <KeyboardAvoidingView style={styles.media} behavior="padding">
              <Media
                detailMediaId={this.props.detailMediaId || ""}
                category={this.state.category}
                subCategory={this.state.subCategory}
                group={this.state.group}
                onIsStoreChange={this.handleIsStoreChange}
                onChoose={this.handleChooseMedia}
                onClose={this.props.onClose}
                isExpandable={
                  (this.state.subCategory || {}).isNavigable === true ||
                  (this.state.category || {}).isGrouped === true
                }
              />
            </KeyboardAvoidingView>
          </View>
        </View>
      </ModalOnTablet>
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

    // this.handleChooseSubCategory(subCategory, subCategoryIndex);
  }

  componentDidMount() {
    // sync with the backend
    this.props.refreshStore();
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

  handleChooseCategory = (
    category,
    categoryIndex,
    subCategory,
    subCategoryIndex
  ) => {
    if (!category) {
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
        const subCategoryState = this.handleChooseSubCategory(
          subCategory || subCategories[0],
          subCategoryIndex || 0,
          true
        );

        this.setState({
          categoryIndex,
          category,
          subCategories,
          ...subCategoryState
        });
      }
    }

    setCategoryIndex(categoryIndex);
  };

  handleChooseSubCategory = (
    subCategory,
    subCategoryIndex,
    skipSetState = false
  ) => {
    if (!subCategory) {
      return;
    }
    // console.debug(`choose sub-category: ${subCategoryIndex}`);

    const newState = {
      subCategory,
      subCategoryIndex
    };

    if (skipSetState === false) {
      this.setState(newState);
    }

    setSubCategoryIndex(subCategoryIndex);

    return newState;
  };

  handleChooseMedia = async mediaId => {
    // action
    this.props.chooseMedia(mediaId);

    // if we re-choose the current media, then nothing will change in props and the Store won't close.
    // In this case, we close manually here
    if (mediaId === this.props.currentMedia) {
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
  categories: PropTypes.array,
  subCategories: PropTypes.object,
  group: PropTypes.array,
  chooseMedia: PropTypes.func.isRequired, // action
  onClose: PropTypes.func.isRequired,
  refreshStore: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(1,1,1,0.5)",
    width: "100%",
    height: "100%"
  },
  content: {
    width: "90%",
    height: "90%"
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginHorizontal: 4,
    height: 50,
    textAlignVertical: "center",
    marginLeft: 10
  },
  scrollView: {}
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
