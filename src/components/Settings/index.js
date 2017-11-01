import React from "react";
import { View, Text, Modal, StyleSheet, ScrollView } from "react-native";
import { FlatButton } from "../Material";
import { PrimaryGold, Danger } from "../../design";
//import { SwitchRow } from "./SwitchRow";
//import { NoteNamesRow } from "./NoteNamesRow";

class Settings extends React.Component {
  render() {
    const { onClose } = this.props;
    return (
      <Modal animationType="fade" transparent={true} onRequestClose={onClose}>
        <View style={styles.container}>
          <View style={styles.content}>
            <Text>Settings 1!</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                borderTopColor: "lightgray",
                borderTopWidth: 1
              }}
            >
              <FlatButton
                title="Close"
                style={{ color: PrimaryGold }}
                onPress={onClose}
              />
            </View>

            {/* <ScrollView>
              <SwitchRow
                label={"Countdown Timer"}
                isOn={false}
                onSwitch={this.handleToggleCountdown}
              />
              <SwitchRow
                label={"Global Left-Hand Mode"}
                isOn={true}
                onSwitch={this.handleToggleLeftMode}
              />
              <SwitchRow
                label={"Fretlight Automatic Part Switching"}
                isOn={false}
                onSwitch={this.handleToggleAutoPartSwitching}
              />
              <NoteNamesRow
                label={"Note Names"}
                currentNoteName={"Flats"}
                onSelect={this.handleNoteNameUpdate}
              />
            </ScrollView> */}
          </View>
        </View>
      </Modal>
    );
  }

  handleToggleCountdown = () => {
    // toggle !bool
  };

  handleToggleLeftMode = () => {
    // toggle !bool
  };

  handleToggleAutoPartSwitching = () => {
    // toggle !bool
  };

  handleNoteNameUpdate = () => {
    // toggle !bool
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
  content: {
    width: "90%",
    height: "90%",
    backgroundColor: "#dddddd"
  }
});

export default Settings;
