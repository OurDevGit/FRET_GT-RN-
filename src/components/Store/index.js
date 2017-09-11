import React from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { realmify } from "../../realm";

import { syncStore } from "../../Store";
import { PrimaryGold } from "../../design";

import Categories from "./Categories";
import SubCategories from "./SubCategories";
import Media from "./Media";

const CloseButton = ({ title }) => (
  <TouchableOpacity onPress={() => console.log("touch")}>
    <View style={{ padding: 8, margin: 8 }}>
      <Text style={{ color: PrimaryGold }}>{title.toUpperCase()}</Text>
    </View>
  </TouchableOpacity>
);

const testPurchase = media => {};

class Store extends React.PureComponent {
  state = {
    categoryIndex: 0,
    subCategoryIndex: null,
    subCategories: [],
    media: [],
    searchText: ""
  };

  handleChooseCategory = (category, categoryIndex) => {
    // console.debug(category);

    if (category.subCategories.length === 0) {
      console.debug("no sub categories");
      this.setState({
        media: category.media.sorted("title").slice(11, 23)
      });
    } else {
      console.debug(` ${category.subCategories.length} sub categories`);
    }

    this.setState({
      subCategories: category.subCategories,
      categoryIndex
    });
  };

  handleChooseSubCategory = subCategory => {};

  handleChooseMedia = media => {
    console.debug(media);
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
          style={{
            width: 90,
            backgroundColor: "#0ff",
            margin: 0,
            padding: 0,
            flexGrow: 0
          }}
        />
        <View style={{ flexGrow: 1 }}>
          <View
            style={{
              width: "100%",
              height: 44,
              backgroundColor: "#fafafa",
              flexDirection: "row"
            }}
          >
            <TextInput
              style={{
                //height: 30,
                flexGrow: 1
              }}
              onChangeText={searchText => this.setState({ searchText })}
              value={this.state.searchText}
            />
            <CloseButton title="Close" />

            {/* <Button title="Done" /> */}
          </View>
          <Media
            media={this.state.media}
            style={{ flexGrow: 1 }}
            onChoose={this.handleChooseMedia}
          />
        </View>
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
      console.debug("auto choose category");
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
