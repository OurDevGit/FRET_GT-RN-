import React from "react";
import { View, FlatList, StyleSheet, TextInput, Text } from "react-native";
import MediaItem from "./MediaItem";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import { PrimaryGold } from "../../design";
import InAppBilling from "react-native-billing";

const SecondRoute = () => (
  <View style={[styles.container, { backgroundColor: "#673ab7" }]} />
);

class Media extends React.PureComponent {
  state = {
    index: 0,
    routes: [{ key: "1", title: "Library" }, { key: "2", title: "Store" }],
    billingChannelIsOpen: false,
    productDetailsById: {}
  };

  _handleIndexChange = index => this.setState({ index });
  _renderHeader = props => (
    <TabBar
      {...props}
      style={{ backgroundColor: "#fafafa" }}
      labelStyle={{ color: PrimaryGold }}
      indicatorStyle={{ backgroundColor: PrimaryGold }}
      renderLabel={this._renderLabel}
    />
  );

  _renderLabel = ({ focused, route: { title } }) => {
    return (
      <Text
        style={[styles.tabLabel, { color: focused ? PrimaryGold : "black" }]}
      >
        {title.toUpperCase()}
      </Text>
    );
  };

  _renderScene = ({ route }) => {
    switch (route.key) {
      case "1":
        return (
          <FlatList
            data={this.props.media}
            renderItem={this.renderItem}
            keyExtractor={item => item.mediaID}
            style={this.props.style}
          />
        );
      case "2":
        return <SecondRoute />;
      default:
        return null;
    }
  };

  renderItem = ({ item }) => (
    <MediaItem
      id={item.mediaID}
      title={item.title}
      subtitle={item.artist}
      artworkURL={item.artworkURL}
      price={this.priceForProduct(item.mediaID)}
      onPress={() => this.props.onChoose(item)}
    />
  );

  render() {
    const { style } = this.props;

    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
      />
    );
  }

  priceForProduct = productId => {
    console.debug(this.state.productDetailsById);
    console.debug(productId.toLowerCase());
    console.debug(this.state.productDetailsById[productId.toLowerCase()]);
    // return "nope";
    let details = this.state.productDetailsById[productId.toLowerCase()] || {
      priceText: "LOADING"
    };
    return details.priceText;
  };

  componentWillReceiveProps(newProps) {
    if (newProps.media.length > 0) {
      // const mediaIds = ["4_non_blondes_whats_up", "smashing_pumpkins_1979"];
      const mediaIds = newProps.media.map(o => o.mediaID.toLowerCase());
      // console.debug(mediaIds);
      if (this.state.billingChannelIsOpen === false) {
        this.setState({ billingChannelIsOpen: true });

        InAppBilling.open()
          .then(() => InAppBilling.getProductDetailsArray(mediaIds))
          .then(details => {
            // console.debug(details);
            InAppBilling.close();
            this.setState({
              billingChannelIsOpen: false,
              productDetailsById: normalizeProductDetails(details)
            });
          })
          .catch(err => {
            console.error(err);
            InAppBilling.close();
            this.setState({ billingChannelIsOpen: false });
          });
      }
    }
  }
}

const normalizeProductDetails = details => {
  var byId = {};
  details.forEach(product => {
    byId[product.productId] = product;
  });

  return byId;
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Media;
