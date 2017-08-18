import React from "react";
import { View, Button, Text, TouchableOpacity, Slider } from "react-native";
import { pure } from "recompose";
import { PrimaryBlue } from "../../design";
import {
  BtnPrevious,
  BtnRewind,
  BtnPlay,
  BtnForward,
  BtnNext,
  ResizingBehavior
} from "../StyleKit";

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

const PlaybackPrimary = ({
  title,
  isPlaying,
  onPreviousPress,
  onBackPress,
  onPlayPausePress,
  onForwardPress,
  onNextPress
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
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
      }}
    >
      <View
        style={{
          flex: 1,
          aspectRatio: 1,
          margin: 7,
          backgroundColor: "#222222"
        }}
      />
      <Text style={{ flex: 1 }}>
        {title}
      </Text>
    </View>

    <View
      style={{
        flex: 2,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      <BtnPrevious
        style={{ width: 50, height: 50 }}
        size={{ width: 44, height: 44 }}
        color={PrimaryBlue}
        onPress={onPreviousPress}
      />

      <BtnRewind
        style={{ width: 50, height: 50 }}
        size={{ width: 44, height: 44 }}
        color={PrimaryBlue}
        onPress={onBackPress}
      />

      <BtnPlay
        isShowingPause={isPlaying}
        style={{ width: 100, height: 100, backgroundColor: "red" }}
        size={{ width: 100, height: 100 }}
        color={PrimaryBlue}
        onPress={onPlayPausePress}
      />

      <BtnForward
        style={{ width: 50, height: 50 }}
        size={{ width: 44, height: 44 }}
        color={PrimaryBlue}
        onPress={onForwardPress}
      />

      <BtnNext
        style={{ width: 50, height: 50 }}
        size={{ width: 44, height: 44 }}
        color={PrimaryBlue}
        onPress={onNextPress}
      />
    </View>

    <View
      style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
    >
      <Text
        style={{
          color: PrimaryBlue,
          fontSize: 12,
          textAlign: "center",
          marginBottom: -15
        }}
      >
        Volume
      </Text>
      <Slider style={{ flex: 1 }} />
    </View>
  </View>;

export default pure(PlaybackPrimary);
