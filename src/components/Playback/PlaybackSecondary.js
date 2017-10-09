import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { onlyUpdateForKeys } from "recompose";
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
  loopIsEnabled,
  currentLoop,
  quickLoops,
  connectedDevices,
  isPhone,
  isVideo,
  isFullscreen,
  onSelectTempo,
  onPrevStep,
  onNextStep,
  onLoopEnable,
  onLoopBegin,
  onLoopEnd,
  onSetCurrentLoop,
  onClearCurrentLoop,
  onDisplayInfo,
  onForceControlsVisible
}) => {
  return (
    <View
      style={{
        width: "100%",
        paddingHorizontal: 10,
        height: 35,
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        marginTop: isPhone && isVideo ? -10 : 0
      }}
    >
      <BtnTempoModal
        currentTempo={tempo}
        color={"#222222"}
        isPhone={isPhone}
        onSelectTempo={onSelectTempo}
        onForceControlsVisible={onForceControlsVisible}
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
        onForceControlsVisible={onForceControlsVisible}
      />

      <BtnMyLoopsModal
        style={buttonStyle}
        mediaId={mediaId}
        currentLoop={currentLoop}
        quickLoops={quickLoops}
        isPhone={isPhone}
        isVideo={isVideo}
        color={"#222222"}
        onSetCurrentLoop={onSetCurrentLoop}
        onClearCurrentLoop={onClearCurrentLoop}
        onForceControlsVisible={onForceControlsVisible}
      />

      <View style={{ flex: -1, flexDirection: "row" }}>
        <BtnFretlightInfo
          style={{
            width: isPhone ? 30 : 35,
            height: isPhone ? 30 : 35,
            marginRight: 10
          }}
          color={isFullscreen ? "#222222" : PrimaryBlue}
          onPress={onDisplayInfo}
        />

        <BtnFretlightModal
          isPhone={isPhone}
          devices={connectedDevices}
          onForceControlsVisible={onForceControlsVisible}
        />
      </View>
    </View>
  );
};

PlaybackSecondary.propTypes = {
  mediaId: PropTypes.string.isRequired,
  tempo: PropTypes.number.isRequired,
  loopIsEnabled: PropTypes.bool.isRequired,
  currentLoop: PropTypes.object.isRequired,
  quickLoops: PropTypes.array,
  connectedDevices: PropTypes.number.isRequired,
  isPhone: PropTypes.bool.isRequired,
  isVideo: PropTypes.bool.isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  onSelectTempo: PropTypes.func.isRequired,
  onPrevStep: PropTypes.func.isRequired,
  onNextStep: PropTypes.func.isRequired,
  onLoopEnable: PropTypes.func.isRequired,
  onLoopBegin: PropTypes.func.isRequired,
  onLoopEnd: PropTypes.func.isRequired,
  onSetCurrentLoop: PropTypes.func.isRequired,
  onClearCurrentLoop: PropTypes.func.isRequired,
  onDisplayInfo: PropTypes.func.isRequired,
  onDisplayToggle: PropTypes.func,
  onForceControlsVisible: PropTypes.func
};

export default connect()(
  onlyUpdateForKeys([
    "mediaId",
    "tempo",
    "loopIsEnabled",
    "isFullscreen",
    "quickLoops"
  ])(PlaybackSecondary)
);
