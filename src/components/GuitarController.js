import React, { Component } from "react";
import { View, NativeModules, DeviceEventEmitter } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import { Map } from "immutable";
import { getGuitar, setGuitar } from "../models/Guitars";
import {
  subscribeToTimeUpdates,
  unsubscribeToTimeUpdates,
  getCurrentTime
} from "../time-store";
import { notesForTrackAtTime } from "../midi-store";
import { addGuitar, removeGuitar } from "../metrics";
import { isEqual } from "lodash";

// This component manages the connection and notes for playback
// Management of device profiles are handled in FretlightModal.js

var guitarController = NativeModules.GTGuitarController;

class GuitarController extends Component {
  constructor(props) {
    super(props);
    this.currentTime = 0;
    this.isMounted_ = false;
    this.prevOn = {};
    this.prevCurrentNotes = {};
    this.hasCleared = false;
  }

  state = {
    isIdentifying: false
  };

  render() {
    return <View style={{ position: "absolute" }} />;
  }

  // listening for updates from GTGuitarController.java
  componentWillMount() {
    DeviceEventEmitter.addListener("GUITAR_CONNECTED", id => {
      this.handleGuitarConnected(id);
    });

    DeviceEventEmitter.addListener("GUITAR_DISCONNECTED", id => {
      this.handleGuitarDisconnected(id);
    });

    DeviceEventEmitter.addListener("GUITAR_LOST", id => {
      this.handleGuitarLost(id);
    });
  }

  componentDidMount() {
    this.isMounted_ = true;
    guitarController.registerEmitter();
    subscribeToTimeUpdates(this.handleTimeUpdate);
    requestAnimationFrame(this.handleAnimationFrame);
  }

  componentWillUnmount() {
    this.isMounted_ = false;
    unsubscribeToTimeUpdates(this.handleTimeUpdate);
  }

  componentDidUpdate(prevProps) {
    if (this.props.tracks !== undefined && prevProps.tracks !== undefined) {
      if (this.props.assignments !== {}) {
        if (
          !this.props.tracks.equals(prevProps.tracks) ||
          !this.isEqual(this.props.assignments, prevProps.assignments)
        ) {
          let time = getCurrentTime();
          for (var track in this.props.assignments) {
            this.handleNotesForTrack(time, track);
          }
        }
      }
    }
  }

  isEqual = (a, b) => {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
      return false;
    }

    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i];
      if (a[propName] !== b[propName]) {
        return false;
      }
    }

    return true;
  };

  handleTimeUpdate = time => {
    this.currentTime = time;
  };

  handleAnimationFrame = () => {
    if (this.isMounted_ !== true) {
      return;
    }

    if (this.props.assignments !== {}) {
      for (var track in this.props.assignments) {
        this.handleNotesForTrack(this.currentTime, track);
      }
    }

    if (this.isMounted_ === true) {
      requestAnimationFrame(this.handleAnimationFrame);
    }
  };

  handleNotesForTrack = (time, track) => {
    var noteTrack = this.props.isShowingJamBar ? "jamBar" : track;
    if (time !== 0 || track === "jamBar") {
      const currentNotes = notesForTrackAtTime(noteTrack, time);

      // end early if the notes haven't changed since last time
      if (isEqual(currentNotes, this.prevCurrentNotes)) {
        return;
      }
      this.prevCurrentNotes = currentNotes;

      const guitarIds = this.props.assignments[track];

      guitarIds.forEach(guitarId => {
        const prevNotes = this.prevOn[guitarId] || {};
        var updates = [];

        for (var noteKey in currentNotes) {
          if (prevNotes[noteKey] === undefined) {
            const note = { ...currentNotes[noteKey], isOn: true };
            updates.push(note);
          }
        }

        for (noteKey in prevNotes) {
          if (currentNotes[noteKey] === undefined) {
            const note = { ...prevNotes[noteKey], isOn: false };
            updates.push(note);
          }
        }

        if (updates.length > 0) {
          guitarController.setNotes(updates, guitarId);
        }

        this.prevOn[guitarId] = currentNotes;
        this.hasCleared = false;
      });
    } else {
      if (this.hasCleared === false) {
        guitarController.clearAllGuitars();
        this.hasCleared = true;
      }
    }
  };

  handleGuitarConnected = async id => {
    const { tracks } = this.props;

    var guitar = await getGuitar(id);
    if (guitar === null) {
      guitar = { id, isLeft: false, isBass: false };
      await setGuitar(guitar);
    } else {
      guitarController.setLeft(guitar.isLeft, id);
      guitarController.setBass(guitar.isBass, id);
    }

    if (tracks.first() === undefined) {
      this.props.updateGuitarSetting(Map(guitar));
    } else {
      guitar.track = tracks.first().get("name");
      this.props.updateGuitarSetting(Map(guitar));
      addGuitar(id, guitar.track);
    }
  };

  handleGuitarDisconnected = id => {
    this.props.guitarDisconnected(id);
    removeGuitar(id);
  };

  handleGuitarLost = id => {
    this.props.guitarDisconnected(id);
    removeGuitar(id);
  };
}

GuitarController.propTypes = {
  tracks: PropTypes.object,
  guitars: PropTypes.array,
  assignments: PropTypes.object,
  isShowingJamBar: PropTypes.bool.isRequired,
  updateGuitarSetting: PropTypes.func.isRequired,
  guitarDisconnected: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const stateGuitars = state.get("guitars");
  var guitars = [];
  var assignments = {};

  if (stateGuitars.count() > 0) {
    guitars = stateGuitars.toJS();
    guitars.forEach(guitar => {
      if (assignments[guitar.track] === undefined) {
        assignments[guitar.track] = [guitar.id];
      } else {
        assignments[guitar.track] = [...assignments[guitar.track], guitar.id];
      }
    });
  }

  return {
    tracks: state.get("visibleTracks"),
    isShowingJamBar: state.get("isShowingJamBar"),
    guitars,
    assignments
  };
};

export default connect(mapStateToProps, actions)(GuitarController);
