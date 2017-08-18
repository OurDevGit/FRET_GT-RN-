import React from "react";
import { pure } from "recompose";
import { View, Text } from "react-native";

const LoopFlag = ({ type, left }) =>
  <View
    style={{
      position: "absolute",
      top: 0,
      left: left - 5,
      width: 20,
      height: 20
    }}
  >
    <Text style={{ width: 20, height: 20 }}>
      {type === "begin" ? `|>` : `<|`}
    </Text>
  </View>;

export default pure(LoopFlag);
