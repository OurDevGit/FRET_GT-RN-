import React, { PureComponent } from "react";
import {
  View,
  SectionList,
  StyleSheet,
  Text,
  Animated,
  I18nManager
} from "react-native";
import PropTypes from "prop-types";

import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import _ from "lodash";

import { GetMediaButtonMode } from "../../models/Media";
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

const filterMedia = (media, tabIndex) => {
  switch (tabIndex) {
    case 1: {
      // filter just the stuff we've bought (don't show stuff with a GetMode of Purchase)
      return media.map(mediaList => ({
        ...mediaList,
        data: mediaList.data.filter(
          m =>
            m.getMode !== GetMediaButtonMode.Purchase &&
            m.getMode !== GetMediaButtonMode.ComingSoon
        )
      }));
    }
    case 2:
      // filter just the stuff we can play
      return media.map(mediaList => ({
        ...mediaList,
        data: mediaList.data.filter(m => m.getMode === GetMediaButtonMode.Play)
      }));
    default:
      return media;
  }
};

class TabbedMedia extends PureComponent {
  state = {
    // used by the react-77native-tab-view
    index: 0,
    // used by the react-native-tab-view
    routes: [
      { key: "1", title: "Store" },
      { key: "2", title: "Purchased" },
      { key: "3", title: "Downloaded" }
    ]
  };

  render() {
    const { media } = this.props;
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
    const tab1 = filterMedia(this.props.media, 0);
    const tab2 = filterMedia(this.props.media, 1);
    const tab3 = filterMedia(this.props.media, 2);

    switch (route.key) {
      case "1":
        return (
          <SectionList
            sections={tab1}
            renderSectionHeader={this.renderTableHeader}
            renderItem={this.renderItem}
            keyExtractor={item => item.mediaID}
            style={this.props.style}
            initialNumToRender={10}
            getItemLayout={this.getItemLayout}
          />
        );
      case "2":
        return (
          <SectionList
            sections={tab2}
            renderSectionHeader={this.renderTableHeader}
            renderItem={this.renderItem}
            keyExtractor={item => item.mediaID}
            style={this.props.style}
            initialNumToRender={10}
            getItemLayout={this.getItemLayout}
          />
        );
      case "3":
        return (
          <SectionList
            sections={tab3}
            renderSectionHeader={this.renderTableHeader}
            renderItem={this.renderItem}
            keyExtractor={item => item.mediaID}
            style={this.props.style}
            initialNumToRender={10}
            getItemLayout={this.getItemLayout}
          />
        );
    }
  };

  renderItem = ({ item }) => {
    // console.debug(`render item ${index}`);
    // console.debug(item);

    return (
      <MediaItem
        id={item.mediaID}
        title={item.title}
        isFaved={item.isFaved}
        subtitle={item.artist}
        details={item.details}
        artworkURL={item.artworkURL}
        price={item.productDetails.priceText}
        getMode={item.getMode}
        progress={item.downloadProgress}
        item={item}
        onArchiveFiles={this.handleArchiveFiles}
        onPress={this.handleChooseMedia}
        onFavePress={this.props.onFavePress}
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

  getItemLayout = (data, index) => {
    return {
      length: 51,
      offset: 51 * index,
      index
    };
  };

  async componentWillReceiveProps(nextProps) {
    // console.debug(nextProps);
    if (nextProps.media.length > 0) {
      // const mediaIds = ["4_non_blondes_whats_up", "smashing_pumpkins_1979"];

      const currMedia = _.flatMap(this.props.media, m => _.toArray(m.data));
      const currMediaIds = currMedia.map(o => o.mediaID);

      const nextMedia = _.flatMap(nextProps.media, m => _.toArray(m.data));
      const nextMediaIds = nextMedia.map(o => o.mediaID);

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

  handleArchiveFiles = media => {
    this.props.onArchiveFiles(media);
  };

  handleChooseMedia = media => {
    this.props.onChoose(media);
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
  onArchiveFiles: PropTypes.func.isRequired,
  media: PropTypes.array,
  onIsStoreChange: PropTypes.func.isRequired,
  onChoose: PropTypes.func.isRequired,
  onFavePress: PropTypes.func.isRequired
};

export default TabbedMedia;
