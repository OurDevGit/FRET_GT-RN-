import React, { Component } from "react";
import { Modal, TouchableOpacity, View } from "react-native";

const Popover = ({ children, isVisible, onDismiss }) =>
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
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          width: "100%",
          height: "100%"
        }}
        onPress={() => {
          onDismiss();
        }}
      />
      {children}
    </View>
  </Modal>;

export default Popover;
