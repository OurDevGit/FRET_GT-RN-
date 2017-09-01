import React from "react";
import { pure } from "recompose";
import { View, Picker, Text, TouchableOpacity } from "react-native";
import { LoopLeft, LoopRight, BtnFretlightInfo } from "../StyleKit";
import { PrimaryBlue } from "../../design";
import { BtnTempoModal, BtnSaveLoopModal, BtnMyLoopsModal } from "../modals";

const buttonStyle = {
  flex: 1,
  minWidth: 50,
  height: 30,
  marginHorizontal: 6,
  paddingTop: 4,
  fontSize: 20,
  lineHeight: 20,
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center"
};

const PlaybackSecondary = ({
  mediaId,
  tempo,
  loopIsEnabled,
  currentLoop,
  connectedDevices,
  onSelectTempo,
  onLoopEnable,
  onLoopBegin,
  onLoopEnd,
  onSetCurrentLoop,
  onClearCurrentLoop,
  onDisplayMyLoops,
  onDisplayInfo,
  onDisplayFretlightStatus
}) =>
  <View
    style={{
      height: 35,
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center"
    }}
  >
    <BtnTempoModal currentTempo={tempo} onSelectTempo={onSelectTempo} />

    <TouchableOpacity onPress={onLoopEnable}>
      <Text style={buttonStyle}>
        {loopIsEnabled ? "Loop ON" : "Loop OFF"}
      </Text>
    </TouchableOpacity>

    <LoopLeft
      style={{ width: 35, height: 35 }}
      isEnabled={true}
      onPress={onLoopBegin}
    />
    <LoopRight
      style={{ width: 35, height: 35 }}
      isEnabled={true}
      onPress={onLoopEnd}
    />

    <BtnSaveLoopModal
      style={buttonStyle}
      mediaId={mediaId}
      currentLoop={currentLoop}
      onSetCurrentLoop={onSetCurrentLoop}
    />

    <BtnMyLoopsModal
      style={buttonStyle}
      mediaId={mediaId}
      currentLoop={currentLoop}
      onSetCurrentLoop={onSetCurrentLoop}
      onClearCurrentLoop={onClearCurrentLoop}
    />

    <View style={{ flex: -1, flexDirection: "row" }}>
      <BtnFretlightInfo
        style={{ width: 35, height: 35 }}
        onPress={onDisplayInfo}
      />

      <TouchableOpacity onPress={onDisplayFretlightStatus}>
        <Text
          style={{
            flex: 1,
            marginLeft: 6,
            paddingTop: 4,
            paddingHorizontal: 12,
            fontSize: 20,
            color: "white",
            lineHeight: 20,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: PrimaryBlue,
            borderRadius: 6
          }}
        >
          Fretlight Status ({connectedDevices})
        </Text>
      </TouchableOpacity>
    </View>
  </View>;

export default pure(PlaybackSecondary);
