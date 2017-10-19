import React from "react";
import { Image, TouchableOpacity, Linking } from "react-native";

const Icon = () => (
  <TouchableOpacity
    onPress={() => {
      Linking.openURL("https://www.facebook.com/guitartunesapp/");
    }}
  >
    <Image
      style={{ width: 30, height: 30 }}
      source={require("./fb-logo.png")}
    />
  </TouchableOpacity>
);

export default Icon;
