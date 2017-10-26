import { List, Map, Set } from "immutable";
import MidiParser from "./midi-parser";

var notes = {};
var watchedNotes = {};
var currentNotes = {};
var currentTime = 0;
var midiOffset = 0;

exports.loadMidi = path => {
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

exports.clearMidi = () => {
  notes = {};
  watchedNotes = {};
  currentNotes = {};
};

exports.setMidiOffset = offset => {
  midiOffset = offset;
};

exports.clearMidiOffset = () => {
  midiOffset = 0;
};

exports.notesForTrackAtTime = (track, time) => {
  console.log(time);
  if (notes[track.name] === undefined || time == -1) {
    return [];
  } else {
    const midiTime = time - midiOffset;
    var shouldProcessNotes = midiTime !== currentTime;
    if (watchedNotes[track.name] === undefined) {
      watchedNotes[track.name] = notes[track.name];
      shouldProcessNotes = true;
    }

    if (shouldProcessNotes) {
      for (trackName in watchedNotes) {
        const trackNotes = watchedNotes[trackName];
        const active = trackNotes.filter(
          note => note.begin <= midiTime && note.end >= midiTime
        );
        currentNotes[trackName] = active;
      }

      currentTime = midiTime;
    }
    return currentNotes[track.name];
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

  const midiTime = time - midiOffset;
  const filtered = timesForTrack.filter(noteTime => {
    return type === "PREV"
      ? noteTime < midiTime
      : midiTime === 0 ? noteTime >= 0 : noteTime > midiTime;
  });

  if (filtered.count() > 0) {
    const sorted =
      type === "PREV"
        ? List(filtered)
            .sort()
            .reverse()
        : List(filtered).sort();

    console.log("times: ", sorted.toJS());

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
      console.log(newTime);
      return newTime + midiOffset;
    }
  }

  const sorted = List(timesForTrack).sort();
  const chosenTime = type === "PREV" ? sorted.last() : sorted.first();
  const adjustedTime = chosenTime + midiOffset;
  return adjustedTime;
};

exports.timeForPrevStep = (
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

exports.timeForNextStep = (
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
