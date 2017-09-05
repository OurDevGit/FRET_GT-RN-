import React from "react";
import { View, Text, Button, TextInput } from "react-native";
import { realmify } from "../../realm";
// import InAppBilling from "react-native-billing";

import { syncStore } from "../../Store";

import Categories from "./Categories";
import SubCategories from "./SubCategories";
import Media from "./Media";

const testPurchase = media => {
  // InAppBilling.open()
  //   .then(() => InAppBilling.purchase(media.mediaID.toLowerCase()))
  //   .then(details => {
  //     fetch(
  //       "https://hooks.slack.com/services/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",
  //       {
  //         method: "POST",
  //         body: JSON.stringify({ text: JSON.stringify(details) })
  //       }
  //     );
  //     console.debug("You purchased: ");
  //     console.debug(details);
  //     return InAppBilling.close();
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     InAppBilling.close();
  //   });
  // InAppBilling.open()
  //   .then(() => InAppBilling.getProductDetails(media.mediaID.toLowerCase()))
  //   .then(details => {
  //     console.debug(details);
  //     return InAppBilling.close();
  //   })
  //   .catch(err => {
  //     console.error(err);
  //     InAppBilling.close();
  //   });
};

class Store extends React.PureComponent {
  state = {
    subCategories: [],
    media: [],
    searchText: ""
  };

  handleChooseCategory = category => {
    console.debug(category);

    if (category.subCategories.length === 0) {
      console.debug("no sub categories");
      this.setState({
        media: category.media.sorted("title").slice(11, 23)
      });
    } else {
      console.debug(` ${category.subCategories.length} sub categories`);
    }

    this.setState({
      subCategories: category.subCategories
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
            <Text>Close</Text>
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
    // InAppBilling.open()
    //   .then(() => InAppBilling.listOwnedProducts())
    //   .then(details => {
    //     console.debug("owned produts: ");
    //     console.debug(details);
    //     return InAppBilling.close();
    //   })
    //   .catch(err => {
    //     // console.debug("error from purchase");
    //     console.error(err);
    //     return InAppBilling.close();
    //   });
  }

  componentWillReceiveProps(newProps) {}
}

const mapQueriesToProps = (realm, ownProps) => {
  return {
    categories: realm.objects("Category")
  };
};

export default realmify(mapQueriesToProps)(Store);
