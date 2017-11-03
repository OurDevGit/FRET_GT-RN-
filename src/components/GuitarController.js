import React, { Component } from "react";
import { View, NativeModules, DeviceEventEmitter } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import { Map } from "immutable";
import { getGuitar, setGuitar } from "../models/Guitars";
import {
  subscribeToTimeUpdates,
  unsubscribeToTimeUpdates
} from "../time-store";
import { notesForTrackAtTime } from "../midi-store";

// This component manages the connection and notes for playback
// Management of device profiles are handled in FretlightModal.js

var guitarController = NativeModules.GTGuitarController;

class GuitarController extends Component {
  constructor(props) {
    super(props);
    this.prevOn = [];
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

    DeviceEventEmitter.addListener("BLE_STATUS", status => {
      console.log("ble status: ", status);
    });
  }

  componentDidMount() {
    guitarController.registerEmitter();
    subscribeToTimeUpdates(this.handleTimeUpdate);
  }

  componentWillUnmount() {
    unsubscribeToTimeUpdates(this.handleTimeUpdate);
  }

  handleTimeUpdate = time => {
    if (this.props.assignments !== {}) {
      for (track in this.props.assignments) {
        this.handleNotesForTrack(time, track);
      }
    }
  };

  handleNotesForTrack = (time, track) => {
    if (time !== 0) {
      const currentNotes = notesForTrackAtTime(track, time);
      const prevNotes = this.prevOn[track] || [];
      const guitarIds = this.props.assignments[track];
      const notesToTurnOn = currentNotes.filter(note => {
        const index = prevNotes.findIndex(
          prevNote =>
            prevNote.fret === note.fret && prevNote.string === note.string
        );
        return index === -1;
      });

      const notesToTurnOff = prevNotes.filter(note => {
        const index = currentNotes.findIndex(
          newNote =>
            newNote.fret === note.fret && newNote.string === note.string
        );
        return index === -1;
      });

      guitarIds.forEach(guitarId => {
        notesToTurnOn.forEach(note => {
          guitarController.setNote(note.string, note.fret, true, guitarId);
        });

        notesToTurnOff.forEach(note => {
          guitarController.setNote(note.string, note.fret, false, guitarId);
        });
      });

      this.prevOn[track] = currentNotes;
    } else {
      guitarController.clearAllGuitars();
    }
  };

  handleGuitarConnected = async id => {
    const { tracks, assignGuitarToTrack } = this.props;

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
    }
  };

  handleGuitarDisconnected = id => {
    this.props.guitarDisconnected(id);
  };
}

GuitarController.propTypes = {
  tracks: PropTypes.object,
  guitars: PropTypes.array,
  assignments: PropTypes.object
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
    console.log("guitars: ", guitars);
    console.log("assignments: ", assignments);
  }

  return {
    tracks: state.get("visibleTracks"),
    guitars,
    assignments
  };
};

export default connect(mapStateToProps, actions)(GuitarController);
