import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

const LargeButton = ({ isSelected, iconURL, title, onPress, color }) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        backgroundColor: isSelected ? color : null,
        paddingTop: 15,
        paddingBottom: 15,
        borderBottomColor: color,
        borderBottomWidth: 1
      }}
    >
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image source={{ uri: iconURL }} style={{ height: 30, width: 30 }} />
      </View>
      <Text
        style={{
          fontSize: 14,
          width: "100%",
          textAlign: "center",
          color: isSelected ? "white" : "black"
        }}
      >
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

export default LargeButton;

/*
    
        
      
    </View>
  </TouchableOpacity>*/
