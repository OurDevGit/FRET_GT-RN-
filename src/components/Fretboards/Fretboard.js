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
      backgroundColor: "#E6D9B9"
    }}
  >
    <Text style={{ fontSize: boardWidth * 0.013, marginBottom: 1 }}>
      {track.name || " "}
    </Text>
    <FretboardLabels track={track} boardWidth={boardWidth} />
    <View style={{ flex: 1 }}>
      <FretboardBackground track={track} boardWidth={boardWidth} />
      <FretboardStrings track={track} boardWidth={boardWidth} />
      <FretboardFrets track={track} boardWidth={boardWidth} />
    </View>
  </View>;

export default Fretboard;
