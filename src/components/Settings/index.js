import React from "react";
import {
  View,
  Alert,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  NetInfo
} from "react-native";
import PropTypes from "prop-types";
import { FlatButton } from "../Material";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import { PrimaryGold } from "../../design";
import SwitchRow from "./SwitchRow";
import PdfViewer from "./PdfViewer";
import NotationsRow from "./NotationsRow";
import NotationsModal from "./NotationsModal";
import EmailSignupModal from "./EmailSignupModal";
import LabelRow from "./LabelRow";
import BirthdateRow from "./BirthdateRow";
import AboutModal from "./AboutModal";
import { BtnEmail, BtnEmailSignup, BtnContestSignup } from "../StyleKit";
import { sendSupportEmail } from "./email";
import { registerEmail, registerContestEmail } from "../../api";
import { getLegal, getHelp, getOverlay } from "../../models/Resources";
import {
  trackSettingsAbout,
  trackSettingsHelp,
  trackSettingsControls,
  trackSettingsCountdown,
  trackSettingsLefy,
  trackSettingsFretlightAutoPartSwitching,
  trackSettingsNoteNotation,
  trackEmailUpdateTap,
  trackEmailContestTap
} from "../../metrics";

class Settings extends React.Component {
  state = {
    isShowingAbout: false,
    isShowingNotationModal: false,
    isShowingEmailSignup: false,
    isShowingContestSignup: false,
    notationModalFrame: {},
    pdfFile: null
  };
  render() {
    const {
      countdownTimerState,
      leftHandState,
      autoPartSwitchingState,
      currentNotation,
      savedBirthdate,
      onPresentUserForm,
      onClose
    } = this.props;

    return (
      <Modal animationType="fade" transparent={true} onRequestClose={onClose}>
        <TouchableOpacity style={styles.container} onPress={onClose}>
          <TouchableOpacity activeOpacity={1} style={styles.content}>
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
              <LabelRow
                label={"About this App"}
                onPress={this.handleAboutPress}
              />
              <LabelRow label={"Help"} onPress={this.handleHelpPress} />
              <LabelRow
                label={"Controls Overlay"}
                onPress={this.handleOverlayPress}
              />
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

              <LabelRow
                label={"Email Guitar Tunes Support/Feeback"}
                onPress={sendSupportEmail}
              >
                <BtnEmail style={{ width: 50, height: 50 }} color={"#333333"} />
              </LabelRow>

              <LabelRow
                label={"Keep me up to date about Guitar Tunes!"}
                onPress={this.handleToggleEmailSignupModal}
              >
                <BtnEmailSignup
                  style={{ width: 50, height: 50 }}
                  color={"#333333"}
                />
              </LabelRow>

              <LabelRow
                label={"Enter Monthly Contest"}
                onPress={this.handleToggleContestSignupModal}
              >
                <BtnContestSignup
                  style={{ width: 50, height: 50 }}
                  color={"#333333"}
                />
              </LabelRow>

              <BirthdateRow
                savedBirthdate={savedBirthdate}
                onPress={onPresentUserForm}
              />

              <LabelRow
                color="blue"
                label={"Guitar Tunes Legal Information"}
                onPress={this.handleLegalPress}
              />

              <LabelRow
                color="red"
                label={"Archive All Media"}
                onPress={this.handleArchiveAlllPress}
              />

              {this.state.isShowingEmailSignup && (
                <EmailSignupModal
                  title={"Register for Updates"}
                  message={
                    "Enter your email address to stay up to date on Guitar Tunes"
                  }
                  onCancel={this.handleToggleEmailSignupModal}
                  onComplete={this.handleEmailSignup}
                />
              )}

              {this.state.isShowingContestSignup && (
                <EmailSignupModal
                  title={"Enter Monthly Contest"}
                  message={
                    "Enter your email address to be entered into our monthly giveaway. One entry per person. No purchase necessary. See Contest details at www.guitartunes.com"
                  }
                  onCancel={this.handleToggleContestSignupModal}
                  onComplete={this.handleContestSignup}
                />
              )}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>

        {this.state.isShowingAbout && (
          <AboutModal onClose={this.handleAboutPress} />
        )}

        <Modal
          visible={this.state.pdfFile !== null}
          onRequestClose={() => {
            this.setState({ pdfFile: null });
          }}
        >
          <PdfViewer
            filePath={this.state.pdfFile}
            onClose={() => this.setState({ pdfFile: null })}
          />
        </Modal>
      </Modal>
    );
  }

  handleAboutPress = () => {
    this.setState({ isShowingAbout: !this.state.isShowingAbout });
    trackSettingsAbout();
  };

  handleHelpPress = async () => {
    const pdfFile = await getHelp();
    getHelp().then(helpFile => {
      this.setState({ pdfFile: helpFile });
    });
    this.setState({ pdfFile });
    trackSettingsHelp();
  };

