import React from "react";
import { View } from "react-native";
import FretboardNote from "./FretboardNote";

const background = { position: "absolute", width: "100%", height: "100%", backgroundColor: 'black' }
const bar = { position: "absolute", right: 0, width: 3, height: "100%", backgroundColor: '#CCCCCC' }

const FretboardFret = ({ style }) => (
  <View style={{ ...style, flex: 1 }}>
    <View style={background} />
    <View style={bar} />
    <View
      style={{ marginLeft: "-10%", paddingTop: 4, paddingBottom: 4, flex: 1, flexDirection: "column", justifyContent: "space-between", alignItems: "center" }}
    >
      <FretboardNote index={0} />
      <FretboardNote index={1} />
      <FretboardNote index={2} />
      <FretboardNote index={3} />
      <FretboardNote index={4} />
      <FretboardNote index={5} />
    </View>
  </View>
);

export default FretboardFret;
