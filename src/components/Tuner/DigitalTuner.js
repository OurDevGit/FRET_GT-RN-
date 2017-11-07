import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";

class DigitalTuner extends React.Component {
  render() {
    const { currentNote } = this.props;
    return <View style={styles.container} />;
  }
}

DigitalTuner.propTypes = {
  currentNote: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "blue" }
});

export default DigitalTuner;