  handleOverlayPress = async () => {
    const pdfFile = await getOverlay();
    this.setState({ pdfFile });
    trackSettingsControls();
  };

  handleToggleCountdown = () => {
    trackSettingsCountdown(!this.props.countdownTimerState);
    this.props.setCountdownTimerState(!this.props.countdownTimerState);
  };

  handleToggleLeftMode = () => {
    trackSettingsLefy(!this.props.leftHandState);
    this.props.setLeftHandState(!this.props.leftHandState);
  };

  handleToggleAutoPartSwitching = () => {
    trackSettingsFretlightAutoPartSwitching(!this.props.autoPartSwitchingState);
    this.props.setAutoPartSwitchingState(!this.props.autoPartSwitchingState);
  };

  handleToggleNotationModal = frame => {
    const isShowingNotationModal = !this.state.isShowingNotationModal;
    this.setState({ isShowingNotationModal, notationModalFrame: frame });
  };

  handleNotationSelect = notation => {
    this.props.setCurrentNotation(notation);
    trackSettingsNoteNotation(notation);
    this.setState({ isShowingNotationModal: false });
  };

  handleToggleEmailSignupModal = async () => {
    let isShowingEmailSignup = !this.state.isShowingEmailSignup;
    if (this.state.isShowingEmailSignup) {
      this.setState({ isShowingEmailSignup });
    } else {
      const isConnected = await NetInfo.isConnected.fetch();
      if (isConnected) {
        trackEmailUpdateTap();
        this.setState({ isShowingEmailSignup });
      } else {
        Alert.alert(
          "No Internet Connection",
          "It appears you're not connected to the internet. Please check your connection and try again"
        );
      }
    }
  };

  handleToggleContestSignupModal = async () => {
    let isShowingContestSignup = !this.state.isShowingContestSignup;
    if (this.state.isShowingContestSignup) {
      this.setState({ isShowingContestSignup });
    } else {
      const isConnected = await NetInfo.isConnected.fetch();
      if (isConnected) {
        trackEmailContestTap();
        this.setState({ isShowingContestSignup });
      } else {
        Alert.alert(
          "No Internet Connection",
          "It appears you're not connected to the internet. Please check your connection and try again"
        );
      }
    }
  };

  handleEmailSignup = async email => {
    const isConnected = await NetInfo.isConnected.fetch();
    if (isConnected) {
      let response = await registerEmail(email);
      this.setState({ isShowingEmailSignup: false });

      if (response.status === 200) {
        Alert.alert("Thanks! We'll keep you posted on new Songs & Features!");
      } else {
        Alert.alert("There was a problem registering. Please try again later.");
      }
    } else {
      Alert.alert(
        "No Internet Connection",
        "It appears you're not connected to the internet. Please check your connection and try again"
      );
    }
  };

  handleContestSignup = async email => {
    const isConnected = await NetInfo.isConnected.fetch();
    if (isConnected) {
      let response = await registerContestEmail(email);
      this.setState({ isShowingContestSignup: false });

      if (response.status === 200) {
        Alert.alert(
          "You're entered, good luck! Winner(s) will be contacted by email only. See Contest rules at www.guitartunes.com!"
        );
      } else {
        Alert.alert("There was a problem entering. Please try again later.");
      }
    } else {
      Alert.alert(
        "No Internet Connection",
        "It appears you're not connected to the internet. Please check your connection and try again"
      );
    }
  };

  handleLegalPress = async () => {
    const pdfFile = await getLegal();
    this.setState({ pdfFile });
  };

  handleArchiveAlllPress = () => {
    Alert.alert("Confirm", "Are you sure you want to remove all saved media?", [
      { text: "Cancel", onPress: () => console.debug("Cancel") },
      { text: "Archive", onPress: this.doArchiveAll }
    ]);
  };

  doArchiveAll = () => {
    console.debug("Archive All");
    this.props.deleteAllMedia();
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

Settings.propTypes = {
  countdownTimerState: PropTypes.bool.isRequired,
  leftHandState: PropTypes.bool.isRequired,
  autoPartSwitchingState: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  savedBirthdate: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  setCountdownTimerState: PropTypes.func.isRequired,
  setLeftHandState: PropTypes.func.isRequired,
  setAutoPartSwitchingState: PropTypes.func.isRequired,
  setCurrentNotation: PropTypes.func.isRequired,
  onPresentUserForm: PropTypes.func.isRequired,
  deleteAllMedia: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    countdownTimerState: state.get("countdownTimerState"),
    leftHandState: state.get("leftHandState"),
    autoPartSwitchingState: state.get("autoPartSwitchingState"),
    currentNotation: state.get("currentNotation")
  };
};

export default connect(mapStateToProps, actions)(Settings);
