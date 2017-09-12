import React from "react";
import {
  View,
  SectionList,
  StyleSheet,
  TextInput,
  Text,
  Animated,
  I18nManager
} from "react-native";
import MediaItem from "./MediaItem";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import { StoreDark, LibraryDark } from "../../design";
import InAppBilling from "react-native-billing";

const renderHeader = props => {
  return (
    <TabBar
      {...props}
      style={{ backgroundColor: "#fafafa" }}
      renderLabel={renderLabel}
      renderIndicator={renderIndicator}
    />
  );
};

const renderLabel = ({ focused, route: { title, key } }) => (
  <Text
    style={[styles.tabLabel, { color: key === "1" ? StoreDark : LibraryDark }]}
  >
    {title.toUpperCase()}
  </Text>
);

const renderIndicator = ({ width, position, navigationState: { index } }) => {
  const translateX = Animated.multiply(
    Animated.multiply(position, width),
    I18nManager.isRTL ? -1 : 1
  );

  return (
    <Animated.View
      style={[
        styles.indicator,
        { width, transform: [{ translateX }] },
        {
          backgroundColor: index === 0 ? StoreDark : LibraryDark
        }
      ]}
    />
  );
};

class TabbedMedia extends React.PureComponent {
  state = {
    // used by the react-native-tab-view
    index: 0,
    // used by the react-native-tab-view
    routes: [
      { key: "1", title: "Store" },
      { key: "2", title: "Purchased" },
      { key: "3", title: "Downloaded" }
    ],
    billingChannelIsOpen: false,
    productDetailsById: {}
  };

  render() {
    const { style } = this.props;

    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this.renderScene}
        renderHeader={renderHeader}
        onIndexChange={this.handleIndexChange}
        media={this.props.media} // passing this to force a render in the tabs
      />
    );
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case "1":
        return (
          <SectionList
            sections={this.props.media}
            renderSectionHeader={this.renderTableHeader}
            renderItem={this.renderItem}
            keyExtractor={item => item.mediaID}
            style={this.props.style}
          />
        );
      case "2":
        return (
          <SectionList
            sections={this.props.media}
            renderSectionHeader={this.renderTableHeader}
            renderItem={this.renderItem}
            keyExtractor={item => item.mediaID}
            style={this.props.style}
          />
        );
      case "3":
        return (
          <SectionList
            sections={this.props.media}
            renderSectionHeader={this.renderTableHeader}
            renderItem={this.renderItem}
            keyExtractor={item => item.mediaID}
            style={this.props.style}
          />
        );
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

  renderTableHeader = ({ section }) => (
    <View
      style={{
        // height: 30,
        padding: 8,
        backgroundColor: "lightgray",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Text>{section.title}</Text>
    </View>
  );

  componentWillReceiveProps(newProps) {
    if (newProps.media.length > 0) {
      // const mediaIds = ["4_non_blondes_whats_up", "smashing_pumpkins_1979"];

      const mediaIds = []; //newProps.media.map(o => o.mediaID.toLowerCase());

      if (this.state.billingChannelIsOpen === false) {
        this.setState({ billingChannelIsOpen: true });

        // InAppBilling.open()
        //   .then(() => InAppBilling.getProductDetailsArray(mediaIds))
        //   .then(details => {
        //     // console.debug(details);
        //     InAppBilling.close();
        //     this.setState({
        //       billingChannelIsOpen: false,
        //       productDetailsById: normalizeProductDetails(details)
        //     });
        //   })
        //   .catch(err => {
        //     console.error(err);
        //     InAppBilling.close();
        //     this.setState({ billingChannelIsOpen: false });
        //   });
      }
    }
  }

  handleIndexChange = index => {
    this.props.onStoreChange(index === 0);

    this.setState({ index });
  };

  priceForProduct = productId => {
    // console.debug(this.state.productDetailsById);
    // console.debug(productId.toLowerCase());
    // console.debug(this.state.productDetailsById[productId.toLowerCase()]);
    // return "nope";
    let details = this.state.productDetailsById[productId.toLowerCase()] || {
      priceText: "LOADING"
    };
    return details.priceText;
  };
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
  },
  indicatorContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  indicator: {
    backgroundColor: "#ffeb3b",
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 2
  }
});

export default TabbedMedia;
