import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const extractKey = item => item.mediaID;

class MediaItem extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View
          style={{
            backgroundColor: "#f0f",
            width: "100%",
            height: 30,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1
            // alignItems: "flex-end",
            // flexDirection: "row"
          }}
        >
          <Text style={{ fontSize: 10, width: "100%", textAlign: "center" }}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class Media extends React.PureComponent {
  renderItem = ({ item }) => (
    <MediaItem
      id={item.mediaID}
      title={item.title}
      onPress={() => console.debug(`chose ${item.title}`)}
    />
  );

  render() {
    const { media, style } = this.props;

    return (
      <FlatList
        data={media}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        style={style}
      />
    );
  }
}

export default Media;
