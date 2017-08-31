import React from "react";
import { pure } from "recompose";
import { View, Picker, Text, TouchableOpacity } from "react-native";
import { LoopLeft, LoopRight } from "../StyleKit";

import RatePicker from "./RatePicker";
import BtnMyLoops from "./BtnMyLoops";

const buttonStyle = {
  flex: 1,
  minWidth: 50,
  height: 30,
  marginHorizontal: 6,
  paddingTop: 4,
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
  onDisplaySaveLoopModal,
  onDisplayMyLoops
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
          paddingTop: 5,
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
          marginTop: -8,
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

    <LoopLeft
      style={{ width: 35, height: 35 }}
      isEnabled={true}
      onPress={onLoopBegin}
    />
    <LoopRight
      style={{ width: 35, height: 35 }}
      isEnabled={true}
      onPress={onLoopEnd}
    />

    <TouchableOpacity onPress={onDisplaySaveLoopModal}>
      <Text style={buttonStyle}>Save Loop</Text>
    </TouchableOpacity>

    <BtnMyLoops style={buttonStyle} onPress={onDisplayMyLoops} />
  </View>;

export default pure(PlaybackSecondary);
