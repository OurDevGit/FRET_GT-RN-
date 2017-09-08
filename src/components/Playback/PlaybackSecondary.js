import React from "react";
import { pure } from "recompose";
import { View, Picker, Text, TouchableOpacity } from "react-native";
import {
  LoopLeft,
  LoopRight,
  BtnFretlightInfo,
  BtnPrevStep,
  BtnNextStep,
  BtnPhoneLoopToggle,
  BtnPhoneLoopSave,
  BtnPhoneMyLoops
} from "../StyleKit";
import { PrimaryBlue, adjustedFontSize } from "../../design";
import {
  BtnTempoModal,
  BtnSaveLoopModal,
  BtnMyLoopsModal,
  BtnFretlightModal
} from "../modals";

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
  onPrevStep,
  onNextStep,
  loopIsEnabled,
  currentLoop,
  connectedDevices,
  isPhone,
  onSelectTempo,
  onLoopEnable,
  onLoopBegin,
  onLoopEnd,
  onSetCurrentLoop,
  onClearCurrentLoop,
  onDisplayMyLoops,
  onDisplayInfo,
  onDisplayFretlightStatus
}) => (
  <View
    style={{
      height: 35,
      flexDirection: "row",
      justifyContent: "space-between",
      alignContent: "center"
    }}
  >
    <BtnTempoModal
      currentTempo={tempo}
      isPhone={isPhone}
      onSelectTempo={onSelectTempo}
    />

    {tempo === 0 && (
      <View
        style={{
          marginLeft: -60,
          marginTop: -4,
          flex: -1,
          flexDirection: "row"
        }}
      >
        <BtnPrevStep
          style={{
            width: 40,
            height: 40,
            marginLeft: 5
          }}
          color={PrimaryBlue}
          onPress={onPrevStep}
        />
        <BtnNextStep
          style={{
            width: 40,
            height: 40,
            marginLeft: 40,
            marginLeft: 5
          }}
          color={PrimaryBlue}
          onPress={onNextStep}
        />
      </View>
    )}

    {isPhone ? (
      <BtnPhoneLoopToggle
        style={{ width: 40, height: 40 }}
        loopsEnabled={loopIsEnabled}
        color={"#222222"}
        onPress={onLoopEnable}
      />
    ) : (
      <TouchableOpacity onPress={onLoopEnable}>
        <Text style={buttonStyle}>
          {loopIsEnabled ? "Loop ON" : "Loop OFF"}
        </Text>
      </TouchableOpacity>
    )}

    <LoopLeft
      style={{ width: isPhone ? 35 : 30, height: isPhone ? 35 : 30 }}
      isEnabled={true}
      onPress={onLoopBegin}
    />
    <LoopRight
      style={{ width: isPhone ? 35 : 30, height: isPhone ? 35 : 30 }}
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

      <BtnFretlightModal
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
        connectedDevices={connectedDevices}
      />
    </View>
  </View>
);

export default pure(PlaybackSecondary);
