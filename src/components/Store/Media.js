import React from "react";
import { FlatList } from "react-native";
import MediaItem from "./MediaItem";

class Media extends React.PureComponent {
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
    const { media, style } = this.props;

    return (
      <FlatList
        data={media}
        renderItem={this.renderItem}
        keyExtractor={item => item.mediaID}
        style={style}
      />
    );
  }
}

export default Media;
