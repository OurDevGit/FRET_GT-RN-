import React from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Image } from "react-native";

const AdPresentation = ({ onTap, imageUrl, aspectRatio }) => (
  <View
    style={{
      flex: 1,
      marginVertical: 10,
      alignItems: "center"
    }}
  >
    <TouchableOpacity
      onPress={onTap}
      style={{
        flex: 1,
        aspectRatio,
        maxWidth: "39%"
      }}
    >
      <Image
        style={{
          flex: 1
        }}
        source={{
          uri: imageUrl
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  </View>
);

AdPresentation.propTypes = {
  onTap: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  aspectRatio: PropTypes.number
};

export default AdPresentation;
