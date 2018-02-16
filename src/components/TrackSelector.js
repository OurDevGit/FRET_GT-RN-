import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import * as actions from "../redux/actions";
import { PrimaryGold } from "../design";
import { clearCurrentPattern } from "../midi-store";
import { addActivePart, removeActivePart, updateGuitarPart } from "../metrics";

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
    const { tracks, visibleTracks, isShowingJamBar } = this.props;
    return tracks.map(track => {
      const trackIsVisible = visibleTracks.includes(track) && !isShowingJamBar;
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
    const {
      tracks,
      visibleTracks,
      isShowingJamBar,
      updateVisibleTracks,
      setJamBar
    } = this.props;
    const visibleIndex = visibleTracks.indexOf(track);

    if (visibleIndex > -1) {
      if (visibleTracks.count() > 1) {
        const tracks = visibleTracks.remove(visibleIndex);
        updateVisibleTracks(tracks);
        this.checkChangeFretlightAssignments(tracks.last().toJS());
        removeActivePart(track.get("name"));
      } else if (isShowingJamBar) {
        clearCurrentPattern();
        setJamBar(false);
        this.checkChangeFretlightAssignments(tracks.first().toJS(), true);
      }
    } else {
      if (visibleTracks.count() < this.props.max) {
        const newVisible = visibleTracks.push(track);
        const newTracks = tracks.filter(tr => newVisible.includes(tr));
        updateVisibleTracks(newTracks);
        this.checkChangeFretlightAssignments(newTracks.last().toJS());
        addActivePart(track.get("name"));
      }
    }
  }

  checkChangeFretlightAssignments(track, shouldForce = false) {
    if (this.props.autoPartSwitchingState || shouldForce) {
      this.props.guitars.forEach(guitar => {
        this.props.updateGuitarSetting(guitar.set("track", track.name));
        updateGuitarPart(guitar.id, track.name);
      });
    }
  }
}

TrackSelector.propTypes = {
  max: PropTypes.number.isRequired,
  tracks: PropTypes.object.isRequired,
  visibleTracks: PropTypes.object.isRequired,
  guitars: PropTypes.object.isRequired,
  isShowingJamBar: PropTypes.bool.isRequired,
  autoPartSwitchingState: PropTypes.bool.isRequired,
  updateGuitarSetting: PropTypes.func.isRequired,
  updateVisibleTracks: PropTypes.func.isRequired,
  setJamBar: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    tracks: state.get("guitarTracks"),
    visibleTracks: state.get("visibleTracks"),
    guitars: state.get("guitars"),
    isShowingJamBar: state.get("isShowingJamBar"),
    autoPartSwitchingState: state.get("autoPartSwitchingState")
  };
};

export default connect(mapStateToProps, actions)(TrackSelector);
