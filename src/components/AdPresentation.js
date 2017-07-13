import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

const AdPresentation = ({ onTap, imageUrl }) =>
  <TouchableOpacity onPress={onTap} style={{ height: "100%", flex: 1 }}>
    <Image
      style={styles.ad}
      source={{
        uri: imageUrl
      }}
      resizeMode="center"
    />
  </TouchableOpacity>;

const styles = StyleSheet.create({
  ad: {
    top: 0,
    height: 70
  }
});

export default AdPresentation;
