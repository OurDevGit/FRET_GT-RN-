import React, { PureComponent } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  TextInput,
  Text,
  Animated,
  I18nManager,
  AsyncStorage
} from "react-native";

import InAppBilling from "react-native-billing";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import _ from "lodash";

import MediaItem from "./MediaItem";
import { StoreDark, LibraryDark } from "../../design";

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

class TabbedMedia extends PureComponent {
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
    // console.debug("Tabbed Media render");
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
            initialNumToRender={10}
            getItemLayout={(data, index) => {
              return {
                length: 51,
                offset: 51 * index,
                index
              };
            }}
          />
        );
      case "2":
        return <View />;
      case "3":
        return <View />;
    }
  };

  renderItem = ({ item, index }) => {
    console.debug(`render item ${index}: ${item.title}, ${item.mediaID}`);
    return (
      <MediaItem
        id={item.mediaID}
        title={item.title}
        subtitle={item.artist}
        artworkURL={item.artworkURL}
        price={this.priceForProduct(item.mediaID)}
        onPress={() => {
          this.props.onChoose(item);
        }}
      />
    );
  };

  renderTableHeader = ({ section }) => (
    <View
      style={{
        // height: 30,
        padding: 8,
        backgroundColor: "lightgray",
        alignItems: "center",
        justifyContent: "center",
        display: section.title === undefined ? "none" : "flex"
      }}
    >
      <Text>{section.title}</Text>
    </View>
  );

  componentWillMount() {
    // this.loadPurchases();
  }

  componentWillReceiveProps(nextProps) {
    console.debug(nextProps);
    if (nextProps.media.length > 0) {
      // const mediaIds = ["4_non_blondes_whats_up", "smashing_pumpkins_1979"];

      const currMedia = []; //_.flatMap(this.props.media, m => _.toArray(m.data));
      const currMediaIds = []; //currMedia.map(o => o.mediaID.toLowerCase());

      const nextMedia = []; //_.flatMap(nextProps.media, m => _.toArray(m.data));
      const nextMediaIds = []; //nextMedia.map(o => o.mediaID.toLowerCase());

      if (!_.isEqual(currMediaIds, nextMediaIds)) {
        // console.debug(mediaIds);
        console.debug("going to get prices and info");
        // this.loadProductDetails(nextMediaIds);
      }
    }
  }

  handleIndexChange = index => {
    this.props.onIsStoreChange(index === 0);

    this.setState({ index });
  };

  priceForProduct = productId => {
    // console.debug(this.state.productDetailsById);
    // console.debug(productId.toLowerCase());
    // console.debug(this.state.productDetailsById[productId.toLowerCase()]);
    // return "nope";
    // let details = this.state.productDetailsById[productId.toLowerCase()] || {
    //   priceText: "LOADING"
    // };
    return "DEV"; //details.priceText;
  };

  openBilling = () => {
    if (this.state.billingChannelIsOpen) {
      console.debug("billing channel is already open");

      return Promise.resolve(() => {
        console.debug("channel was already open so I'm not closing it");
        return null;
      });
    } else {
      console.debug("opening billing channel");

      this.setState({
        billingChannelIsOpen: true
      });

      return InAppBilling.open().then(() => {
        console.debug("closing the billing channel that I opened");
        return () => InAppBilling.close();
      });
    }
  };

  loadPurchases = () => {
    AsyncStorage.getItem("PurchasedProducts").then(products => {
      console.debug("loaded purchased products");
      console.debug(JSON.parse(products));
    });

    console.debug("loadPurchases()");
    this.openBilling().then(closeBilling => {
      InAppBilling.loadOwnedPurchasesFromGoogle()
        .then(() => InAppBilling.listOwnedProducts())
        .then(listResults => {
          AsyncStorage.setItem(
            "PurchasedProducts",
            JSON.stringify(listResults)
          );
          console.debug({ listResults });
        })
        .then(() => closeBilling())
        .catch(err => {
          console.error(err);
          InAppBilling.close();
        });
    });
  };

  loadProductDetails = mediaIds => {
    console.debug("loadProductDetails()");
    this.openBilling().then(closeBilling => {
      InAppBilling.getProductDetailsArray(mediaIds)
        .then(details => {
          console.debug("got product details");
          const productDetailsById = normalizeProductDetails(details);
          console.debug(productDetailsById);

          this.setState({
            productDetailsById
          });
        })
        .then(() => closeBilling())
        .catch(err => {
          console.debug("error getting IAP details");
          console.error(err);
          InAppBilling.close().then(() => {
            this.setState({ billingChannelIsOpen: false });
          });
        });
    });
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
