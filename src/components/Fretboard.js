import React from "react";
import { View, Image } from "react-native";
import FretboardString from "./FretboardString";

const fb = require("../fretboard.png");

class Fretboard extends React.Component {
  state = {
    imageLayoutWidth: 1000,
    imageAspectRatio: 1
  };
  render() {
    const { imageLayoutWidth, imageAspectRatio } = this.state;
    const imageHeight = imageLayoutWidth * imageAspectRatio;
    return (
      <View
        style={{
          overflow: "hidden",
          flexGrow: 1
        }}
      >
        <Image
          source={fb}
          style={{
            width: "100%",
            height: imageHeight,
            resizeMode: "contain"
          }}
          onLayout={this.onLayout}
          onImageLayout={this.onImageLayout}
          onLoad={this.onLoad}
        >
          <View style={{ top: 23, left: 35, width: 548 }}>
            <FretboardString />
            <FretboardString />
            <FretboardString />
            <FretboardString />
            <FretboardString />
            <FretboardString />
          </View>
        </Image>
      </View>
    );
  }

  onLayout = e => {
    console.log("layout", e.nativeEvent.layout);
    this.setState({
      imageLayoutWidth: e.nativeEvent.layout.width
    });
  };

  onLoad = e => {
    console.log(e.nativeEvent.source);
    this.setState({
      imageAspectRatio: e.nativeEvent.source.height / e.nativeEvent.source.width
    });
  };
}

export default Fretboard;
