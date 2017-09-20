import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../design";

const Marker = ({ marker, left, end, onMarkerPress, onMarkerLongPress }) => (
  <TouchableOpacity
    key={marker.name}
    style={{
      position: "absolute",
      top: 0,
      left: left,
      width: 30,
      alignItems: "center"
    }}
    onPress={() => {
      onMarkerPress(marker.time);
    }}
    onLongPress={() => {
      onMarkerLongPress(marker.time, end);
    }}
  >
    <View style={{ width: 2, height: 10, backgroundColor: PrimaryBlue }} />
    <Text style={{ fontSize: 12 }}>{marker.abbreviation}</Text>
  </TouchableOpacity>
);

Marker.propTypes = {
  marker: PropTypes.object.isRequired,
  left: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  onMarkerPress: PropTypes.func.isRequired,
  onMarkerLongPress: PropTypes.func.isRequired
};

export default Marker;
