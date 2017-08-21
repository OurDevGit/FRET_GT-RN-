import React from "react";
import { pure } from "recompose";
import { View, Picker, Text, TouchableOpacity } from "react-native";
import { LoopLeft, LoopRight } from "../StyleKit";

import RatePicker from "./RatePicker";

const buttonStyle = {
  flex: 1,
  minWidth: 50,
  height: 30,
  marginHorizontal: 5,
  fontSize: 20,
  lineHeight: 20,
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center"
};

const PlaybackSecondary = ({
  rate,
  loopIsEnabled,
  onRateChange,
  onLoopEnable,
  onLoopBegin,
  onLoopEnd,
  onLoopSave,
  onDisplayLoops
}) =>
  <View
    style={{
      height: 35,
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center"
    }}
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center"
      }}
    >
      <Text
        style={{
          fontSize: 20,
          lineHeight: 20
        }}
      >
        Tempo:
      </Text>
      <View
        style={{
          width: 110,
          height: "100%",
          marginTop: -10,
          marginBottom: -5
        }}
      >
        <RatePicker rate={rate} onRateChange={onRateChange} />
      </View>
    </View>

    <TouchableOpacity onPress={onLoopEnable}>
      <Text style={buttonStyle}>
        {loopIsEnabled ? "Loop ON" : "Loop OFF"}
      </Text>
    </TouchableOpacity>

    <LoopLeft style={{ width: 35, height: 35 }} onPress={onLoopBegin} />
    <LoopRight style={{ width: 35, height: 35 }} onPress={onLoopEnd} />

    <TouchableOpacity onPress={onLoopSave}>
      <Text style={buttonStyle}>Save Loop</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={onDisplayLoops}>
      <Text style={buttonStyle}>My Loops</Text>
    </TouchableOpacity>
  </View>;

export default pure(PlaybackSecondary);
