import React from "react";
import { View, FlatList, StyleSheet, TextInput, Text } from "react-native";
import MediaItem from "./MediaItem";
import { TabViewAnimated, TabBar, SceneMap } from "react-native-tab-view";
import { PrimaryGold } from "../../design";

const SecondRoute = () => (
  <View style={[styles.container, { backgroundColor: "#673ab7" }]} />
);

class Media extends React.PureComponent {
  state = {
    index: 0,
    routes: [{ key: "1", title: "Library" }, { key: "2", title: "Store" }]
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Media;
