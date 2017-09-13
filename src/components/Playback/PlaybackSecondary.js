import React from "react";
import { pure } from "recompose";
import { View, Picker, Text, TouchableOpacity } from "react-native";
import {
  LoopLeft,
  LoopRight,
  PhoneLoopLeft,
  PhoneLoopRight,
  BtnFretlightInfo,
  BtnPrevStep,
  BtnNextStep,
  BtnPhoneLoopToggle,
  BtnPhoneLoopSave,
  BtnPhoneMyLoops
} from "../StyleKit";
import { PrimaryBlue } from "../../design";
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

    {isPhone ? (
      <PhoneLoopLeft
        style={{ width: 36, height: 36 }}
        isEnabled={true}
        onPress={onLoopBegin}
      />
    ) : (
      <LoopLeft
        style={{ width: 30, height: 30 }}
        isEnabled={true}
        onPress={onLoopBegin}
      />
    )}
    {isPhone ? (
      <PhoneLoopRight
        style={{ width: 36, height: 36 }}
        isEnabled={true}
        onPress={onLoopEnd}
      />
    ) : (
      <LoopRight
        style={{ width: 30, height: 30 }}
        isEnabled={true}
        onPress={onLoopEnd}
      />
    )}

    <BtnSaveLoopModal
      style={buttonStyle}
      mediaId={mediaId}
      currentLoop={currentLoop}
      isPhone={isPhone}
      onSetCurrentLoop={onSetCurrentLoop}
    />

    <BtnMyLoopsModal
      style={buttonStyle}
      mediaId={mediaId}
      currentLoop={currentLoop}
      isPhone={isPhone}
      color={"#222222"}
      onSetCurrentLoop={onSetCurrentLoop}
      onClearCurrentLoop={onClearCurrentLoop}
    />

    <View style={{ flex: -1, flexDirection: "row" }}>
      <BtnFretlightInfo
        style={{
          width: isPhone ? 30 : 35,
          height: isPhone ? 30 : 35,
          marginRight: 10
        }}
        onPress={onDisplayInfo}
      />

      <BtnFretlightModal isPhone={isPhone} devices={connectedDevices} />
    </View>
  </View>
);

export default pure(PlaybackSecondary);
