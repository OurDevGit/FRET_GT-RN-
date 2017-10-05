import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import Dimensions from "Dimensions";
import PropTypes from "prop-types";

import ModalButton from "./ModalButton";
import Popover from "./Popover";
import { PrimaryBlue } from "../../design";
import { ModalType } from "./ModalType";
import { BtnPhoneBluetooth } from "../StyleKit";

class BtnFretlightModal extends React.Component {
  state = {
    modalIsVisible: false
  };

  render() {
    const { isPhone } = this.props;
    const top = isPhone ? 0 : -300;
    return (
      <ModalButton onPress={this.displayModal}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginHorizontal: 6,
            paddingTop: 0,
            paddingRight: 8,
            paddingHorizontal: 0,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: PrimaryBlue,
            borderRadius: 6
          }}
        >
          {isPhone ? (
            <BtnPhoneBluetooth
              style={{ width: 36, height: 36 }}
              color={"#FFFFFF"}
            />
          ) : (
            <Text
              style={{
                marginTop: -4,
                marginLeft: 8,
                fontSize: 20,
                color: "white",
                lineHeight: 22
              }}
            >
              Fretlight Status
            </Text>
          )}
          <Text
            style={{
              marginTop: -4,
              fontSize: 20,
              color: "white",
              lineHeight: 22
            }}
          >
            ({this.props.devices})
          </Text>
        </View>

        {this.state.modalIsVisible && (
          <Popover
            type={ModalType.Center}
            style={{
              width: 500,
              height: 200,
              marginTop: top,
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
          </Popover>
        )}
      </ModalButton>
    );
  }

  displayModal = () => {
    if (this.props.onForceControlsVisible !== undefined) {
      this.props.onForceControlsVisible(true);
    }

    this.setState({ modalIsVisible: true });
  };

  dismissModal = () => {
    if (this.props.onForceControlsVisible !== undefined) {
      this.props.onForceControlsVisible(false);
    }
    this.setState({ modalIsVisible: false });
  };
}

BtnFretlightModal.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  devices: PropTypes.number.isRequired,
  onForceControlsVisible: PropTypes.func
};

export default BtnFretlightModal;
