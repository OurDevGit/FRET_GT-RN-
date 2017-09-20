import React from "react";
import PropTypes from "prop-types";
import { View, Picker, Text, TouchableOpacity } from "react-native";
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
    height: isPhone ? 30 : 36,
    marginHorizontal: isPhone ? 4 : 20
  };
};

const secondaryStyle = isPhone => {
  return {
    marginTop: -4,
    fontSize: isPhone ? 18 : 20,
    marginHorizontal: isPhone ? 10 : 30,
    color: PrimaryBlue
  };
};

const PlaybackCompact = ({
  title,
  mediaId,
  trackCount,
  isPlaying,
  isPhone,
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
  onClearCurrentLoop,
  onDisplayMyLoops
}) => (
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
      {trackCount > 3 && (
        <BtnLibrary
          style={{ ...primaryStyle(isPhone), marginRight: 30 }}
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
      <BtnTempoModal
        color={PrimaryBlue}
        currentTempo={tempo}
        isPhone={isPhone}
        onSelectTempo={onSelectTempo}
      />

      {isPhone ? (
        <BtnPhoneLoopToggle
          style={{ marginLeft: 30, marginRight: 10, width: 36, height: 36 }}
          loopsEnabled={loopIsEnabled}
          color={PrimaryBlue}
          onPress={onLoopEnable}
        />
      ) : (
        <TouchableOpacity onPress={onLoopEnable}>
          <Text style={{ ...secondaryStyle(isPhone), marginLeft: 50 }}>
            {loopIsEnabled ? "Loop ON" : "Loop OFF"}
          </Text>
        </TouchableOpacity>
      )}

      <BtnMyLoopsModal
        style={secondaryStyle(isPhone)}
        mediaId={mediaId}
        currentLoop={currentLoop}
        color={PrimaryBlue}
        isPhone={isPhone}
        onSetCurrentLoop={onSetCurrentLoop}
        onClearCurrentLoop={onClearCurrentLoop}
      />
    </View>
  </View>
);

export default pure(PlaybackCompact);
