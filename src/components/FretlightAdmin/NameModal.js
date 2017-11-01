import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView
} from "react-native";
import PropTypes from "prop-types";

import ModalButton from "../modals/ModalButton";
import Popover from "../modals/Popover";
import { ModalType } from "../modals/ModalType";
import { nameModalStyles } from "./styles";

class NameModal extends React.Component {
  state = {
    modalIsVisible: false,
    inputText: ""
  };

  render() {
    const { guitar, guitars, isPhone } = this.props;

    return (
      <ModalButton onPress={this.displayModal}>
        <Text style={nameModalStyles.button}>
          {guitar.name === undefined
            ? "Name your Fretlight"
            : `${guitar.name}'s Fretlight`}
        </Text>

        {this.state.modalIsVisible && (
          <Popover
            type={ModalType.Center}
            style={nameModalStyles.popover}
            isVisible={this.state.modalIsVisible}
            onDismiss={this.dismissModal}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 22,
                  fontWeight: "800"
                }}
              >
                Rename Fretlight
              </Text>

              <Text
                style={{
                  flex: 1,
                  fontSize: 18,
                  fontWeight: "400"
                }}
              >
                {guitar.name === undefined
                  ? "Please enter a name for the guitar"
                  : `Please enter a new name for '${guitar.name}''s Fretlight`}
              </Text>

              <TextInput
                style={{
                  flex: 1,
                  fontSize: 22,
                  fontWeight: "400"
                }}
                autoFocus={!isPhone}
                placeholder={"Guitar name"}
                defaultValue={guitar.name}
                autoCapitalize={"words"}
                onChangeText={this.handleTextInput}
              />

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={{ flex: -1, height: 50 }}
                  onPress={this.dismissModal}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      textAlign: "right"
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: -1, marginLeft: 50, height: 50 }}
                  onPress={this.saveName}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "200",
                      textAlign: "right"
                    }}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Popover>
        )}
      </ModalButton>
    );
  }

  displayModal = () => {
    if (this.props.onForceControlsVisible !== undefined) {
      this.props.onForceControlsVisible(true);
    }
    this.props.onToggleScanning(false);
    this.setState({ modalIsVisible: true });
  };

  dismissModal = () => {
    if (this.props.onForceControlsVisible !== undefined) {
      this.props.onForceControlsVisible(false);
    }
    this.props.onToggleScanning(true);
    this.setState({ modalIsVisible: false });
  };

  handleTextInput = text => {
    this.setState({ inputText: text });
  };

  saveName = async () => {
    const { guitar, guitars } = this.props;
    const name = this.state.inputText;
    if (name === "") {
      Alert.alert(
        "Guitar Name",
        "Please enter a name with at least 1 character"
      );
    } else {
      const index = guitars.findIndex(item => item.name === name);
      if (index > -1) {
        Alert.alert("Existing Name", "Please give your guitar another name");
      } else {
        this.props.onRename(name, guitar);
        this.dismissModal();
      }
    }
  };
}

NameModal.propTypes = {
  guitar: PropTypes.object.isRequired,
  guitars: PropTypes.array.isRequired,
  isPhone: PropTypes.bool.isRequired,
  onRename: PropTypes.func.isRequired
};

export default NameModal;
