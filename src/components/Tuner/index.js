import React from "react";
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  NativeModules,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import { onlyUpdateForKeys } from "recompose";
import Dimensions from "Dimensions";
import { FlatButton } from "../Material";
import { PrimaryGold } from "../../design";
import DigitalTuner from "./DigitalTuner";
import AudioTuner from "./AudioTuner";
import Note from "./NoteButton";
import { setTuningParameters, pitchForString } from "./TuningPitch";
import { getIsPhone } from "../../utils";

var guitarController = NativeModules.GTGuitarController;

class Tuner extends React.Component {
  state = {
    currentIndex: -1,
    currentNote: ""
  };

  render() {
    const {
      track,
      origin,
      currentNotation,
      tuningTrack,
      isDigital,
      onClose
    } = this.props;
    const { currentNote, currentIndex } = this.state;
    const isPhone = getIsPhone();
    setTuningParameters(track, currentNotation, tuningTrack.notes);
    const pitch = pitchForString(currentIndex);
    const fineTuning = tuningTrack.fineTuning || 8192;

    var tuningInfo = "Standard Tuning";
    if (track.tuning !== undefined) {
      tuningInfo = `Custom Tuning: ${track.tuning}`;
    } else if (track.fullTuning !== undefined) {
      tuningInfo = `Custom Tuning: ${track.fullTuning}`;
    }

    const top = Math.max(-170, origin.y - 520);
    const left = origin.x - 940;

    const contentStyle = isPhone
      ? styles.contentFull
      : [styles.contentOrigin, { top, left }];

    return (
      <Modal animationType="fade" transparent={true} onRequestClose={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.container}
          onPress={onClose}
        >
          <TouchableOpacity activeOpacity={1} style={contentStyle}>
            <View style={styles.titlebar}>
              <Text
                style={styles.heading}
              >{`Tuning for ${track.shortName}`}</Text>
              <View style={styles.barButtons}>
                <FlatButton
                  title={isDigital ? "Go to Audible" : "Go to Digital"}
                  style={{
                    color: PrimaryGold
                  }}
                  onPress={this.handleToggleMode}
                />

                <FlatButton
                  title="Close"
                  style={{
                    color: PrimaryGold
                  }}
                  onPress={onClose}
                />
              </View>
            </View>
            <Text style={styles.label}>{tuningInfo}</Text>

            <View style={{ flex: 1 }}>
              {isDigital ? (
                <DigitalTuner currentPitch={pitch} fineTuning={fineTuning} />
              ) : (
                <AudioTuner
                  currentPitch={pitch}
                  fineTuning={fineTuning}
                  currentNote={currentNote}
                  currentIndex={currentIndex}
                  isBass={track.isBass}
                />
              )}
              <View style={styles.noteContainer}>
                <View style={styles.noteRow}>{this.noteButtons()}</View>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    );
  }

  componentDidMount = () => {
    guitarController.clearAllGuitars();
    this.props.assignedGuitars.forEach(guitar =>
      guitarController.lightString(5, guitar.id)
    );
  };

  componentWillUnmount = () => {
    guitarController.clearAllGuitars();
  };

  noteButtons = () => {
    var buttons = [];
    const { track } = this.props;

    for (var i = 0; i < 6; i++) {
      if (i < 4 || !track.isBass) {
        const pitch = pitchForString(i);
        buttons.push(
          <Note
            key={i}
            index={i}
            note={pitch.note}
            currentIndex={this.state.currentIndex}
            onPress={this.handleNotePress}
          />
        );
      }
    }
    return buttons;
  };

  handleToggleMode = () => {
    this.props.onToggleTuningMode();
  };

  handleNotePress = (currentNote, currentIndex) => {
    guitarController.clearAllGuitars();
    this.props.assignedGuitars.forEach(guitar =>
      guitarController.lightString(5 - currentIndex, guitar.id)
    );
    this.setState({ currentNote, currentIndex });
  };
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(1,1,1,0.5)",
    width: "100%",
    height: "100%"
  },
  contentFull: {
    width: "100%",
    height: "100%",
    backgroundColor: "#222222",
    padding: 15
  },
  contentOrigin: {
    width: 600,
    height: 500,
    backgroundColor: "#222222",
    padding: 15
  },
  titlebar: {
    width: "100%",
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginHorizontal: 4,
    height: 40,
    textAlignVertical: "center",
    marginLeft: 10
  },
  barButtons: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  label: {
    height: 24,
    textAlign: "center",
    fontSize: 18,
    marginLeft: 8,
    color: "white",
    marginVertical: 6
  },
  noteContainer: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12
  },
  noteRow: {
    width: "100%",
    maxWidth: 500,
    height: 44,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

Tuner.propTypes = {
  track: PropTypes.object.isRequired,
  tuningTrack: PropTypes.object,
  isDigital: PropTypes.bool.isRequired,
  assignedGuitars: PropTypes.array.isRequired,
  origin: PropTypes.object.isRequired,
  currentNotation: PropTypes.string.isRequired,
  onToggleTuningMode: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default onlyUpdateForKeys([
  "track",
  "tuningTrack",
  "guitars",
  "assignedGuitars",
  "origin"
])(Tuner);
