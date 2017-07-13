import React from "react";
import { View, Button, Text } from "react-native";

const PlaybackPrimary = ({ handleMusicPress, handleVideoPress }) => (
  <View
    style={{
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-around"
    }}
  >
    <Button
      title="Music"
      onPress={handleMusicPress}
    />
    
    <Button
      title="Video"
      onPress={handleVideoPress}
    />
    
  </View>
);

export default PlaybackPrimary;
