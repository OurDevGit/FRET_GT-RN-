import { List, Map } from "immutable";

export const markers = (state = List(), action) => {
  switch (action.type) {
    case "UPDATE_MIDI_DATA":
      return List(action.payload.markers);
    case "CLEAR_MIDI_DATA":
      return List();
    default:
      return state;
  }
};

export const guitarTracks = (state = List(), action) => {
  switch (action.type) {
    case "UPDATE_MIDI_DATA":
      return List(action.payload.guitarTracks);
    case "SET_CHORDS_AND_SCALES":
      return List([Map({ name: "chordsAndScales" })]);
    case "CLEAR_MIDI_DATA":
      return List();
    default:
      return state;
  }
};

export const visibleTracks = (state = List(), action) => {
  switch (action.type) {
    case "UPDATE_MIDI_DATA":
      return List([action.payload.guitarTracks.first()]);
    case "SET_JAMBAR":
      return List([state.first()]);
    case "UPDATE_VISIBLE_TRACKS":
      return action.payload;
    case "SET_CHORDS_AND_SCALES":
      return List([Map({ name: "chordsAndScales" })]);
    case "CLEAR_MIDI_DATA":
      return List();
    default:
      return state;
  }
};

export const tuningTracks = (state = Map(), action) => {
  switch (action.type) {
    case "UPDATE_MIDI_DATA":
      return action.payload.tuningTracks;
    case "CLEAR_MIDI_DATA":
      return Map();
    default:
      return state;
  }
};

export const smartTrack = (state = {}, action) => {
  switch (action.type) {
    case "SET_SMART_TRACK":
      return action.payload;
    case "CLEAR_SMART_TRACK":
      return {};
    default:
      return state;
  }
};

export const jamBarTrack = (state = Map({ patterns: List() }), action) => {
  switch (action.type) {
    case "UPDATE_MIDI_DATA":
      return action.payload.jamBar;
    case "CLEAR_MIDI_DATA":
      return Map({ patterns: List() });
    default:
      return state;
  }
};

export const isShowingJamBar = (state = false, action) => {
  switch (action.type) {
    case "SET_JAMBAR":
      return action.payload;
    case "UPDATE_VISIBLE_TRACKS":
      return false;
    case "SET_CHORDS_AND_SCALES":
      return false;
    case "CLEAR_MIDI_DATA":
      return false;
    default:
      return state;
  }
};
