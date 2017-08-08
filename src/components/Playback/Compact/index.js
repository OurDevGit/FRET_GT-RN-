import React from "react";
import { View, Picker, Text, TouchableOpacity } from "react-native";

import RatePicker from "../RatePicker";
import { PrimaryBlue } from "../../../design";

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
const textStyle = { color: PrimaryBlue, fontSize: 20 };

const PlaybackCompact = ({
  title,
  isPlaying,
  rate,
  loopIsEnabled,
  onPreviousPress,
  onBackPress,
  onPlayPausePress,
  onForwardPress,
  onNextPress,
  onRateChange,
  onLoopEnable,
  onDisplayLoops
}) =>
  <View
    style={{
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <View
      style={{
        flex: 2,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <TouchableOpacity onPress={onPreviousPress}>
        <Text style={buttonStyle}>{`<<`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBackPress}>
        <Text style={buttonStyle}>
          {`<`}
          <Text style={textStyle}>5</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPlayPausePress}>
        <Text style={buttonStyle}>
          {isPlaying ? `||` : `>`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onForwardPress}>
        <Text style={buttonStyle}>
          <Text style={textStyle}>30</Text>
          {`>`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onNextPress}>
        <Text style={buttonStyle}>{`>>`}</Text>
      </TouchableOpacity>
    </View>

    <Text style={{ flex: 1 }}>
      {title}
    </Text>

    <View
      style={{
        flex: 2,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
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

      <TouchableOpacity onPress={onNextPress}>
        <Text style={buttonStyle}>
          {loopIsEnabled ? "Loop ON" : "Loop OFF"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onNextPress}>
        <Text style={buttonStyle}>My Loops</Text>
      </TouchableOpacity>
    </View>
  </View>;

export default PlaybackCompact;
