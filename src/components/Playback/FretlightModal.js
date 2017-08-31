import React, { Component } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { PrimaryBlue } from "../../design";
import { BtnLoopDelete } from "../StyleKit";

const keyExtractor = (item, index) => index;

const separator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#DDDDDD"
      }}
    />
  );
};

const FretlightStatusModal = ({ isVisible, connectedDevices, onDismiss }) =>
  <Modal
    animationType={"fade"}
    transparent={true}
    visible={isVisible}
    onRequestClose={() => {
      onDismiss();
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
            Fretlight Status
          </Text>

          <Text
            style={{
              flex: 1,
              fontSize: 18,
              fontWeight: "400"
            }}
          >
            This features is under development
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
              onPress={() => {
                onDismiss();
              }}
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
      </View>
    </View>
  </Modal>;

export default FretlightStatusModal;
