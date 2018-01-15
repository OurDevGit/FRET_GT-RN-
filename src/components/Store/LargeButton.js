import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, Image } from "react-native";

const LargeButton = ({
  isSelected,
  iconURL,
  title,
  onPress,
  color,
  height
}) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        backgroundColor: isSelected ? color : null,
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomColor: color,
        borderBottomWidth: 1,
        height
      }}
    >
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image source={{ uri: iconURL }} style={{ height: 30, width: 30 }} />
      </View>
      <Text
        style={{
          fontSize: 14,
          width: "100%",
          textAlign: "center",
          color: isSelected ? "white" : "black"
        }}
      >
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

LargeButton.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  iconURL: PropTypes.string,
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  color: PropTypes.string.isRequired,
  height: PropTypes.number.isRequired
};

export default LargeButton;
