import React from "react";
import { View, FlatList } from "react-native";
import PropTypes from "prop-types";
import GuitarRow from "./GuitarRow";

const GuitarTable = ({ guitars }) => {
  return (
    <FlatList
      keyExtractor={(item, index) => index}
      data={guitars}
      initialScrollIndex={currentIndex}
      initialNumToRender={10}
      getItemLayout={(item, index) => ({
        length: 40,
        offset: 40 * index,
        index
      })}
      ItemSeparatorComponent={this.separator}
      renderItem={({ item, index }) => <GuitarRow />}
    />
  );
};

export default GuitarTable;
