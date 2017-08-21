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
  fontSize: 24,
  lineHeight: 32,
  fontWeight: "bold",
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
      alignContent: "flex-start"
    }}
  >
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

    <TouchableOpacity onPress={onLoopEnable}>
      <Text style={buttonStyle}>
        {loopIsEnabled ? `( )` : `(/)`}
      </Text>
    </TouchableOpacity>

    <LoopLeft style={{ width: 35, height: 35 }} onPress={onLoopBegin} />
    <LoopRight style={{ width: 35, height: 35 }} onPress={onLoopEnd} />

    <TouchableOpacity onPress={onLoopSave}>
      <Text style={buttonStyle}>{`(✔︎)`}</Text>
    </TouchableOpacity>

    <TouchableOpacity onPress={onDisplayLoops}>
      <Text style={buttonStyle}>{`(my)`}</Text>
    </TouchableOpacity>
  </View>;

export default pure(PlaybackSecondary);
