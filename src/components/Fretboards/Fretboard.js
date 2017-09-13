import React from "react";
import { connect } from "react-redux";
import { View, Text, TouchableOpacity } from "react-native";
import { onlyUpdateForKeys } from "recompose";

import * as actions from "../../redux/actions";
import { PrimaryBlue, adjustedFontSize } from "../../design";
import FretboardLabels from "./FretboardFretLabels";
import FretboardBackground from "./FretboardFretBackground";
import FretboardFrets from "./FretboardFrets";
import FretboardStrings from "./FretboardStrings";
import SmartFretText from "../modals/SmartFretText";

const Fretboard = ({
  style,
  track,
  isPhone,
  isSmart,
  isHidingLabels,
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
    {isHidingLabels !== true && (
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text
          style={{
            fontSize: isPhone ? 13 : 17,
            marginBottom: 1
          }}
        >
          {isSmart ? " " : track.name || " "}
        </Text>

        <TouchableOpacity
          style={{
            marginRight: isSmart ? 10 : 0,
            marginBottom: isSmart ? 10 : 5
          }}
          onPress={() => {
            isSmart ? clearSmartTrack() : setSmartTrack(track);
          }}
        >
          <SmartFretText
            color={PrimaryBlue}
            size={isSmart ? isPhone ? 16 : 20 : isPhone ? 13 : 17}
          />
        </TouchableOpacity>
      </View>
    )}

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
  onlyUpdateForKeys(["track", "boardWidth"])(Fretboard)
);
