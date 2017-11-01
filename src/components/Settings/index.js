import React from "react";
import { View, Text, Modal, StyleSheet, ScrollView } from "react-native";
import { FlatButton } from "../Material";
import { Provider, connect } from "react-redux";
import * as actions from "../../redux/actions";
import { PrimaryGold, Danger } from "../../design";
import SwitchRow from "./SwitchRow";
//import NoteNamesRow from "./NoteNamesRow";

class Settings extends React.Component {
  render() {
    const { countDownIsOn, onClose } = this.props;
    console.log(countDownIsOn);
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

            <ScrollView>
              <SwitchRow
                label={"Countdown Timer"}
                isOn={countDownIsOn}
                onSwitch={this.handleToggleCountdown}
              />
              {/* <SwitchRow
                label={"Global Left-Hand Mode"}
                isOn={true}
                onSwitch={this.handleToggleLeftMode}
              />
              <SwitchRow
                label={"Fretlight Automatic Part Switching"}
                isOn={false}
                onSwitch={this.handleToggleAutoPartSwitching}
              /> */}
              {/* <NoteNamesRow
                label={"Note Names"}
                currentNoteName={"Flats"}
                onSelect={this.handleNoteNameUpdate}
              /> */}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  }

  handleToggleCountdown = () => {
    this.props.setCountdownState(!this.props.countdownTimerState);
  };

  handleToggleLeftMode = () => {
    this.props.setLeftHandState(!this.props.leftHandState);
  };

  handleToggleAutoPartSwitching = () => {
    this.props.setAutoPartSwitchingState(!this.props.autoPartSwitchingState);
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

const mapStateToProps = state => {
  console.log(state.get("countdownTimerState"));
  return {
    countdownTimerState: state.get("countdownTimerState"),
    leftHandState: state.get("leftHandState"),
    autoPartSwitchingState: state.get("autoPartSwitchingState")
  };
};

export default connect(mapStateToProps, actions)(Settings);
