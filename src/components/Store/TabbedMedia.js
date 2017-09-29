import React, { PureComponent } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  TextInput,
  Text,
  Animated,
  I18nManager,
  Alert
} from "react-native";
import PropTypes from "prop-types";

import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import _ from "lodash";

import { addPurchases } from "../../models/Purchases";
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

// We color the tab indicator based on Store vs. Library
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
    ]
  };

  render() {
    const { style, media } = this.props;
    // console.debug("Tabbed Media render");
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this.renderScene}
        renderHeader={renderHeader}
        onIndexChange={this.handleIndexChange}
        media={media} // passing this to force a render in the tabs
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
    // console.debug(`render item ${index}: ${item.title}, ${item.mediaID}`);
    return (
      <MediaItem
        id={item.mediaID}
        title={item.title}
        subtitle={item.artist}
        artworkURL={item.artworkURL}
        price={item.productDetails.priceText}
        getMode={item.getMode}
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

  async componentWillReceiveProps(nextProps) {
    // console.debug(nextProps);
    if (nextProps.media.length > 0) {
      // const mediaIds = ["4_non_blondes_whats_up", "smashing_pumpkins_1979"];

      const currMedia = _.flatMap(this.props.media, m => _.toArray(m.data));
      const currMediaIds = currMedia.map(o => o.mediaID.toLowerCase());

      const nextMedia = _.flatMap(nextProps.media, m => _.toArray(m.data));
      const nextMediaIds = nextMedia.map(o => o.mediaID.toLowerCase());

      if (!_.isEqual(currMediaIds, nextMediaIds)) {
        // console.debug(mediaIds);
        // console.debug("going to get prices and info");
        // this.loadProductDetails(nextMediaIds);
        // const productDetailsById = await getProductDetails(nextMediaIds);
        // this.setState({
        //   productDetailsById
        // });
      }
    }
  }

  handleIndexChange = index => {
    this.props.onIsStoreChange(index === 0);

    this.setState({ index });
  };
}

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

TabbedMedia.propTypes = {
  media: PropTypes.array,
  onIsStoreChange: PropTypes.func.isRequired,
  onChoose: PropTypes.func.isRequired
};

export default TabbedMedia;
