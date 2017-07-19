import React from "react";
import { View, Text } from "react-native";

import * as actions from "../../redux/actions";
import FretboardBackground from "./FretboardFretBackground";
import FretboardFrets from "./FretboardFrets";
import FretboardStrings from "./FretboardStrings";

const Fretboard = ({ style, track }) => (
  <View
    style={{
      ...style, 
      paddingTop: 10, 
      paddingRight: 10, 
      paddingBottom: 20,
      paddingLeft: 10, 
      backgroundColor: "#E6D9B9",
    }}
  >
    <Text style={{ height: 20, marginTop: -2 }} >{track === undefined ? " " : track.name}</Text>
    <FretboardBackground style={style} track={track} />
    <FretboardStrings track={track} />
    <FretboardFrets style={style} track={track} />
  </View>
);

export default Fretboard;
