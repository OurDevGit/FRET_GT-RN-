import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { PrimaryBlue } from "../../design";

class NotationsRow extends React.Component {
  render() {
    const { label, currentNoteName } = this.props;
    return (
      <TouchableOpacity activeOpacity={1} style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity ref="Touchable" onPress={this.handlePress}>
          <Text style={styles.button}>{currentNoteName}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  handlePress = () => {
    this.refs.Touchable.measure((fx, fy, width, height, px, py) => {
      const frame = { x: px, y: py, width, height };
      this.props.onPress(frame);
    });
  };
}

NotationsRow.propTypes = {
  label: PropTypes.string.isRequired,
  currentNoteName: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    alignItems: "center",
    paddingHorizontal: 20
  },
  label: { fontSize: 18 },
  button: { fontSize: 18, color: PrimaryBlue, marginRight: 10 }
});

export default NotationsRow;
