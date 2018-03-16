import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import { onlyUpdateForKeys } from "recompose";
import FretboardNote from "./FretboardNote";
import {
  subscribeToTimeUpdates,
  unsubscribeToTimeUpdates,
  getCurrentTime
} from "../../time-store";
import { notesForTrackAtTime } from "../../midi-store";
import { getNotation } from "./notations";
import { isEqual } from "lodash";

class FretboardFrets extends Component {
  constructor(props) {
    super(props);
    this.noteRefs = {};
    this.prevNotes = {};
    this.prevCurrentNotes = {};
    this.currentTime = 0;
    this.prevTime = -1;
    this.isMounted_ = false;
    this.forceUpdateNotes = false;
  }

  render() {
    const { track, boardWidth, onLayout } = this.props;
    const paddingVertical = track.isBass
      ? boardWidth * 0.005
      : boardWidth * 0.003;
    return (
      <View
        pointerEvents={"none"}
        style={[styles.container, { paddingVertical }]}
        onLayout={onLayout}
      >
        {this.frets()}
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
      this.currentTime !== 0 ||
      this.props.track.name !== ""
    ) {
      this.currentTime = getCurrentTime();
    }

    if (
      prevProps.isShowingJamBar !== this.props.isShowingJamBar ||
      prevProps.isLeft !== this.props.isLeft ||
      prevProps.tunerIsActive !== this.props.tunerIsActive
    ) {
      this.forceUpdateNotes = true;
    }
  }

  handleTimeUpdate = time => {
    this.currentTime = time;
  };

  handleAnimationFrame = () => {
    if (this.isMounted_ !== true) {
      return;
    }

    if (this.forceUpdateNotes) {
      this.clearNotes();
    }

    if (
      this.props.track.name === "jamBar" ||
      this.forceUpdateNotes === true ||
      this.currentTime !== this.prevTime ||
      this.props.track.name !== ""
    ) {
      // removed: this.props.trackIndex === this.props.scrollIndex
      const trackName = this.props.track.name;
      const currentNotes = notesForTrackAtTime(trackName, this.currentTime);
      const notesAreSame = isEqual(currentNotes, this.prevCurrentNotes);
      var notesAreReady = true;

      if (!notesAreSame || this.forceUpdateNotes) {
        // console.debug("notes are different");

        var shownNotes = {};

        for (var noteKey in currentNotes) {
          const note = currentNotes[noteKey];
          if (
            this.noteRefs[note.ref] !== undefined &&
            this.noteRefs[note.ref] !== null
          ) {
            this.noteRefs[note.ref].show();
            shownNotes[noteKey] = note;
          } else {
            if (note.fret <= 22) {
              notesAreReady = false;
              break;
            }
          }
        }

        for (noteKey in this.prevNotes) {
          if (currentNotes[noteKey] === undefined) {
            const note = this.prevNotes[noteKey];
            if (
              this.noteRefs[note.ref] !== undefined &&
              this.noteRefs[note.ref] !== null
            ) {
              this.noteRefs[note.ref].hide();
            }
          }
        }

        // checking to see if notes are ready
        // if not, don't define prev notes
        this.prevCurrentNotes = notesAreReady ? currentNotes : {};
        this.prevNotes = notesAreReady ? shownNotes : {};
        this.forceUpdateNotes = false;
        this.prevTime = this.currentTime;
      }
    } else {
      // console.debug("notes are same");
    }

    if (this.isMounted_ === true) {
      requestAnimationFrame(this.handleAnimationFrame);
    }
  };

  clearNotes = () => {
    Object.keys(this.noteRefs).forEach(ref => {
      if (this.noteRefs[ref] !== undefined && this.noteRefs[ref] !== null) {
        this.noteRefs[ref].hide();
      }
    });
    this.prevCurrentNotes = {};
    this.prevNotes = {};
  };

  frets = () => {
    const {
      track,
      tuningTrack,
      isSmart,
      isLeft,
      boardWidth,
      fretHeight,
      currentNotation
    } = this.props;

    if (fretHeight > 0) {
      var frets = [];
      const first = isSmart ? track.firstFret : 0;
      const last = isSmart ? track.lastFret : 22;
      const diff = last - first;

      for (var i = first; i <= last; i++) {
        frets.push(
          <View key={i} style={{ flex: 1 }}>
            <View style={styles.fret}>
              {this.notes(
                track,
                tuningTrack.notes,
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
    tuningNotes,
    fret,
    isSmart,
    isLeft,
    frets,
    boardWidth,
    fretHeight,
    currentNotation
  ) => {
    var views = [];
    const last = isSmart ? track.lastFret : 22;
    const fretIndex = isLeft ? last - fret : fret;

    for (var i = 0; i < 6; i++) {
      if (i < 4 || !track.isBass) {
        const stringIndex = track.isBass ? i + 2 : i;
        const key = `${fretIndex}-${stringIndex}`;
        var tuningFret = fretIndex;
        if (tuningNotes.length > i) {
          if (tuningNotes[i].fret !== undefined) {
            tuningFret += tuningNotes[i].fret;
          }
        }

        const notation = getNotation(tuningFret, i, isLeft, currentNotation);
        var isRoot = false;
        if (track.root !== undefined) {
          let root0 = track.root.split("/")[0];
          let root1 = track.root.split("/")[1] || root0;
          isRoot = root0 === notation || root1 === notation;
        }

        views.push(
          <FretboardNote
            key={i}
            notation={notation}
            isRoot={isRoot}
            boardWidth={boardWidth}
            fretHeight={fretHeight}
            isBass={track.isBass || false}
            ref={ref => (this.noteRefs[key] = ref)}
          />
        );
      }
    }
    return views;
  };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  fret: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});

FretboardFrets.propTypes = {
  track: PropTypes.object.isRequired,
  tuningTrack: PropTypes.object.isRequired,
  tunerIsActive: PropTypes.bool.isRequired,
  isShowingJamBar: PropTypes.bool.isRequired,
  trackIndex: PropTypes.number.isRequired,
  isSmart: PropTypes.bool.isRequired,
  isLeft: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  boardWidth: PropTypes.number.isRequired,
  fretHeight: PropTypes.number.isRequired,
  onLayout: PropTypes.func.isRequired
};

export default onlyUpdateForKeys([
  "track",
  "tuningTrack",
  "isShowingJamBar",
  "trackIndex",
  "isLeft",
  "currentNotation",
  "boardWidth",
  "fretHeight",
  "tunerIsActive"
])(FretboardFrets);
