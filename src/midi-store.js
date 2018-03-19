import { List, Map, Set } from "immutable";
import MidiParser from "./midi-parser";

var notes = {};
var watchedNotes = {};
var currentNotes = {};
var currentTime = 0;
var midiOffset = 0;
var patternName = undefined;
var patternRoot = undefined;

export const loadMidi = path => {
  return MidiParser(path)
    .then(midi => {
      notes = midi.notes.toJS();
      delete midi.notes;
      return midi;
    })
    .catch(err => {
      // TODO: should probably handle this
      console.log(err);
    });
};

export const loadPatternNotes = (type, name, root, patternNotes) => {
  if (type === "chordsAndScales") {
    notes = { chordsAndScales: patternNotes };

    watchedNotes = {};
    currentNotes = {};
  } else {
    notes.jamBar = patternNotes;
  }

  patternName = name;
  patternRoot = root;
};

export const clearMidi = () => {
  notes = {};
  watchedNotes = {};
  currentNotes = {};
  patternName = undefined;
  patternRoot = undefined;
};

export const setMidiOffset = offset => {
  midiOffset = offset === undefined ? 0 : offset;
};

export const clearMidiOffset = () => {
  midiOffset = 0;
};

export const notesForTrackAtTime = (track, time) => {
  if (track === "jamBar") {
    var active = {};

    if (notes.jamBar !== undefined) {
      notes.jamBar.forEach(note => {
        active[note.ref] = note;
      });
    }

    return active;
  } else if (notes[track] === undefined || time < 0) {
    return {};
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
        active = {};

        trackNotes.forEach(note => {
          if (note.begin <= midiTime && note.end > midiTime) {
            active[note.ref] = note;
          }
        });

        currentNotes[trackName] = active;
      }

      currentTime = midiTime;
    }

    return currentNotes[track];
  }
};

export const clearCurrentPattern = () => {
  patternName = undefined;
  patternRoot = undefined;
  notes.jamBar = undefined;
};

export const getCurrentPattern = () => {
  return { name: patternName, root: patternRoot };
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
    const begin = currentLoop.get("begin") - midiOffset || undefined;
    const end = currentLoop.get("end") - midiOffset || undefined;
    if (loopIsEnabled && begin !== undefined && end !== undefined) {
      return begin <= noteTime && end > noteTime;
    } else {
      return true;
    }
  });

  if (currentVideoMarker !== undefined) {
    const begin = currentVideoMarker.get("begin") - midiOffset;
    const end = currentVideoMarker.get("end") - midiOffset;

    timesForTrack = timesForTrack.filter(noteTime => {
      return begin <= noteTime && end > noteTime;
    });
  }

  const filtered = timesForTrack.filter(noteTime => {
    return type === "PREV"
      ? noteTime < time - 0.0002
      : time === 0 ? noteTime >= 0 : noteTime > time;
  });

  if (filtered.count() > 0) {
    if (filtered.count() === 1 && filtered.first() === 0) {
      return time + midiOffset;
    }

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
        newTime = noteTime + 0.0001;
        return true;
      }
    });

    if (newTime > -1) {
      return newTime + midiOffset;
    }
  }

  const sorted = List(timesForTrack).sort();
  if (sorted.count() === 0 || (sorted.count() === 1 && sorted.first() === 0)) {
    return time + midiOffset;
  } else {
    const chosenTime = type === "PREV" ? sorted.last() : sorted.first();
    const adjustedTime = chosenTime + midiOffset;
    return adjustedTime;
  }
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
    time - midiOffset,
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
    time - midiOffset,
    track,
    currentLoop,
    loopIsEnabled,
    currentVideoMarker
  );
};
