import React from "react";
import { View, Image } from "react-native";
import FretboardFret from "./FretboardFret";

const fb = require("../images/fretboard.png");

class Fretboard extends React.Component {
  state = {
    imageLayoutWidth: 1000,
    imageAspectRatio: 1
  };
  render() {
    const { imageLayoutWidth, imageAspectRatio } = this.state;
    const imageHeight = imageLayoutWidth * imageAspectRatio;

    var frets = [];
    var range = 23;
    for (var i = 0; i < range; i++) {
      frets.push(<FretboardFret key={i} index={i} />)
    }

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
          <View style={{ top: 23, left: 0, marginRight: 8, marginLeft: 8, flex: 1, flexDirection: 'row', justifyContent: "space-between" }}>
            {frets}
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
