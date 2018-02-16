import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import WheelView from "react-native-wheel";
import { Table } from "./utils";
import { getIsPhone } from "../../utils";

const JamPicker = ({ type, items, height, selectedItem, onSelection }) => {
  var selectedIndex = 0;
  var width = type === Table.Type ? 3 : 1;

  if (selectedItem !== undefined && items.length > 1) {
    selectedIndex = Math.max(0, items.indexOf(selectedItem));
  }

  return (
    <View style={[styles.container, { flex: width }]}>
      {items.length > 0 && (
        <WheelView
          style={[styles.picker, { height: height }]}
          itemsVisible={3}
          isLoop={false}
          textSize={getIsPhone() ? 14 : 18}
          velocityFling={20}
          values={items}
          rowHeight={getIsPhone() ? 40 : 32}
          selectedIndex={selectedIndex}
          onItemChange={index => onSelection(items[index], type)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 15,
    marginTop: 14
  },
  picker: {
    width: "100%"
  }
});

JamPicker.propTypes = {
  height: PropTypes.number.isRequired,
  type: PropTypes.string,
  selectedItem: PropTypes.string,
  items: PropTypes.array.isRequired,
  onSelection: PropTypes.func.isRequired
};

export default JamPicker;
