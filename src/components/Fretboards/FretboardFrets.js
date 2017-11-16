import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, StyleSheet, Text } from "react-native";
import { List, Map } from "immutable";
import FretboardNote from "./FretboardNote";
import {
  subscribeToTimeUpdates,
  unsubscribeToTimeUpdates
} from "../../time-store";
import { notesForTrackAtTime } from "../../midi-store";
import { getNotation } from "./notations";

// TODO: IMPLEMENT TUNING ADJUSTMENT

const noteStyles = StyleSheet.create({
  noteContainer: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 1
  },
  noteView: {
    flex: -1,
    aspectRatio: 1,
    backgroundColor: "#17A3E3",
    borderRadius: 1000,
    alignItems: "center"
  },
  noteText: {
    height: "100%",
    textAlignVertical: "center"
  }
});

class FretboardFrets extends React.Component {
  constructor(props) {
    super(props);
    this.noteRefs = {};
    this.prevOn = [];
    this.currentTime = 0;
  }

  render() {
    const {
      track,
      isSmart,
      isLeft,
      currentNotation,
      boardWidth,
      fretHeight,
      onLayout,
      onToggleOrientation
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
    subscribeToTimeUpdates(this.handleTimeUpdate);
  }

  componentWillUnmount() {
    unsubscribeToTimeUpdates(this.handleTimeUpdate);
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.isLeft !== this.props.isLeft ||
      prevProps.scrollIndex !== this.props.scrollIndex ||
      this.currentTime !== 0 ||
      this.props.track.name !== ""
    ) {
      for (key in this.noteRefs) {
        const noteRef = this.noteRefs[key];
        if (noteRef !== undefined) {
          noteRef.hide();
        }
      }

      this.handleTimeUpdate(this.currentTime);
    }
  }

  handleTimeUpdate = time => {
    if (
      time !== 0 &&
      this.props.track.name !== "" &&
      this.props.trackIndex === this.props.scrollIndex
    ) {
      const on = notesForTrackAtTime(this.props.track.name, time);

      if (on.length > 0) {
        if (this.prevOn.length === 0) {
          on.forEach(note => {
            if (this.noteRefs[note.ref] !== undefined) {
              this.noteRefs[note.ref].show();
            }
          });
        } else {
          this.prevOn.forEach(note => {
            const index = on.findIndex(
              onNote =>
                onNote.fret === note.fret && onNote.string === note.string
            );

            if (index === -1) {
              if (this.noteRefs[note.ref] !== undefined) {
                this.noteRefs[note.ref].hide();
              }
            }
          });

          on.forEach(note => {
            if (this.noteRefs[note.ref] !== undefined) {
              this.noteRefs[note.ref].show();
            }
          });
        }
      } else {
        this.prevOn.forEach(note => {
          if (this.noteRefs[note.ref] !== undefined) {
            this.noteRefs[note.ref].hide();
          }
        });
      }
      this.prevOn = on;
    }
    this.currentTime = time;
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
            styles={noteStyles}
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
  isSmart: PropTypes.bool.isRequired,
  isLeft: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  boardWidth: PropTypes.number.isRequired,
  fretHeight: PropTypes.number.isRequired,
  onLayout: PropTypes.func.isRequired
};

export default FretboardFrets;
