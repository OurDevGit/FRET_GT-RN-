import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

const AdPresentation = ({ onTap, imageUrl }) =>
  <TouchableOpacity onPress={onTap} style={{ flex: 1 }}>
    <Image
      style={{ flex: 1, marginVertical: 10 }}
      source={{
        uri: imageUrl
      }}
      resizeMode="contain"
    />
  </TouchableOpacity>;

export default AdPresentation;
