import React from "react";
import { connect } from "react-redux";
import { View, Text, TouchableOpacity } from "react-native";
import { onlyUpdateForKeys } from "recompose";

import * as actions from "../../redux/actions";
import { PrimaryBlue } from "../../design";
import FretboardLabels from "./FretboardFretLabels";
import FretboardBackground from "./FretboardFretBackground";
import FretboardFrets from "./FretboardFrets";
import FretboardStrings from "./FretboardStrings";
import SmartFretText from "../modals/SmartFretText";

const Fretboard = ({
  style,
  track,
  isSmart,
  boardWidth,
  setSmartTrack,
  clearSmartTrack
}) => (
  <View
    style={{
      ...style,
      backgroundColor: "#E6D9B9"
    }}
  >
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text style={{ fontSize: boardWidth * 0.013, marginBottom: 1 }}>
        {track.name || " "}
      </Text>

      <TouchableOpacity
        onPress={() => {
          isSmart ? clearSmartTrack() : setSmartTrack(track);
        }}
      >
        <SmartFretText color={PrimaryBlue} size={16} />
      </TouchableOpacity>
    </View>

    <FretboardLabels track={track} isSmart={isSmart} boardWidth={boardWidth} />
    <View style={{ flex: 1 }}>
      <FretboardBackground
        track={track}
        isSmart={isSmart}
        boardWidth={boardWidth}
      />
      <FretboardStrings
        track={track}
        isSmart={isSmart}
        boardWidth={boardWidth}
      />
      <FretboardFrets track={track} isSmart={isSmart} boardWidth={boardWidth} />
    </View>
  </View>
);

export default connect(undefined, actions)(
  onlyUpdateForKeys(["track"])(Fretboard)
);
