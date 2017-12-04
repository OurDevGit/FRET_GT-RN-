import React from "react";
import PropTypes from "prop-types";
import { View, Image, Text } from "react-native";
import { pure } from "recompose";
import { PrimaryBlue } from "../../design";
import {
  BtnPrevious,
  BtnRewind,
  BtnPlay,
  BtnForward,
  BtnNext,
  BtnHeartSmart,
  PhoneVolumeIcon
} from "../StyleKit";
import VolumeSlider from "./VolumeSlider";

const primaryStyle = isPhone => {
  return isPhone
    ? { width: 32, height: 32, marginHorizontal: 6 }
    : { width: 50, height: 50, marginHorizontal: 10 };
};

const PlaybackPrimary = ({
  mediaId,
  title,
  artist,
  artworkURL,
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
      marginBottom: -15
    }}
  >
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start"
      }}
    >
      <Image
        source={{ uri: artworkURL }}
        resizeMode="contain"
        style={{
          height: "100%",
          aspectRatio: 1,
          marginRight: 6
        }}
      />

      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            flex: 1,
            color: PrimaryBlue,
            fontSize: isPhone ? 15 : 18
          }}
        >
          {title}
          <Text style={{ fontSize: isPhone ? 13 : 16, color: "black" }}>
            {"\n" + artist}
          </Text>
        </Text>
      </View>
    </View>

    <View
      style={{
        flex: 1.5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
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
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      {isPhone ? (
        <PhoneVolumeIcon style={{ width: 20, height: 20 }} />
      ) : (
        <Text
          style={{
            color: PrimaryBlue,
            fontSize: isPhone ? 14 : 18,
            textAlign: "center"
          }}
        >
          Volume
        </Text>
      )}
      <VolumeSlider style={{ width: "100%", height: isPhone ? 22 : 44 }} />
    </View>

    {!isPhone && (
      <View style={{ position: "absolute", top: 0, right: 0 }}>
        <BtnHeartSmart mediaId={mediaId} />
      </View>
    )}
  </View>
);

PlaybackPrimary.propTypes = {
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  artist: PropTypes.string.isRequired,
  artworkURL: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isPhone: PropTypes.bool.isRequired,
  onPreviousPress: PropTypes.func.isRequired,
  onBackPress: PropTypes.func.isRequired,
  onPlayPausePress: PropTypes.func.isRequired,
  onForwardPress: PropTypes.func.isRequired,
  onNextPress: PropTypes.func.isRequired
};

export default pure(PlaybackPrimary);
