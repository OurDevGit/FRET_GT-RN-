import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { pure } from "recompose";

import { BtnTempoModal, BtnMyLoopsModal } from "../../modals";
import { PrimaryBlue } from "../../../design";
import {
  BtnLibrary,
  BtnPrevious,
  BtnRewind,
  BtnPlay,
  BtnForward,
  BtnNext,
  BtnPhoneLoopToggle
} from "../../StyleKit";

const primaryStyle = isPhone => {
  return {
    width: isPhone ? 30 : 36,
    height: isPhone ? 30 : 36
  };
};

const secondaryStyle = isPhone => {
  return {
    marginTop: -4,
    fontSize: isPhone ? 18 : 20,
    color: PrimaryBlue
  };
};

const PlaybackCompact = ({
  title,
  mediaId,
  trackCount,
  isPlaying,
  isPhone,
  isVideo,
  isSmart,
  tempo,
  loopIsEnabled,
  currentLoop,
  onSelectTempo,
  onToggleLibrary,
  onPreviousPress,
  onBackPress,
  onPlayPausePress,
  onForwardPress,
  onNextPress,
  onLoopEnable,
  onSetCurrentLoop,
  onClearCurrentLoop
}) => (
  <View
    style={{
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      paddingRight: 20
    }}
  >
    <View
      style={{
        flex: 1.2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 10
      }}
    >
      {trackCount > 3 &&
        onToggleLibrary !== undefined && (
          <BtnLibrary
            style={{ width: 44, height: 44, marginTop: 4 }}
            color={PrimaryBlue}
            onPress={onToggleLibrary}
          />
        )}

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
      <View style={{ width: 30 }} />
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
        numberOfLines={1}
        ellipsizeMode={"tail"}
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
        flex: 1.2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 30
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: -2
        }}
      >
        <BtnTempoModal
          color={PrimaryBlue}
          currentTempo={tempo}
          isPhone={isPhone}
          isSmart={isSmart}
          onSelectTempo={onSelectTempo}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        {isPhone ? (
          <BtnPhoneLoopToggle
            style={{ width: 36, height: 36 }}
            loopsEnabled={loopIsEnabled}
            color={PrimaryBlue}
            onPress={onLoopEnable}
          />
        ) : (
          <TouchableOpacity onPress={onLoopEnable}>
            <Text style={{ ...secondaryStyle(isPhone) }}>
              {loopIsEnabled ? "Loop ON" : "Loop OFF"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <BtnMyLoopsModal
          style={secondaryStyle(isPhone)}
          mediaId={mediaId}
          currentLoop={currentLoop}
          color={PrimaryBlue}
          isPhone={isPhone}
          isVideo={isVideo}
          onSetCurrentLoop={onSetCurrentLoop}
          onClearCurrentLoop={onClearCurrentLoop}
        />
      </View>
    </View>
  </View>
);

PlaybackCompact.propTypes = {
  title: PropTypes.string.isRequired,
  mediaId: PropTypes.string.isRequired,
  trackCount: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isPhone: PropTypes.bool.isRequired,
  isSmart: PropTypes.bool.isRequired,
  isVideo: PropTypes.bool.isRequired,
  tempo: PropTypes.number.isRequired,
  loopIsEnabled: PropTypes.bool.isRequired,
  currentLoop: PropTypes.object.isRequired,
  onSelectTempo: PropTypes.func.isRequired,
  onToggleLibrary: PropTypes.func,
  onPreviousPress: PropTypes.func.isRequired,
  onBackPress: PropTypes.func.isRequired,
  onPlayPausePress: PropTypes.func.isRequired,
  onForwardPress: PropTypes.func.isRequired,
  onNextPress: PropTypes.func.isRequired,
  onLoopEnable: PropTypes.func.isRequired,
  onSetCurrentLoop: PropTypes.func.isRequired,
  onClearCurrentLoop: PropTypes.func.isRequired
};

export default pure(PlaybackCompact);
