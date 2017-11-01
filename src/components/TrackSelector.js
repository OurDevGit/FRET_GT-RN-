import React, { Component } from "react";
import { connect } from "react-redux";
import { View, Text, TouchableOpacity, Button } from "react-native";
import { List } from "immutable";

import * as actions from "../redux/actions";
import { PrimaryGold } from "../design";

class TrackSelector extends Component {
  render() {
    return (
      <View
        style={{
          width: "100%",
          height: 45,
          paddingVertical: 6,
          flexDirection: "row",
          justifyContent: "center",
          borderTopWidth: 1,
          borderTopColor: "#555555"
        }}
      >
        {this.buttons()}
      </View>
    );
  }

  buttons() {
    const { tracks, visibleTracks } = this.props;
    return tracks.map(track => {
      const trackIsVisible = visibleTracks.includes(track);
      return (
        <TouchableOpacity
          key={track.get("name")}
          style={{
            flex: 1,
            paddingHorizontal: 10,
            marginHorizontal: 0,
            maxWidth: "40%"
          }}
          onPress={() => {
            this.handleClick(track);
          }}
        >
          <View
            style={{
              paddingTop: 1,
              paddingBottom: 2,
              paddingHorizontal: 40,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: PrimaryGold,

              backgroundColor: trackIsVisible ? PrimaryGold : "white"
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode={"tail"}
              style={{
                textAlign: "center",
                color: trackIsVisible ? "white" : PrimaryGold,
                fontSize: 16
              }}
            >
              {track.get("shortName")}
            </Text>
          </View>
        </TouchableOpacity>
      );
    });
  }

  handleClick(track) {
    const { tracks, visibleTracks, updateVisibleTracks } = this.props;
    const visibleIndex = visibleTracks.indexOf(track);

    if (visibleIndex > -1) {
      if (visibleTracks.count() > 1) {
        const tracks = visibleTracks.remove(visibleIndex);
        updateVisibleTracks(tracks);
      }
    } else {
      if (visibleTracks.count() < this.props.max) {
        const newVisible = visibleTracks.push(track);
        const newTracks = tracks.filter(tr => newVisible.includes(tr));
        updateVisibleTracks(newTracks);
      }
    }
  }
}

const mapStateToProps = state => {
  return {
    tracks: state.get("guitarTracks"),
    visibleTracks: state.get("visibleTracks")
  };
};

export default connect(mapStateToProps, actions)(TrackSelector);
