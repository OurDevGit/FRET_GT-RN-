import React from "react";
import { View } from "react-native";
import InAppBilling from "react-native-billing";
import { connect } from "react-redux";

import * as actions from "../../redux/actions";
import { realmify } from "../../realm";
import { syncStore } from "../../Store";

import Categories from "./Categories";
import SubCategories from "./SubCategories";
import Media from "./Media";
import { StoreDark, StoreLight, LibraryDark, LibraryLight } from "../../design";

const makePurchase = media => {
  console.debug(media);

  InAppBilling.open()
    .then(() => InAppBilling.purchase(media.mediaID.toLowerCase()))
    .then(details => {
      console.log("You purchased: ", details);
      return InAppBilling.close();
    })
    .catch(err => {
      InAppBilling.close();
      console.log(err);
    });
};

class Store extends React.PureComponent {
  state = {
    categoryIndex: 0,
    subCategoryIndex: null,
    subCategories: [],
    media: [],
    isStore: true
  };

  handleChooseCategory = (category, categoryIndex) => {
    console.debug(categoryIndex, category);
    // if (category.subCategories.length === 0) {
    //   let m = category.media.sorted("title").slice(11, 23);

    //   this.setState({
    //     media: [{ data: m }],
    //     subCategoryIndex: null,
    //     subCategories: [],
    //     categoryIndex
    //   });
    // } else {
    //   if (category.isGrouped === true) {
    //     let media = category.subCategories.map(subCat => {
    //       return {
    //         data: subCat.media,
    //         title: subCat.title
    //       };
    //     });

    //     this.setState({
    //       media,
    //       subCategoryIndex: null,
    //       subCategories: []
    //     });
    //   } else {
    //     this.setState({
    //       categoryIndex,
    //       subCategoryIndex: 0,
    //       subCategories: category.subCategories
    //     });

    //     this.handleChooseSubCategory(category.subCategories[0], 0);
    //   }
    // }
  };

  handleChooseSubCategory = (subCategory, subCategoryIndex) => {
    // console.debug(subCategory.groups.length);

    if (subCategory.groups.length > 0) {
      this.setState({
        media: subCategory.groups.map(g => {
          return {
            data: g.media.sorted("title"),
            title: g.title
          };
        }),
        subCategoryIndex
      });
    } else {
      this.setState({
        media: [{ data: subCategory.media.sorted("title") }],
        subCategoryIndex
      });
    }
  };

  handleChooseMedia = media => {
    console.debug(`chose media: ${media.title}`);
    // makePurchase(media);
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
          onIsStoreChange={this.handleIsStoreChange}
          onChoose={this.handleChooseMedia}
        />
      </View>
    );
  }

  async componentDidMount() {
    const storeObjects = await syncStore();

    this.props.storeLoaded(storeObjects);
    // TODO: dispatch
  }

  componentWillReceiveProps(newProps) {
    // console.debug("Store gets props");
    // console.debug(newProps.categories.length);
    // if (newProps.categories.length > this.state.categoryIndex) {
    //   this.handleChooseCategory(
    //     newProps.categories[this.state.categoryIndex],
    //     this.state.categoryIndex
    //   );
    // }
  }

  handleIsStoreChange = isStore => {
    this.setState({ isStore });
  };
}

const mapQueriesToProps = (realm, ownProps) => {
  return {
    categories: null //realm.objects("Category")
  };
};

// export default realmify(mapQueriesToProps)(Store);

const mapStateToProps = state => {
  const cats = state.get("categories");
  console.debug(cats.toJS());
  return {
    categories: cats.toJS()
  };
};

export default connect(mapStateToProps, actions)(Store);
