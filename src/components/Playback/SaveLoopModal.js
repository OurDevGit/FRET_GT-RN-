import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { PrimaryBlue } from "../../design";

const SaveLoopModal = ({
  isVisible,
  existingName,
  onTextChange,
  onCancel,
  onSave
}) => (
  <Modal
    animationType={"fade"}
    transparent={true}
    visible={isVisible}
    onRequestClose={() => {
      onCancel();
    }}
  >
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }}
    >
      <View
        style={{
          width: 500,
          height: 200,
          marginTop: -300,
          padding: 20,
          backgroundColor: "white"
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              flex: 1,
              fontSize: 22,
              fontWeight: "800"
            }}
          >
            {existingName ? "Rename Loop" : "Name Your Loop"}
          </Text>

          <Text
            style={{
              flex: 1,
              fontSize: 18,
              fontWeight: "400"
            }}
          >
            {existingName ? (
              `Please enter a new name for '${existingName}'`
            ) : (
              "Please enter a name for the new loop"
            )}
          </Text>

          <TextInput
            style={{
              flex: 1,
              fontSize: 22,
              fontWeight: "400"
            }}
            autoFocus={true}
            placeholder={"Loop name"}
            defaultValue={existingName}
            autoCapitalize={"words"}
            onChangeText={onTextChange}
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
              style={{ flex: -1 }}
              onPress={() => {
                onCancel();
              }}
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
              style={{ flex: -1, marginLeft: 50 }}
              onPress={() => {
                onSave();
              }}
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
      </View>
    </View>
  </Modal>
);

SaveLoopModal.propTypes = {
  isVisible: PropTypes.number.isRequired,
  existingName: PropTypes.object,
  currentLoop: PropTypes.object.isRequired,
  loopIsEnabled: PropTypes.bool.isRequired,
  onTextChange: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired
};

export default SaveLoopModal;
