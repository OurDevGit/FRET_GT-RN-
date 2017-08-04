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
          height: 50,
          paddingVertical: 6,
          flexDirection: "row",
          justifyContent: "center"
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
            marginHorizontal: 0
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

              backgroundColor: trackIsVisible ? "white" : PrimaryGold
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: trackIsVisible ? PrimaryGold : "white",
                fontSize: 22
              }}
            >
              {track.get("name")}
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
      if (visibleTracks.count() < 4) {
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
