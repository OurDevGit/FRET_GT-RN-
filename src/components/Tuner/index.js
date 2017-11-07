import React from "react";
import {
  View,
  Modal,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import { FlatButton } from "../Material";
import { PrimaryGold } from "../../design";
import DigitalTuner from "./DigitalTuner";
import AudioTuner from "./AudioTuner";
import Note from "./NoteButton";
import { getTuningNotation } from "../Fretboards/notations";

class Tuner extends React.Component {
  state = {
    isDigital: true
  };
  render() {
    const { track, origin, onClose } = this.props;
    const { isDigital } = this.state;
    const isPhone = Dimensions.get("window").height < 500;
    const contentStyle = isPhone
      ? styles.contentFull
      : [styles.contentOrigin, { top: origin.y - 520, left: origin.x - 900 }];

    return (
      <Modal animationType="fade" transparent={true} onRequestClose={onClose}>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.container}
          onPress={onClose}
        >
          <TouchableOpacity activeOpacity={1} style={contentStyle}>
            <View style={styles.titlebar}>
              <Text style={styles.heading}>{`Tuning for ${track.name}`}</Text>
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
            <Text style={styles.label}>Tuning Info Here</Text>

            <View style={{ flex: 1 }}>
              {isDigital ? (
                <DigitalTuner currentNote={"E"} />
              ) : (
                <AudioTuner currentNote={"E"} />
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

  noteButtons = () => {
    var buttons = [];
    const { track, currentNotation } = this.props;

    for (var i = 0; i < 6; i++) {
      if (i < 4 || !track.isBass) {
        const note = getTuningNotation(5 - i, currentNotation);
        buttons.push(
          <Note key={i} note={note} onPress={this.handleNotePress} />
        );
      }
    }
    return buttons;
  };

  handleToggleMode = () => {
    this.setState({ isDigital: !this.state.isDigital });
  };

  handleNotePress = note => {
    console.log(note);
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
    width: "90%",
    height: "90%",
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
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: "white",
    marginHorizontal: 4,
    height: 50,
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
    height: 60,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8
  },
  noteRow: {
    width: "100%",
    maxWidth: 500,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

Tuner.propTypes = {
  track: PropTypes.object.isRequired,
  origin: PropTypes.object.isRequired,
  currentNotation: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Tuner;
