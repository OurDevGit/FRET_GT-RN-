import React from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { FlatButton } from "../Material";
import { PrimaryGold, Danger } from "../../design";

const Settings = () => (
  <Modal
    animationType="fade"
    transparent={true}
    onRequestClose={() => console.debug("close!")}
  >
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
            onPress={() => console.debug("close!")}
          />
        </View>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(1,1,1,0.5)",
    width: "100%",
    height: "100%"
  },
  content: {
    maxWidth: 320,
    maxHeight: 240,
    backgroundColor: "#dddddd"
  }
});

export default Settings;
