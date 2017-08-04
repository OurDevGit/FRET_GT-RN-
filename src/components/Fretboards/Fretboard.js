import React from "react";
import { View, Text } from "react-native";

import * as actions from "../../redux/actions";
import FretboardLabels from "./FretboardFretLabels";
import FretboardBackground from "./FretboardFretBackground";
import FretboardFrets from "./FretboardFrets";
import FretboardStrings from "./FretboardStrings";

const Fretboard = ({ style, track, boardWidth }) =>
  <View
    style={{
      ...style,
      paddingTop: "0.5%",
      paddingBottom: "3.5%",
      paddingHorizontal: "1%",
      backgroundColor: "#E6D9B9"
    }}
  >
    <Text style={{ fontSize: boardWidth * 0.015, marginBottom: 4 }}>
      {track.name || " "}
    </Text>
    <FretboardLabels track={track} boardWidth={boardWidth} />
    <View style={{ flex: 1 }}>
      <FretboardBackground track={track} boardWidth={boardWidth} />
      <FretboardStrings track={track} boardWidth={boardWidth} />
      <FretboardFrets style={style} track={track} boardWidth={boardWidth} />
    </View>
  </View>;

export default Fretboard;
