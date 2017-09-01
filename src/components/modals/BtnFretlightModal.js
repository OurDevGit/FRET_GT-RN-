import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import PropTypes from "prop-types";

import ModalButton from "./ModalButton";
import Popover from "./Popover";
import { ModalType } from "./ModalType";

class BtnFretlightModal extends React.Component {
  state = {
    modalIsVisible: false
  };

  render() {
    return (
      <ModalButton onPress={this.displayModal}>
        <Text style={this.props.style}>
          Fretlight Status ({this.props.connectedDevices})
        </Text>

        {this.state.modalIsVisible &&
          <Popover
            type={ModalType.Center}
            style={{
              width: 500,
              height: 200,
              marginTop: -300,
              padding: 20,
              backgroundColor: "white"
            }}
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
                Fretlight Status
              </Text>

              <Text
                style={{
                  flex: 1,
                  fontSize: 18,
                  fontWeight: "400"
                }}
              >
                This feature is under development
              </Text>

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={{ flex: -1 }}
                  onPress={this.dismissModal}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      textAlign: "right"
                    }}
                  >
                    Ok
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Popover>}
      </ModalButton>
    );
  }

  displayModal = () => {
    this.setState({ modalIsVisible: true });
  };

  dismissModal = () => {
    this.setState({ modalIsVisible: false });
  };
}

BtnFretlightModal.propTypes = {
  style: PropTypes.object.isRequired,
  connectedDevices: PropTypes.number.isRequired
};

export default BtnFretlightModal;
