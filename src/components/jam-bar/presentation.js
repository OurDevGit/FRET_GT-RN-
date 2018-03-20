import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { pure } from "recompose";
import { getIsPhone, getIsVeryWide } from "../../utils";
import { Table } from "./utils";
import JamPicker from "./JamPicker";

let height = getIsPhone() ? (getIsVeryWide() ? 70 : 80) : 110;

const JamBarPresentation = ({
  currentType,
  currentKey,
  currentPosition,
  types,
  keys,
  positions,
  onSelection,
  onPreset
}) => {
  const insets = { top: 20, left: 20, bottom: 20, right: 20 };
  const source = require("./jambarBackground.png");

  return (
    <View style={styles.container}>
      <Image style={styles.background} source={source} edgeInsets={insets} />
      <View style={styles.ui}>
        <Text style={[styles.title, { flex: -1 }]}>
          JAM<Text style={[styles.title, { fontWeight: "400" }]}>Bar™</Text>
        </Text>

        <JamPicker
          type={Table.Type}
          items={types}
          height={height}
          selectedItem={currentType}
          onSelection={onSelection}
        />
        <JamPicker
          type={Table.Key}
          items={keys}
          height={height}
          selectedItem={currentKey}
          onSelection={onSelection}
        />
        <JamPicker
          type={Table.Position}
          items={positions}
          height={height}
          selectedItem={currentPosition}
          onSelection={onSelection}
        />

        <TouchableOpacity onPress={onPreset}>
          <Text style={styles.presetText}>Show Preset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: height
  },
  background: {
    position: "absolute",
    width: getIsPhone() ? "100%" : "99.4%",
    height: getIsPhone() ? height : height - 4,
    marginHorizontal: getIsPhone() ? "0%" : "0.3%",
    borderRadius: 6
  },
  ui: {
    flex: 1,
    flexDirection: "row",
    alignContent: "center",
    marginHorizontal: getIsPhone() ? 12 : 20
  },
  title: {
    fontSize: getIsPhone() ? 16 : 20,
    fontWeight: "800",
    textAlignVertical: "center"
  },
  presetText: {
    flex: 1,
    fontSize: getIsPhone() ? 13 : 17,
    color: "#51AB4B",
    textAlignVertical: "center"
  }
});

JamBarPresentation.propTypes = {
  currentType: PropTypes.string,
  currentKey: PropTypes.string,
  currentPosition: PropTypes.string,
  types: PropTypes.array,
  keys: PropTypes.array,
  positions: PropTypes.array,
  onSelection: PropTypes.func.isRequired,
  onPreset: PropTypes.func.isRequired
};

export default pure(JamBarPresentation);
