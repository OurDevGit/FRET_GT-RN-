import React from "react";
import { View, Picker, Text, TouchableOpacity } from "react-native";
import { pure } from "recompose";

import RatePicker from "../RatePicker";
import { PrimaryBlue } from "../../../design";
import {
  BtnLibrary,
  BtnPrevious,
  BtnRewind,
  BtnPlay,
  BtnForward,
  BtnNext
} from "../../StyleKit";

const primaryStyle = {
  width: 32,
  height: 32,
  marginHorizontal: 8
};
const secondaryStyle = {
  marginTop: -4,
  fontSize: 20,
  lineHeight: 20,
  marginHorizontal: 20,
  color: PrimaryBlue
};

const PlaybackCompact = ({
  title,
  trackCount,
  isPlaying,
  rate,
  loopIsEnabled,
  onToggleLibrary,
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
      alignItems: "center",
      marginTop: 10,
      paddingHorizontal: 10
    }}
  >
    <View
      style={{
        flex: 2,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center"
      }}
    >
      {trackCount > 3 &&
        <BtnLibrary
          style={{ ...primaryStyle, marginRight: 30 }}
          color={PrimaryBlue}
          onPress={onToggleLibrary}
        />}

      <BtnPrevious
        style={primaryStyle}
        color={PrimaryBlue}
        onPress={onPreviousPress}
      />

      <BtnRewind
        style={primaryStyle}
        color={PrimaryBlue}
        onPress={onBackPress}
      />

      <BtnPlay
        isShowingPause={isPlaying}
        style={primaryStyle}
        color={PrimaryBlue}
        onPress={onPlayPausePress}
      />

      <BtnForward
        style={primaryStyle}
        color={PrimaryBlue}
        onPress={onForwardPress}
      />

      <BtnNext style={primaryStyle} color={PrimaryBlue} onPress={onNextPress} />
    </View>

    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          color: PrimaryBlue,
          fontSize: 18
        }}
      >
        {title}
      </Text>
    </View>

    <View
      style={{
        flex: 2,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center"
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
        <Text style={secondaryStyle}>
          {loopIsEnabled ? "Loop ON" : "Loop OFF"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onDisplayLoops}>
        <Text style={secondaryStyle}>My Loops</Text>
      </TouchableOpacity>
    </View>
  </View>;

export default pure(PlaybackCompact);
