import React from "react";
import { View, Text } from "react-native";
import { LoopLeft, LoopRight } from "../../StyleKit";

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
    {type === "begin"
      ? <LoopLeft style={{ width: 44, height: 44 }} />
      : <LoopRight style={{ width: 44, height: 44 }} />}
  </View>;

export default LoopFlag;
