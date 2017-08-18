import React from "react";
import { View, Button, Text, TouchableOpacity, Slider } from "react-native";
import { pure } from "recompose";
import { PrimaryBlue } from "../../design";
import { BtnPlay, ResizingBehavior } from "../StyleKit";

const buttonStyle = {
  flex: 1,
  minWidth: 50,
  marginHorizontal: 5,
  color: PrimaryBlue,
  fontSize: 24,
  lineHeight: 32,
  fontWeight: "bold",
  textAlign: "center",
  justifyContent: "center",
  alignItems: "center"
};
const textStyle = { color: PrimaryBlue, fontSize: 20 };

const PlaybackPrimary = ({
  title,
  isPlaying,
  onPreviousPress,
  onBackPress,
  onPlayPausePress,
  onForwardPress,
  onNextPress
}) =>
  <View
    style={{
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center"
    }}
  >
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
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
      <Text style={{ flex: 1 }}>
        {title}
      </Text>
    </View>

    <View
      style={{
        flex: 2,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start"
      }}
    >
      <BtnPlay
        isShowingPause={isPlaying}
        color={PrimaryBlue}
        style={{ width: 50, height: 50 }}
        onPress={onPlayPausePress}
        resizing={ResizingBehavior.AspectFit}
        targetFrame={{ left: 0, top: 0, right: 44, bottom: 44 }}
      />

      <TouchableOpacity onPress={onPreviousPress}>
        <Text style={buttonStyle}>{`<<`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onBackPress}>
        <Text style={buttonStyle}>
          {`<`}
          <Text style={textStyle}>5</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPlayPausePress}>
        <Text style={buttonStyle}>
          {isPlaying ? `||` : `>`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onForwardPress}>
        <Text style={buttonStyle}>
          <Text style={textStyle}>30</Text>
          {`>`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onNextPress}>
        <Text style={buttonStyle}>{`>>`}</Text>
      </TouchableOpacity>
    </View>

    <View
      style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
    >
      <Text
        style={{
          color: PrimaryBlue,
          fontSize: 12,
          textAlign: "center",
          marginBottom: -15
        }}
      >
        Volume
      </Text>
      <Slider style={{ flex: 1 }} />
    </View>
  </View>;

export default pure(PlaybackPrimary);
