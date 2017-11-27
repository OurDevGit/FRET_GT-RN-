import { List, Map, Set } from "immutable";
import MidiParser from "./midi-parser";

var notes = {};
var watchedNotes = {};
var currentNotes = {};
var currentTime = 0;
var midiOffset = 0;

export const loadMidi = path => {
  return MidiParser(path)
    .then(midi => {
      notes = midi.notes.toJS();
      delete midi.notes;
      return midi;
    })
    .catch(err => {
      // TODO: should probably handle this
    });
};

export const clearMidi = () => {
  notes = {};
  watchedNotes = {};
  currentNotes = {};
};

export const setMidiOffset = offset => {
  midiOffset = offset === undefined ? 0 : offset;
};

export const clearMidiOffset = () => {
  midiOffset = 0;
};

export const notesForTrackAtTime = (track, time) => {
  if (notes[track] === undefined || time == -1) {
    return [];
  } else {
    const midiTime = time - midiOffset;
    var shouldProcessNotes = midiTime !== currentTime;
    if (watchedNotes[track] === undefined) {
      watchedNotes[track] = notes[track];
      shouldProcessNotes = true;
    }

    if (shouldProcessNotes) {
      for (var trackName in watchedNotes) {
        const trackNotes = watchedNotes[trackName];
        const active = trackNotes.filter(
          note => note.begin <= midiTime && note.end > midiTime
        );
        currentNotes[trackName] = active;
      }

      currentTime = midiTime;
    }
    return currentNotes[track];
  }
};

const timeForStep = (
  type,
  time,
  track,
  currentLoop,
  loopIsEnabled,
  currentVideoMarker
) => {
  const notesForTrack = Set(notes[track]);
  var timesForTrack = Set(notesForTrack.map(note => note.begin));

  timesForTrack = timesForTrack.filter(noteTime => {
    const begin = currentLoop.get("begin");
    const end = currentLoop.get("end");
    if (loopIsEnabled && begin !== undefined && end !== undefined) {
      return begin <= noteTime && end > noteTime;
    } else {
      return true;
    }
  });

  if (currentVideoMarker !== undefined) {
    timesForTrack = timesForTrack.filter(noteTime => {
      const begin = currentVideoMarker.get("begin");
      const end = currentVideoMarker.get("end");
      return begin <= noteTime && end > noteTime;
    });
  }

  const filtered = timesForTrack.filter(noteTime => {
    return type === "PREV"
      ? noteTime < time
      : time === 0 ? noteTime >= 0 : noteTime > time;
  });

  if (filtered.count() > 0) {
    const sorted =
      type === "PREV"
        ? List(filtered)
            .sort()
            .reverse()
        : List(filtered).sort();

    const currentNotes = notesForTrack
      .filter(note => note.begin <= time && note.end > time)
      .map(note => Map({ fret: note.fret, string: note.string }));

    var newTime = -1;
    sorted.some(noteTime => {
      const nextNotes = notesForTrack
        .filter(note => note.begin === noteTime && note.end > noteTime)
        .map(note => Map({ fret: note.fret, string: note.string }));

      if (!currentNotes.equals(nextNotes)) {
        newTime = noteTime;
        return true;
      }
    });

    if (newTime > -1) {
      return newTime;
    }
  }

  const sorted = List(timesForTrack).sort();
  const chosenTime = type === "PREV" ? sorted.last() : sorted.first();
  const adjustedTime = chosenTime;
  return adjustedTime;
};

export const timeForPrevStep = (
  time,
  track,
  currentLoop,
  loopIsEnabled,
  currentVideoMarker
) => {
  return timeForStep(
    "PREV",
    time,
    track,
    currentLoop,
    loopIsEnabled,
    currentVideoMarker
  );
};

export const timeForNextStep = (
  time,
  track,
  currentLoop,
  loopIsEnabled,
  currentVideoMarker
) => {
  return timeForStep(
    "NEXT",
    time,
    track,
    currentLoop,
    loopIsEnabled,
    currentVideoMarker
  );
};
