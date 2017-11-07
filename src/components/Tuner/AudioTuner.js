import React from "react";
import PropTypes from "prop-types";
import { View, Image, Text, StyleSheet } from "react-native";

class AudioTuner extends React.Component {
  render() {
    const { currentNote } = this.props;
    return <View style={styles.container} />;
  }
}

AudioTuner.propTypes = {
  currentNote: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "red" }
});

export default AudioTuner;
