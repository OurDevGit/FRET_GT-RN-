import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";
import { FlatButton } from "../Material";
import { Provider, connect } from "react-redux";
import * as actions from "../../redux/actions";
import { PrimaryGold, Danger } from "../../design";
import SwitchRow from "./SwitchRow";
import NotationsRow from "./NotationsRow";
import NotationsModal from "./NotationsModal";

class Settings extends React.Component {
  state = {
    isShowingNotationModal: false,
    notationModalFrame: {}
  };
  render() {
    const {
      countdownTimerState,
      leftHandState,
      autoPartSwitchingState,
      currentNotation,
      onClose
    } = this.props;
    console.log(countdownTimerState, leftHandState, autoPartSwitchingState);
    return (
      <Modal animationType="fade" transparent={true} onRequestClose={onClose}>
        <TouchableOpacity style={styles.container} onPress={onClose}>
          <View style={styles.content}>
            <View
              style={{
                width: "100%",
                height: 50,
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomColor: "lightgray",
                borderBottomWidth: 1
              }}
            >
              <Text style={styles.heading}>Settings</Text>
              <View>
                <FlatButton
                  title="Close"
                  style={{
                    color: PrimaryGold
                  }}
                  onPress={onClose}
                />
              </View>
            </View>

            <ScrollView style={styles.scrollView}>
              <SwitchRow
                label={"Countdown Timer"}
                isOn={countdownTimerState}
                onSwitch={this.handleToggleCountdown}
              />
              <SwitchRow
                label={"Global Left-Hand Mode"}
                isOn={leftHandState}
                onSwitch={this.handleToggleLeftMode}
              />
              <SwitchRow
                label={"Fretlight Automatic Part Switching"}
                isOn={autoPartSwitchingState}
                onSwitch={this.handleToggleAutoPartSwitching}
              />
              <NotationsRow
                label={"Note Names"}
                currentNoteName={currentNotation}
                onPress={this.handleToggleNotationModal}
              />

              {this.state.isShowingNotationModal && (
                <NotationsModal
                  origin={this.state.notationModalFrame}
                  currentNotation={currentNotation}
                  onSelect={this.handleNotationSelect}
                  onClose={this.handleToggleNotationModal}
                />
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  handleToggleCountdown = () => {
    this.props.setCountdownTimerState(!this.props.countdownTimerState);
  };

  handleToggleLeftMode = () => {
    this.props.setLeftHandState(!this.props.leftHandState);
  };

  handleToggleAutoPartSwitching = () => {
    this.props.setAutoPartSwitchingState(!this.props.autoPartSwitchingState);
  };

  handleToggleNotationModal = frame => {
    const isShowingNotationModal = !this.state.isShowingNotationModal;
    this.setState({ isShowingNotationModal, notationModalFrame: frame });
  };

  handleNotationSelect = notation => {
    this.props.setCurrentNotation(notation);
    this.setState({ isShowingNotationModal: false });
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
    backgroundColor: "#dddddd",
    padding: 15
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginHorizontal: 4,
    height: 50,
    textAlignVertical: "center",
    marginLeft: 10
  },
  scrollView: {}
});

const mapStateToProps = state => {
  return {
    countdownTimerState: state.get("countdownTimerState"),
    leftHandState: state.get("leftHandState"),
    autoPartSwitchingState: state.get("autoPartSwitchingState"),
    currentNotation: state.get("currentNotation")
  };
};

export default connect(mapStateToProps, actions)(Settings);
