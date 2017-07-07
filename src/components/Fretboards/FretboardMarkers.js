import React from "react";
import { View } from "react-native";

const bar = { position: "absolute", width: "100%", height: "100%" }

const markers = fretIndex => {
  if (fretIndex === 3 || fretIndex === 5 || fretIndex === 7 || fretIndex === 9 || fretIndex === 15 || fretIndex === 17 || fretIndex === 19 || fretIndex === 21) {
    return (<View style={{ width: "30%", aspectRatio: 1, backgroundColor: "#CCCCCC", borderRadius:8, }} />)
  } else if (fretIndex === 12) {
    return (<View>
              <View style={{ width: "30%", marginVertical: "45%", aspectRatio: 1, backgroundColor: "#CCCCCC", borderRadius:8, }} />
              <View style={{ width: "30%", marginVertical: "45%", aspectRatio: 1, backgroundColor: "#CCCCCC", borderRadius:8, }} />
            </View>)
  }
}

const FretboardMarkers = ({ fretIndex }) => (
  <View style={{position: "absolute", width: "100%", height: "100%", flex: 1, alignItems: "center", justifyContent: "center"}}>
    {markers(fretIndex)}
  </View>
);

export default FretboardMarkers;