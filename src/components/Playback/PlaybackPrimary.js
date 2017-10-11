import React from "react";
import PropTypes from "prop-types";
import { View, Button, Text, TouchableOpacity } from "react-native";
import { pure } from "recompose";
import { PrimaryBlue, playerBackground } from "../../design";
import {
  BtnPrevious,
  BtnRewind,
  BtnPlay,
  BtnForward,
  BtnNext,
  BtnHeart
} from "../StyleKit";
import VolumeSlider from "./VolumeSlider";

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
      <Text style={{ flex: 1, fontSize: isPhone ? 15 : 18 }}>{title}</Text>
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
        justifyContent: "center"
      }}
    >
      <VolumeSlider style={{ marginTop: isPhone ? 50 : 40, height: 44 }} />
      <Text
        style={{
          position: "absolute",
          top: 10,
          width: "100%",
          color: PrimaryBlue,
          fontSize: isPhone ? 14 : 18,
          textAlign: "center",
          textAlignVertical: "bottom"
        }}
      >
        Volume
      </Text>
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

PlaybackPrimary.propTypes = {
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isPhone: PropTypes.bool.isRequired,
  onPreviousPress: PropTypes.func.isRequired,
  onBackPress: PropTypes.func.isRequired,
  onPlayPausePress: PropTypes.func.isRequired,
  onForwardPress: PropTypes.func.isRequired,
  onNextPress: PropTypes.func.isRequired
};

export default pure(PlaybackPrimary);
