import React from "react";
import { connect } from "react-redux";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";

const VideoMarkersTable = ({ markers, onMarkerPress }) => (
  <FlatList
    keyExtractor={(item, index) => index}
    data={markers}
    initialScrollIndex={0}
    initialNumToRender={markers.length < 20 ? markers.length : 20}
    getItemLayout={(item, index) => ({
      length: 40,
      offset: 40 * index,
      index
    })}
    renderItem={({ item, index }) => (
      <View style={{ width: "100%", height: 40, flexDirection: "row" }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            onMarkerPress(item.begin);
          }}
        >
          <Text>Chapter or marker</Text>
        </TouchableOpacity>
      </View>
    )}
  />
);

VideoMarkersTable.propTypes = {
  currentTime: PropTypes.number,
  markers: PropTypes.array,
  onMarkerPress: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  return {
    currentTime: state.get("time")
  };
};

export default connect(mapStateToProps)(VideoMarkersTable);
