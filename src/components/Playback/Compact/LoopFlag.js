import React from "react";
import { View } from "react-native";
import { pure } from "recompose";
import { LoopLeftCompact, LoopRightCompact } from "../../StyleKit";

const flagSize = { width: 24, height: 12 };

const LoopFlag = ({ type, left, isEnabled }) =>
  <View
    style={{
      position: "absolute",
      bottom: 0,
      left: type === "begin" ? left : left - 24,
      width: flagSize.width,
      height: flagSize.height
    }}
  >
    {type === "begin"
      ? <LoopLeftCompact isEnabled={isEnabled} style={flagSize} />
      : <LoopRightCompact isEnabled={isEnabled} style={flagSize} />}
  </View>;

export default pure(LoopFlag);
