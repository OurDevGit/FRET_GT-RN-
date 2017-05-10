import React, { PropTypes } from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

const AdPresentation = ({ onTap, imageUrl }) => (
  <TouchableOpacity onPress={onTap} style={{}}>
    <Image style={styles.banner} source={require("../topiPhone.png")}>
      <Image
        style={styles.ad}
        source={{
          uri: imageUrl
        }}
        resizeMode="contain"
      />
    </Image>

  </TouchableOpacity>
);

const styles = StyleSheet.create({
  banner: {
    height: 70,
    width: "100%"
  },
  ad: {
    // width: '100%',
    // flex: 1,
    top: 15,
    height: 50
    // backgroundColor: 'black'
  }
});

export default AdPresentation;
