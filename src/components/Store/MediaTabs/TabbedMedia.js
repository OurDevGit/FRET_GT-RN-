import React, { Component } from "react";
import { StyleSheet, Text, Animated, I18nManager } from "react-native";
import PropTypes from "prop-types";
import { isEqual } from "lodash";

import { TabViewAnimated, TabBar } from "react-native-tab-view";

import { setTabIndex, getUIState } from "../../../models/Store";
import { StoreDark, LibraryDark } from "../../../design";
import PureTab from "./PureTab";

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

const renderLabel = ({ route: { title, key } }) => (
  <Text
    style={[styles.tabLabel, { color: key === "1" ? StoreDark : LibraryDark }]}
  >
    {title.toUpperCase()}
  </Text>
);

renderLabel.propTypes = {
  route: PropTypes.shape({
    title: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired
  })
};

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

renderIndicator.propTypes = {
  width: PropTypes.number.isRequired,
  position: PropTypes.number.isRequired,
  navigationState: PropTypes.shape({
    index: PropTypes.number.isRequired
  })
};

class TabbedMedia extends Component {
  // this.state also gets passed directly to `<TabViewAnimated />`
  state = {
    index: 0,
    routes: [
      { key: "1", title: "Store" },
      { key: "2", title: "Purchased" },
      { key: "3", title: "Downloaded" }
    ]
  };

  render() {
    const { category, subCategory, group, searchText } = this.props;
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={{
          category,
          subCategory,
          group,
          searchText,
          ...this.state
        }}
        renderScene={this.renderScene}
        renderHeader={renderHeader}
        onIndexChange={this.handleIndexChange}
        lazy={true}
      />
    );
  }

  renderScene = ({ route }) => {
    switch (route.key) {
      case "1":
        return (
          <PureTab
            category={this.props.category}
            subCategory={this.props.subCategory}
            group={this.props.group}
            searchText={this.props.searchText}
            isNavigableSubCategory={this.props.isNavigableSubCategory}
            onShowDetails={this.props.onShowDetails}
            onFavePress={this.props.onFavePress}
            onChooseMedia={this.handleChooseMedia}
            onMediaCount={this.props.onMediaCount}
            tabIndex={0}
            isStore={true}
          />
        );
      case "2":
        return (
          <PureTab
            category={this.props.category}
            subCategory={this.props.subCategory}
            group={this.props.group}
            searchText={this.props.searchText}
            isNavigableSubCategory={this.props.isNavigableSubCategory}
            onShowDetails={this.props.onShowDetails}
            onFavePress={this.props.onFavePress}
            onChooseMedia={this.handleChooseMedia}
            onMediaCount={this.props.onMediaCount}
            tabIndex={1}
            isStore={false}
          />
        );
      case "3":
        return (
          <PureTab
            category={this.props.category}
            subCategory={this.props.subCategory}
            group={this.props.group}
            searchText={this.props.searchText}
            isNavigableSubCategory={this.props.isNavigableSubCategory}
            onShowDetails={this.props.onShowDetails}
            onFavePress={this.props.onFavePress}
            onChooseMedia={this.handleChooseMedia}
            onMediaCount={this.props.onMediaCount}
            tabIndex={2}
            isStore={false}
          />
        );
    }
  };

  // we use isEqual (from Lodash) instead of === because the cost of superfluous re-renders here is very high due to table rendering
  shouldComponentUpdate(nextProps, nextState) {
    var hasUpdates = false;

    for (var key in nextProps) {
      if (!isEqual(this.props[key], nextProps[key])) {
        hasUpdates = true;
      }
    }

    for (var key in nextState) {
      if (!isEqual(this.state[key], nextState[key])) {
        hasUpdates = true;
      }
    }

    return hasUpdates;
  }

  async componentWillMount() {
    const { tabIndex } = await getUIState();
    this.setState({ index: tabIndex });
    this.props.onIsStoreChange(tabIndex === 0);
  }

  handleIndexChange = index => {
    this.props.onIsStoreChange(index === 0);
    this.setState({ index });
    setTabIndex(index);
  };

  handleChooseMedia = media => {
    this.props.onChoose(media);
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  onShowDetails: PropTypes.func.isRequired,
  onIsStoreChange: PropTypes.func.isRequired,
  onChoose: PropTypes.func.isRequired,
  onFavePress: PropTypes.func.isRequired,
  onMediaCount: PropTypes.func.isRequired,
  isNavigableSubCategory: PropTypes.bool.isRequired,
  category: PropTypes.object,
  subCategory: PropTypes.object,
  group: PropTypes.object,
  searchText: PropTypes.string
};

export default TabbedMedia;
