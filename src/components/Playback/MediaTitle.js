import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Text } from "react-native";
import { PrimaryBlue } from "../../design";
import { getIsPhone } from "../../utils";

class MediaTitle extends React.Component {
  state = {
    height: -1
  };

  render() {
    const { height } = this.state;
    const fontSize = getIsPhone() ? 12 : 18;
    const title = height > 0 ? this.props.title : "";
    const artist = height > 0 ? this.props.artist : "";
    const numberOfLines = parseInt(height / fontSize);
    return (
      <View style={styles.container} onLayout={this.handleLayout}>
        <Text
          style={styles.title}
          numberOfLines={numberOfLines}
          ellipsizeMode="tail"
        >
          {title}
          <Text style={styles.artist}>{"\n" + artist}</Text>
        </Text>
      </View>
    );
  }

  handleLayout = e => {
    this.setState({ height: e.nativeEvent.layout.height });
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  title: {
    flex: 1,
    color: PrimaryBlue,
    fontSize: getIsPhone() ? 12 : 18
  },
  artist: { fontSize: getIsPhone() ? 10 : 16, color: "black" }
});

MediaTitle.propTypes = {
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired
};

export default MediaTitle;
