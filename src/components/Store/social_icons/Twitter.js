import React from "react";
import { Image, TouchableOpacity, Linking } from "react-native";

const Icon = () => (
  <TouchableOpacity
    onPress={() => {
      Linking.openURL("https://www.twitter.com/guitartunesapp/");
    }}
  >
    <Image
      style={{ width: 30, height: 30 }}
      source={require("./twitter-logo.png")}
    />
  </TouchableOpacity>
);

export default Icon;
