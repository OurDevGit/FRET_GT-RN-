import React from "react";
import { pure } from "recompose";
import { View } from "react-native";
import { LoopLeft, LoopRight } from "../StyleKit";

const LoopFlag = ({ type, left }) =>
  <View
    style={{
      position: "absolute",
      top: 0,
      left: type === "begin" ? left : left - 30,
      width: 30,
      height: 30
    }}
  >
    {type === "begin"
      ? <LoopLeft style={{ width: 30, height: 30 }} />
      : <LoopRight style={{ width: 30, height: 30 }} />}
  </View>;

export default pure(LoopFlag);
