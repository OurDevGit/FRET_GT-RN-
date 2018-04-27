import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text } from "react-native";
import { PrimaryBlue } from "../../design";
import { getIsPhone } from "../../utils";

class MediaTitle extends React.Component {
  state = {
    height: -1,
    subtitleLayout: { height: -1, y: -1 }
  };

  render() {
    const { height, subtitleLayout } = this.state;
    const fontSize = getIsPhone() ? 12 : 18;
    const title = height > 0 ? this.props.title.trim() : "";
    const artist = height > 0 ? this.props.artist.trim() : "";
    const numberOfLines = parseInt(height / fontSize);

    const subtitleTooTall = subtitleLayout.height + subtitleLayout.y > height;

    return (
      <View style={styles.container} onLayout={this.handleLayout}>
        <Text
          style={styles.title}
          numberOfLines={numberOfLines}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        {subtitleTooTall !== true && (
          <Text style={styles.artist} onLayout={this.handleSubtitleLayout}>
            {artist}
          </Text>
        )}
      </View>
    );
  }

  handleLayout = e => {
    this.setState({ height: e.nativeEvent.layout.height });
  };

  handleSubtitleLayout = e => {
    this.setState({ subtitleLayout: e.nativeEvent.layout });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // justifyContent: "center"
  },
  title: {
    // flex: 1,
    color: PrimaryBlue,
    fontSize: getIsPhone() ? 12 : 18
  },
  artist: {
    fontSize: getIsPhone() ? 10 : 16,
    color: "black"
  }
});

MediaTitle.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired
};

export default MediaTitle;
