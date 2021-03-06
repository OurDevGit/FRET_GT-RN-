import React from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList
} from "react-native";
import { getIsPhone } from "../../utils";

const ScrollingPopover = ({
  type,
  frame,
  items,
  selectedItem,
  onSelect,
  onDismiss
}) => {
  var selectedIndex = 0;

  if (selectedItem !== undefined && items.length > 12) {
    selectedIndex = Math.max(0, items.indexOf(selectedItem));
  }

  const itemStyle =
    type !== "Key" ? [styles.item] : [styles.item, styles.keyFontFamily];

  return (
    <TouchableOpacity
      style={styles.background}
      onPress={onDismiss}
      activeOpacity={1}
    >
      <View style={[styles.container, { ...frame }]}>
        <FlatList
          keyExtractor={(item, index) => `${index}`}
          data={items}
          initialScrollIndex={selectedIndex}
          getItemLayout={(data, index) => ({
            length: 45,
            offset: 45 * index,
            index
          })}
          ItemSeparatorComponent={() => {
            return (
              <View
                style={{
                  height: 1,
                  width: "100%",
                  backgroundColor: "#DDDDDD"
                }}
              />
            );
          }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: "row",
                  backgroundColor: "white"
                }}
                onPress={() => {
                  onSelect(item, type);
                }}
              >
                <Text style={styles.check} pointerEvents={"none"}>
                  {selectedItem === item ? "✔" : ""}
                </Text>

                <Text style={itemStyle} pointerEvents={"none"}>
                  {type !== "Key" ? item : item.replace("b", "♭")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  background: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(1,1,1,0.5)",
    width: "100%",
    height: "100%"
  },
  container: {
    position: "absolute",
    backgroundColor: "white"
  },
  row: {
    width: "100%",
    height: getIsPhone() ? 40 : 44,
    flexDirection: "row",
    paddingHorizontal: 10
  },
  check: {
    height: "100%",
    width: getIsPhone() ? 14 : 18,
    textAlignVertical: "center",
    fontSize: getIsPhone() ? 14 : 18,
    marginRight: 4
  },
  item: {
    height: "100%",
    textAlignVertical: "center",
    fontSize: getIsPhone() ? 14 : 18
  },
  keyFontFamily: { fontFamily: "DejaVuSansMono" }
});

ScrollingPopover.propTypes = {
  type: PropTypes.string,
  selectedItem: PropTypes.string,
  frame: PropTypes.object.isRequired,
  items: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  onDismiss: PropTypes.func.isRequired
};

export default ScrollingPopover;
