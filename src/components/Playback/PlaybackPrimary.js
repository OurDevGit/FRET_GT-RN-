import React from "react";
import PropTypes from "prop-types";
import { View, Image, StyleSheet, Text } from "react-native";
import Dimensions from "Dimensions";
import { pure } from "recompose";
import { PrimaryBlue } from "../../design";
import { getIsPhone } from "../../utils";
import {
  BtnPrevious,
  BtnRewind,
  BtnPlay,
  BtnForward,
  BtnNext,
  BtnHeartSmart,
  PhoneVolumeIcon
} from "../StyleKit";
import MediaTitle from "./MediaTitle";
import VolumeSlider from "./VolumeSlider";

const primaryStyle = {
  width: getIsPhone() ? 32 : 50,
  height: getIsPhone() ? 32 : 50,
  marginHorizontal: getIsPhone() ? 6 : 10
};

const PlaybackPrimary = props => {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          source={{ uri: props.artworkURL }}
          resizeMode="contain"
          style={styles.art}
        />

        <MediaTitle title={props.title} artist={props.artist} />
      </View>

      <View style={styles.buttonContainer}>
        <BtnPrevious
          style={primaryStyle}
          color={PrimaryBlue}
          onPress={props.onPreviousPress}
        />

        <BtnRewind
          style={primaryStyle}
          color={PrimaryBlue}
          onPress={props.onBackPress}
        />

        <BtnPlay
          isShowingPause={props.isPlaying}
          style={primaryStyle}
          color={PrimaryBlue}
          onPress={props.onPlayPausePress}
        />

        <BtnForward
          style={primaryStyle}
          color={PrimaryBlue}
          onPress={props.onForwardPress}
        />

        <BtnNext
          style={primaryStyle}
          color={PrimaryBlue}
          onPress={props.onNextPress}
        />
      </View>

      <View style={styles.volumeContainer}>
        {props.isPhone ? (
          <PhoneVolumeIcon style={{ width: 20, height: 20 }} />
        ) : (
          <Text style={styles.volumeText}>Volume</Text>
        )}
        <VolumeSlider
          style={{ width: "100%", height: getIsPhone() ? 22 : 44 }}
        />
      </View>

      {!props.isPhone && (
        <View style={styles.favorite}>
          <BtnHeartSmart mediaId={props.mediaId} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: -15
  },
  top: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  art: {
    height: "100%",
    aspectRatio: 1,
    marginRight: 6
  },
  buttonContainer: {
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: getIsPhone() ? 32 : 50,
    height: getIsPhone() ? 32 : 50,
    marginHorizontal: getIsPhone() ? 6 : 10
  },
  volumeContainer: {
    flex: 1,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center"
  },
  volumeText: {
    color: PrimaryBlue,
    fontSize: getIsPhone() ? 14 : 18,
    textAlign: "center"
  },
  favorite: { position: "absolute", top: 0, right: 0 }
});

PlaybackPrimary.propTypes = {
  height: PropTypes.number,
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
