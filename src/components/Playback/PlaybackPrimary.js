import React from "react";
import { View, Button, Text, TouchableOpacity, Slider } from "react-native";
import { SliderVolumeController } from "react-native-volume-controller";
import { pure } from "recompose";
import { PrimaryBlue, playerBackground, adjustedFontSize } from "../../design";
import {
  BtnPrevious,
  BtnRewind,
  BtnPlay,
  BtnForward,
  BtnNext,
  BtnHeart
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
const primaryStyle = isPhone => {
  return isPhone
    ? { width: 32, height: 32, marginHorizontal: 6 }
    : { width: 50, height: 50, marginHorizontal: 10 };
};

const PlaybackPrimary = ({
  mediaId,
  title,
  isPlaying,
  isPhone,
  onPreviousPress,
  onBackPress,
  onPlayPausePress,
  onForwardPress,
  onNextPress
}) => (
  <View
    style={{
      flex: 1,
      padding: 5,
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
      <Text style={{ flex: 1 }}>{title}</Text>
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
        style={primaryStyle(isPhone)}
        color={PrimaryBlue}
        onPress={onPreviousPress}
      />

      <BtnRewind
        style={primaryStyle(isPhone)}
        color={PrimaryBlue}
        onPress={onBackPress}
      />

      <BtnPlay
        isShowingPause={isPlaying}
        style={primaryStyle(isPhone)}
        color={PrimaryBlue}
        onPress={onPlayPausePress}
      />

      <BtnForward
        style={primaryStyle(isPhone)}
        color={PrimaryBlue}
        onPress={onForwardPress}
      />

      <BtnNext
        style={primaryStyle(isPhone)}
        color={PrimaryBlue}
        onPress={onNextPress}
      />
    </View>

    <View
      style={{
        flex: 1,
        marginRight: 6,
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: playerBackground
      }}
    >
      <Text
        style={{
          height: 14,
          color: PrimaryBlue,
          fontSize: adjustedFontSize(14),
          textAlign: "center",
          textAlignVertical: "bottom"
        }}
      >
        Volume
      </Text>
      <SliderVolumeController style={{ height: 44, marginRight: 10 }} />
    </View>

    {!isPhone && (
      <View style={{ position: "absolute", top: 0, right: 0 }}>
        <BtnHeart
          style={{
            width: 40,
            height: 40
          }}
          mediaId={mediaId}
        />
      </View>
    )}
  </View>
);

export default pure(PlaybackPrimary);
