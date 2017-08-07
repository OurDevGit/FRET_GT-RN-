import React from "react";
import { View, Text } from "react-native";

const LoopFlag = ({ type, left, containerLeft }) =>
  <View
    style={{
      position: "absolute",
      top: 0,
      left: this.props.containerLeft,
      width: 20,
      height: 20
    }}
  >
    <View style={styleWithLeft} {...this._panResponder.panHandlers}>
      <Text style={buttonStyle}>
        {type === "left" ? `|>` : `<|`}
      </Text>
    </View>
  </View>;

export default LoopFlag;
