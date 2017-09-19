import React from "react";
import { connect } from "react-redux";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import { chapterForTime, markerForTime } from "../../selectors";

const styles = StyleSheet.create({
  bold: {
    fontWeight: "800"
  },
  normal: {
    fontWeight: "200"
  }
});

const VideoMarkersTable = ({
  currentChapter,
  currentMarker,
  markers,
  onMarkerPress
}) => {
  return (
    <View
      style={{
        flex: 1,
        marginLeft: 40,
        justifyContent: "center",
        marginTop: 20
      }}
    >
      <Text
        style={{
          width: "100%",
          marginBottom: 15,
          textAlign: "center",
          fontWeight: "800"
        }}
      >
        Select Chapter
      </Text>
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
        renderItem={({ item, index }) => {
          const isActiveChapter =
            currentChapter !== undefined &&
            item.type === currentChapter.type &&
            item.name === currentChapter.name &&
            item.begin === currentChapter.begin &&
            item.end === currentChapter.end;

          const isActiveMarker =
            currentMarker !== undefined &&
            item.type === currentMarker.type &&
            item.name === currentMarker.name &&
            item.begin === currentMarker.begin &&
            item.end === currentMarker.end;
          return (
            <View style={{ flex: 1, height: 30, flexDirection: "row" }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  onMarkerPress(item.begin);
                }}
              >
                <View style={{ flex: 1, flexDirection: "row" }}>
                  {item.type === "marker" && (
                    <View style={{ width: 12, marginRight: 2 }}>
                      {isActiveMarker && <Text>✔︎</Text>}
                    </View>
                  )}
                  <Text style={isActiveChapter ? styles.bold : styles.normal}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

VideoMarkersTable.propTypes = {
  currentChapter: PropTypes.object,
  currentMarker: PropTypes.object,
  markers: PropTypes.array.isRequired,
  onMarkerPress: PropTypes.func.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    currentChapter: chapterForTime(state, ownProps),
    currentMarker: markerForTime(state, ownProps)
  };
};

export default connect(mapStateToProps)(VideoMarkersTable);
