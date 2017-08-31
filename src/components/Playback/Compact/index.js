import React from "react";
import { View, Picker, Text, TouchableOpacity } from "react-native";
import { pure } from "recompose";

import RatePicker from "../RatePicker";
import MeasureableButton from "../../modals/ModalButton";
import { BtnTempoModal } from "../../modals";
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
  onSelectTempo,
  onToggleLibrary,
  onPreviousPress,
  onBackPress,
  onPlayPausePress,
  onForwardPress,
  onNextPress,
  onLoopEnable,
  onDisplayMyLoops
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
      <BtnTempoModal currentTempo={rate} onSelectTempo={onSelectTempo} />

      <TouchableOpacity onPress={onLoopEnable}>
        <Text style={secondaryStyle}>
          {loopIsEnabled ? "Loop ON" : "Loop OFF"}
        </Text>
      </TouchableOpacity>

      <MeasureableButton onPress={onDisplayMyLoops}>
        <Text style={secondaryStyle}>My Loops</Text>
      </MeasureableButton>
    </View>
  </View>;

export default pure(PlaybackCompact);
