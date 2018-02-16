import React from "react";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
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
      tuningMode,
      onClose
    } = this.props;
    const { currentNote, currentIndex } = this.state;
    const isPhone = getIsPhone();
    setTuningParameters(track, currentNotation, tuningTrack.notes);
    const pitch = pitchForString(currentIndex);
    const fineTuning = tuningTrack.fineTuning || 8192;
    const isDigital = tuningMode === "digital";
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
              <Text style={styles.heading}>
                {track.shortName !== undefined
                  ? `Tuning for ${track.shortName}`
                  : "Tuning"}
              </Text>
              <View style={styles.barButtons}>
                <FlatButton
                  title={isDigital ? "Go to Audible" : "Go to Digital"}
                  style={{
                    color: PrimaryGold
                  }}
                  onPress={this.handleToggleTuningMode}
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

  handleNotePress = (currentNote, currentIndex) => {
    guitarController.clearAllGuitars();
    this.props.assignedGuitars.forEach(guitar =>
      guitarController.lightString(5 - currentIndex, guitar.id)
    );
    this.setState({ currentNote, currentIndex });
  };

  handleToggleTuningMode = () => {
    const mode = this.props.tuningMode === "digital" ? "audio" : "digital";
    this.props.setTuningMode(mode);
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
  tuningMode: PropTypes.string.isRequired,
  assignedGuitars: PropTypes.array.isRequired,
  origin: PropTypes.object.isRequired,
  currentNotation: PropTypes.string.isRequired,
  setTuningMode: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  const assignedGuitars = state
    .get("guitars")
    .toJS()
    .filter(item => item.track === ownProps.track.name)
    .map((item, index) => {
      const name =
        item.name !== undefined
          ? item.name.replace("'s Fretlight", "")
          : `Fretlight ${index + 1}`;
      return { ...item, name };
    });

  const tuningMode = state.get("tuningMode");
  return { assignedGuitars, tuningMode };
};

export default connect(mapStateToProps, actions)(
  onlyUpdateForKeys([
    "track",
    "tuningTrack",
    "tuningMode",
    "guitars",
    "assignedGuitars",
    "origin"
  ])(Tuner)
);
