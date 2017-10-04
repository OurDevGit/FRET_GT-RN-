import React from "react";
import PropTypes from "prop-types";
import { View, Button, Text, TouchableOpacity, Slider } from "react-native";
import Video from "react-native-video";
import { pure } from "recompose";
import { PrimaryBlue, playerBackground } from "../../design";
import {
  BtnPrevious,
  BtnRewind,
  BtnPlay,
  BtnForward,
  BtnNext,
  BtnVideoFullScreen,
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
      areControlsVisible,
      isPhone,
      isFullscreen,
      markers,
      currentChapter,
      currentMarker,
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
      onMarkerPress,
      onDisplayControls,
      onFullscreen
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
        {!isFullscreen && (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
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
                justifyContent: "flex-end"
              }}
            >
              <Slider
                style={{
                  width: "100%",
                  height: 44
                }}
              />
              <Text
                style={{
                  position: "absolute",
                  bottom: 40,
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
        )}

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

          <TouchableOpacity
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%"
            }}
            onPress={onDisplayControls}
          />

          {areControlsVisible && (
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

              <View
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10
                }}
              >
                <BtnVideoFullScreen
                  style={{
                    width: 50,
                    height: 50
                  }}
                  color={"#FFFFFF"}
                  onPress={onFullscreen}
                />
              </View>

              {!isFullscreen && (
                <BtnVideoFullScreen
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    width: 50,
                    height: 50
                  }}
                  color={"#FFFFFF"}
                  onPress={onFullscreen}
                />
              )}
            </View>
          )}
        </View>

        {!isFullscreen && (
          <VideoMarkersTable
            videoMarkers={markers}
            currentChapter={currentChapter}
            currentMarker={currentMarker}
            onMarkerPress={onMarkerPress}
          />
        )}

        {!isFullscreen && (
          <View style={{ position: "absolute", top: -8, right: -8 }}>
            <BtnHeart
              style={{
                width: 40,
                height: 40
              }}
              mediaId={mediaId}
            />
          </View>
        )}

        {isFullscreen &&
        areControlsVisible && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              flex: -1,
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              backgroundColor: "rgba(255, 255, 255, 0.85)"
            }}
          >
            <TouchableOpacity style={{ flex: -1 }} onPress={onFullscreen}>
              <Text
                style={{
                  marginLeft: 20,
                  marginVertical: 12,
                  fontSize: 18,
                  fontWeight: "800"
                }}
              >
                Done
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                flex: 1,
                width: "100%",
                marginVertical: 12,
                fontSize: 18,
                fontWeight: "400",
                textAlign: "center"
              }}
            >
              {title}
            </Text>

            <BtnHeart
              style={{
                width: 40,
                height: 40,
                marginRight: 10
              }}
              mediaId={mediaId}
            />
          </View>
        )}
      </View>
    );
  }
}

PlaybackVideoPrimary.propTypes = {
  mediaId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tempo: PropTypes.number.isRequired,
  markers: PropTypes.array.isRequired,
  currentChapter: PropTypes.object.isRequired,
  currentMarker: PropTypes.object.isRequired,
  duration: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isPhone: PropTypes.bool.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  areControlsVisible: PropTypes.bool.isRequired,
  onProgress: PropTypes.func.isRequired,
  onEnd: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onPlayerRegister: PropTypes.func.isRequired,
  onPreviousPress: PropTypes.func.isRequired,
  onBackPress: PropTypes.func.isRequired,
  onPlayPausePress: PropTypes.func.isRequired,
  onForwardPress: PropTypes.func.isRequired,
  onNextPress: PropTypes.func.isRequired,
  onMarkerPress: PropTypes.func.isRequired,
  onDisplayControls: PropTypes.func.isRequired,
  onFullscreen: PropTypes.func.isRequired
};

export default pure(PlaybackVideoPrimary);
