import React from "react";
import PropTypes from "prop-types";
import { Modal, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../design";

const NotationsModal = ({ currentNotation, onSelect, onClose }) => (
  <Modal animationType="fade" transparent={true} onRequestClose={onClose}>
    <View style={styles.container}>
      <View style={styles.content}>
        <NotationsModalRow
          currentNotation={currentNotation}
          notation={"Flats"}
          onSelect={onSelect}
        />
        <NotationsModalRow
          currentNotation={currentNotation}
          notation={"Sharps"}
          onSelect={onSelect}
        />
        <NotationsModalRow
          currentNotation={currentNotation}
          notation={"None"}
          onSelect={onSelect}
        />
      </View>
    </View>
  </Modal>
);

const NotationsModalRow = ({ currentNotation, notation, onSelect }) => (
  <TouchableOpacity
    style={styles.row}
    onPress={() => {
      onSelect(notation);
    }}
  >
    <Text style={styles.label}>{currentNotation === notation ? "✔" : ""}</Text>
    <Text style={styles.button}>{notation}</Text>
  </TouchableOpacity>
);

NotationsModal.propTypes = {
  currentNotation: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(1,1,1,0.5)",
    width: "100%",
    height: "100%"
  },
  content: {
    width: 160,
    height: 120,
    backgroundColor: "#dddddd"
  },
  row: {
    flex: 1,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    alignItems: "flex-start",
    paddingHorizontal: 10
  },
  label: {
    fontSize: 18,
    width: 18,
    height: "100%",
    textAlignVertical: "center",
    marginRight: 10
  },
  button: {
    fontSize: 18,
    flex: 1,
    height: "100%",
    color: PrimaryBlue,
    textAlignVertical: "center"
  }
});

export default NotationsModal;
