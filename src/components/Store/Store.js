import React from "react";
import { View, Text, FlatList } from "react-native";
import { realmify } from "../../realm";

import { syncStore } from "../../Store";

import Categories from "./Categories";
import SubCategories from "./SubCategories";
import Media from "./Media";

class Store extends React.PureComponent {
  state = {
    subCategories: [],
    media: []
  };

  handleChooseCategory = category => {
    console.debug(category);

    if (category.subCategories.length === 0) {
      console.debug("no sub categories");
      this.setState({
        media: category.media
      });
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
        <Media media={this.state.media} style={{ flex: 1 }} />
      </View>
    );
  }

  componentDidMount() {
    // syncStore();
  }

  componentWillReceiveProps(newProps) {}
}

const mapQueriesToProps = (realm, ownProps) => {
  return {
    categories: realm.objects("Category")
  };
};

export default realmify(mapQueriesToProps)(Store);
