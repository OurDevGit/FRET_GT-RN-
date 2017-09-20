import React from "react";
import { View, Button, Text, TouchableOpacity, Slider } from "react-native";
import PropTypes from "prop-types";
import Video from "react-native-video";
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
import VideoMarkersTable from "./VideoMarkersTable";

const buttonStyle = { width: 50, height: 50, marginHorizontal: 10 };

class PlaybackVideoPrimary extends React.Component {
  render() {
    const {
      mediaId,
      title,
      tempo,
      isPlaying,
      isPhone,
      markers,
      duration,
      onPlayerRegister,
      onVideoLoad,
      onProgress,
      onEnd,
      onError,
      onPreviousPress,
      onBackPress,
      onPlayPausePress,
      onForwardPress,
      onNextPress,
      onMarkerPress
    } = this.props;

    return (
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            marginRight: 30
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
          <Text style={{ flex: 1, fontSize: 18 }}>{title}</Text>

          <View
            style={{
              flex: 1,
              width: "100%",
              marginRight: 6,
              flexDirection: "column",
              justifyContent: "center"
            }}
          >
            <Slider
              style={{
                marginTop: 20,
                width: "100%",
                height: 44
              }}
            />
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
        </View>

        <View
          style={{
            height: "100%",
            aspectRatio: 1.778,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "flex-start"
          }}
        >
          <Video
            style={{ width: "100%", height: "100%" }}
            source={require("../../lesson.mp4")}
            paused={!isPlaying}
            rate={tempo}
            resizeMode="contain"
            onLoad={onVideoLoad}
            onProgress={onProgress}
            onEnd={onEnd}
            onError={onError}
            ref={ref => onPlayerRegister(ref)}
            onTimedMetadata={metaData => console.log({ metaData })}
          />

          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <BtnPrevious
              style={buttonStyle}
              color={"#FFFFFF"}
              onPress={onPreviousPress}
            />

            <BtnRewind
              style={buttonStyle}
              color={"#FFFFFF"}
              onPress={onBackPress}
            />

            <BtnPlay
              isShowingPause={isPlaying}
              style={buttonStyle}
              color={"#FFFFFF"}
              onPress={onPlayPausePress}
            />

            <BtnForward
              style={buttonStyle}
              color={"#FFFFFF"}
              onPress={onForwardPress}
            />

            <BtnNext
              style={buttonStyle}
              color={"#FFFFFF"}
              onPress={onNextPress}
            />
          </View>
        </View>

        <VideoMarkersTable
          videoMarkers={markers}
          onMarkerPress={onMarkerPress}
        />

        <View style={{ position: "absolute", top: -8, right: -8 }}>
          <BtnHeart
            style={{
              width: 40,
              height: 40
            }}
            mediaId={mediaId}
          />
        </View>
      </View>
    );
  }
}

PlaybackVideoPrimary.propTypes = {
  mediaId: PropTypes.string,
  title: PropTypes.string,
  tempo: PropTypes.number,
  markers: PropTypes.array,
  duration: PropTypes.number,
  isPlaying: PropTypes.bool,
  isPhone: PropTypes.bool,
  onLoad: PropTypes.func,
  onProgress: PropTypes.func,
  onEnd: PropTypes.func,
  onError: PropTypes.func,
  onPlayerRegister: PropTypes.func,
  onPreviousPress: PropTypes.func,
  onBackPress: PropTypes.func,
  onPlayPausePress: PropTypes.func,
  onForwardPress: PropTypes.func,
  onNextPress: PropTypes.func,
  onMarkerPress: PropTypes.func
};

export default pure(PlaybackVideoPrimary);
