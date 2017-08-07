import React from "react";
import { View, Picker, Text, TouchableOpacity } from "react-native";

import { PrimaryBlue } from "../../design";
import RatePicker from "./RatePicker";

const buttonStyle = {
  flex: 1,
  minWidth: 50,
  marginHorizontal: 5,
  color: PrimaryBlue,
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
      width: "100%",
      height: 30,
      flexDirection: "row",
      alignContent: "flex-start"
    }}
  >
    <View
      style={{ width: 110, height: "100%", marginTop: -10, marginBottom: -5 }}
    >
      <RatePicker rate={rate} onRateChange={onRateChange} />

      <TouchableOpacity onPress={onLoopEnable}>
        <Text style={buttonStyle}>
          {loopIsEnabled ? `( )` : `(/)`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLoopBegin}>
        <Text style={buttonStyle}>{`|>`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLoopEnd}>
        <Text style={buttonStyle}>{`<|`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onLoopSave}>
        <Text style={buttonStyle}>{`(✔︎)`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDisplayLoops}>
        <Text style={buttonStyle}>{`(my)`}</Text>
      </TouchableOpacity>
    </View>
  </View>;

export default PlaybackSecondary;

// hold down marker for loop
