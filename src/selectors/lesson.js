import { createSelector } from "reselect";

const getTimeSelector = state => state.get("time");
const getMarkersSelector = (_, props) => props.videoMarkers;

// CHAPTERS

exports.chapterForTime = (time, items) => {
  if (items === undefined) {
    return undefined;
  } else {
    var chapter;

    items.forEach(item => {
      if (item.type === "chapter" && item.begin <= time && item.end >= time) {
        chapter = item;
        return;
      }
    });

    return chapter;
  }
};

// MARKERS

exports.markerForTime = (time, items) => {
  if (items === undefined) {
    return undefined;
  } else {
    var marker;

    items.forEach(item => {
      if (item.type === "marker" && item.begin <= time && item.end >= time) {
        marker = item;
        return;
      }
    });

    return marker;
  }
};

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
