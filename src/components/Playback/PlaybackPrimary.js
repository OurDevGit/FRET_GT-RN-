import React from "react";
import { View, Button, Text, TouchableOpacity, Slider } from "react-native";
import { PrimaryBlue } from "../../design"

const buttonStyle = { width: 50, aspectRatio: 1, marginHorizontal: 5, color: PrimaryBlue, fontSize: 24, fontWeight: "bold", textAlign: "center" }
const textStyle = { color: PrimaryBlue, fontSize: 20 }

const PlaybackPrimary = ({ 
  title,
  isPlaying,
  handlePreviousPress,
  handleBackPress,
  handlePlayPausePress,
  handleForwardPress,
  handleNextPress
  }) => (
  <View
    style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center" }}
  >
    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
      <View style={{ flex: 1, aspectRatio: 1, margin: 10, backgroundColor: "#222222" }} />
      <Text style={{ flex: 1 }}>Media info</Text>
    </View>
    
    <View style={{ flex: 2, flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity onPress={handlePreviousPress}>
        <Text style={buttonStyle}>{`<<`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBackPress}>
        <Text style={buttonStyle}>{`<`}<Text style={textStyle}>5</Text></Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePlayPausePress}>
        <Text style={buttonStyle}>{isPlaying ? `||` : `>`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForwardPress}>
        <Text style={buttonStyle}><Text style={textStyle}>30</Text>{`>`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNextPress}>
        <Text style={buttonStyle}>{`>>`}</Text>
      </TouchableOpacity>
    </View>

    <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
      <Text style={{ color: PrimaryBlue, fontSize: 14, textAlign: "center", marginBottom: -20 }}>Volume</Text>
      <Slider style={{ flex: 1 }} />
    </View>

  </View>
);

export default PlaybackPrimary;
