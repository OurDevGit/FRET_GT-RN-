import React from "react";
import { View, Button, Text, TouchableOpacity, Slider } from "react-native";
import { PrimaryBlue } from "../../design"

const buttonStyle = { width: 50, height: 50, color: PrimaryBlue, fontSize: 24, fontWeight: "bold" }
const textStyle = { color: PrimaryBlue, fontSize: 20 }

const PlaybackPrimary = ({ 
  isPlaying,
  handleMusicPress, 
  handleVideoPress,
  handlePrevious,
  handleBack,
  handlePlayPause,
  handleForward,
  handleNext
  }) => (
  <View
    style={{ flex: 1, flexDirection: "row", justifyContent: "center"
    }}
  >
    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
      <Button
        title="Music"
        onPress={handleMusicPress}
      />
      
      <Button
        title="Video"
        onPress={handleVideoPress}
      />
    </View>
    

    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
      <TouchableOpacity onPress={handlePrevious}>
        <Text style={buttonStyle}>{`<<`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBack}>
        <Text style={buttonStyle}>{`<`}<Text style={textStyle}>5</Text></Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePlayPause}>
        <Text style={buttonStyle}>{isPlaying ? `||` : `>`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForward}>
        <Text style={buttonStyle}><Text style={textStyle}>30</Text>{`>`}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNext}>
        <Text style={buttonStyle}>{`>>`}</Text>
      </TouchableOpacity>
    </View>

    <View style={{ flex: 1, justifyContent: "center" }}>
      <Text style={{ color: PrimaryBlue, fontSize: 14 }}>Volume</Text>
      <Slider />
    </View>

    
    
  </View>
);

export default PlaybackPrimary;
