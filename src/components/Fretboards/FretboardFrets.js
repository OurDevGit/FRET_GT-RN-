import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import FretboardNote from "./FretboardNote";
import {
  subscribeToTimeUpdates,
  unsubscribeToTimeUpdates,
  getCurrentTime
} from "../../time-store";
import { notesForTrackAtTime } from "../../midi-store";
import { getNotation } from "./notations";

class FretboardFrets extends Component {
  constructor(props) {
    super(props);
    this.noteRefs = {};
    this.prevNotes = {};
    this.currentTime = 0;
    this.isMounted_ = false;
  }

  render() {
    const {
      track,
      isSmart,
      isLeft,
      currentNotation,
      boardWidth,
      fretHeight,
      onLayout
    } = this.props;

    return (
      <View
        pointerEvents={"none"}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          paddingVertical: track.isBass
            ? boardWidth * 0.005
            : boardWidth * 0.003,
          flexDirection: "row",
          justifyContent: "space-between"
        }}
        onLayout={onLayout}
      >
        {this.frets(
          track,
          isSmart,
          isLeft,
          boardWidth,
          fretHeight,
          currentNotation
        )}
      </View>
    );
  }

  componentDidMount() {
    this.isMounted_ = true;
    subscribeToTimeUpdates(this.handleTimeUpdate);
    this.currentTime = getCurrentTime();
    requestAnimationFrame(this.handleAnimationFrame);
  }

  componentWillUnmount() {
    this.isMounted_ = false;
    unsubscribeToTimeUpdates(this.handleTimeUpdate);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isLeft !== this.props.isLeft ||
      prevProps.scrollIndex !== this.props.scrollIndex ||
      this.currentTime !== 0 ||
      this.props.track.name !== ""
    ) {
      this.currentTime = getCurrentTime();
    }
  }

  handleTimeUpdate = time => {
    this.currentTime = time;
  };

  handleAnimationFrame = () => {
    if (this.isMounted_ !== true) {
      return;
    }

    if (
      this.currentTime !== 0 &&
      this.props.track.name !== "" &&
      this.props.trackIndex === this.props.scrollIndex
    ) {
      const trackName = this.props.track.name;
      const currentNotes = notesForTrackAtTime(trackName, this.currentTime);
      var shownNotes = {};

      for (var noteKey in currentNotes) {
        const note = currentNotes[noteKey];
        if (this.noteRefs[note.ref] !== undefined) {
          this.noteRefs[note.ref].show();
          shownNotes[noteKey] = note;
        }
      }

      for (noteKey in this.prevNotes) {
        if (currentNotes[noteKey] === undefined) {
          const note = this.prevNotes[noteKey];
          if (this.noteRefs[note.ref] !== undefined) {
            this.noteRefs[note.ref].hide();
          }
        }
      }

      this.prevNotes = shownNotes;
    }

    if (this.isMounted_ === true) {
      requestAnimationFrame(this.handleAnimationFrame);
    }
  };

  frets = (track, isSmart, isLeft, boardWidth, fretHeight, currentNotation) => {
    if (fretHeight > 0) {
      var frets = [];
      const first = isSmart ? track.firstFret : 0;
      const last = isSmart ? track.lastFret : 23;
      const diff = last - first;

      for (var i = first; i <= last; i++) {
        frets.push(
          <View key={i} style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {this.notes(
                track,
                i,
                isSmart,
                isLeft,
                diff,
                boardWidth,
                fretHeight,
                currentNotation
              )}
            </View>
          </View>
        );
      }
      return frets;
    }
  };

  notes = (
    track,
    fret,
    isSmart,
    isLeft,
    frets,
    boardWidth,
    fretHeight,
    currentNotation
  ) => {
    var views = [];
    const last = isSmart ? track.lastFret : 23;
    const fretIndex = isLeft ? last - fret : fret;

    for (var i = 0; i < 6; i++) {
      if (i < 4 || !track.isBass) {
        const stringIndex = track.isBass ? i + 2 : i;
        const key = `${fretIndex}-${stringIndex}`;
        views.push(
          <FretboardNote
            key={i}
            notation={getNotation(fretIndex, i, isLeft, currentNotation)}
            boardWidth={boardWidth}
            fretHeight={fretHeight}
            ref={ref => (this.noteRefs[key] = ref)}
          />
        );
      }
    }
    return views;
  };
}

FretboardFrets.propTypes = {
  track: PropTypes.object.isRequired,
  trackIndex: PropTypes.number.isRequired,
  scrollIndex: PropTypes.number.isRequired,
  isSmart: PropTypes.bool.isRequired,
  isLeft: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  boardWidth: PropTypes.number.isRequired,
  fretHeight: PropTypes.number.isRequired,
  onLayout: PropTypes.func.isRequired
};

export default FretboardFrets;
