import React from "react";
import { View } from "react-native";

const bar = { position: "absolute", width: "100%", height: "100%" }

const markers = fret => {
  if (fret === 3 || fret === 5 || fret === 7 || fret === 9 || fret === 15 || fret === 17 || fret === 19 || fret === 21) {
    return (<View style={{ width: "30%", aspectRatio: 1, backgroundColor: "#CCCCCC", borderRadius:8, marginLeft: -4, }} />)
  } else if (fret === 12) {
    return (<View>
              <View style={{ width: "30%", marginVertical: "45%", aspectRatio: 1, backgroundColor: "#CCCCCC", borderRadius:8, marginLeft: -4 }} />
              <View style={{ width: "30%", marginVertical: "45%", aspectRatio: 1, backgroundColor: "#CCCCCC", borderRadius:8, marginLeft: -4, }} />
            </View>)
  }
}

const FretboardMarkers = ({ fret }) => (
  <View style={{position: "absolute", width: "100%", height: "100%", flex: 1, alignItems: "center", justifyContent: "center"}}>
    {markers(fret)}
  </View>
);

export default FretboardMarkers;