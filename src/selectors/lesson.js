import { createSelector } from "reselect";

const getTimeSelector = state => state.get("time");
const getMarkersSelector = (_, props) => props.videoMarkers;

// CHAPTERS

exports.chapterForTime = createSelector(
  getTimeSelector,
  getMarkersSelector,
  (time, markers) => {
    if (markers === undefined) {
      return undefined;
    } else {
      const matching = markers.filter(
        item => item.type === "chapter" && item.end >= time
      );

      return matching[0];
    }
  }
);

// MARKERS

exports.markerForTime = createSelector(
  getTimeSelector,
  getMarkersSelector,
  (time, markers) => {
    if (markers === undefined) {
      return undefined;
    } else {
      const matching = markers.filter(
        item => item.type === "marker" && item.begin <= time && item.end >= time
      );
      return matching[0];
    }
  }
);

// MIDI

exports.midiForTime = (time, midis) => {
  const matching = midis.filter(item => item.begin <= time && item.end >= time);
  return matching[0];
};

exports.midiOffsetForTime = (time, midis, markers) => {
  const midi = midiForTime(time, midis);
  const marker = markerForTime(time, markers);
  var midiTime = time;

  if (midi !== undefined) {
    midiTime = time - midi.begin;

    if (marker !== undefined) {
      const offset = marker.begin - midi.begin;
      midiTime = time - marker.begin + offset;
    }
  }

  return time;
};
