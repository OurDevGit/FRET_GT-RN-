import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import PropTypes from "prop-types";

import ModalButton from "./ModalButton";
import Popover from "./Popover";
import { ModalType } from "./ModalType";
import { PrimaryBlue } from "../../design";
import SmartFretText from "./SmartFretText";

class BtnSmartFretModal extends React.Component {
  state = {
    modalIsVisible: false
  };

  render() {
    return (
      <ModalButton onPress={this.displayModal}>
        <SmartFretText color={PrimaryBlue} size={18} />

        {this.state.modalIsVisible &&
          <Popover
            type={ModalType.Full}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "white"
            }}
            isVisible={this.state.modalIsVisible}
            onDismiss={this.dismissModal}
          >
            <View
              style={{
                flex: 1
              }}
            >
              <View
                style={{
                  width: "100%",
                  height: 50,
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: "black"
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: -1,
                    position: "absolute",
                    top: 4,
                    left: 4
                  }}
                  onPress={this.dismissModal}
                >
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "400",
                      textAlign: "left",
                      color: "white"
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>

                <SmartFretText
                  color={"white"}
                  size={20}
                  trackName={this.props.track.name}
                />
              </View>

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

BtnSmartFretModal.propTypes = {
  track: PropTypes.object.isRequired
};

export default BtnSmartFretModal;
