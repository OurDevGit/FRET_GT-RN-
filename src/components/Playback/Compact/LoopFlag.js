import React from "react";
import { View, Text } from "react-native";
import { pure } from "recompose";
import { LoopLeftCompact, LoopRightCompact } from "../../StyleKit";

const LoopFlag = ({ type, left, isEnabled }) =>
  <View
    style={{
      position: "absolute",
      top: 0,
      left: type === "begin" ? left : left - 20,
      width: 20,
      height: 20
    }}
  >
    {type === "begin"
      ? <LoopLeftCompact
          isEnabled={isEnabled}
          style={{ width: 35, height: 20 }}
        />
      : <LoopRightCompact
          isEnabled={isEnabled}
          style={{ width: 35, height: 20 }}
        />}
  </View>;

export default pure(LoopFlag);
