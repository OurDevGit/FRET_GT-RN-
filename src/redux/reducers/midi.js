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
    case "CLEAR_MIDI_DATA":
      return List();
    case "UPDATE_VISIBLE_TRACKS":
      return action.payload;
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

export const patterns = (state = List(), action) => {
  switch (action.type) {
    case "UPDATE_MIDI_DATA":
      return List(action.payload.patterns);
    case "CLEAR_MIDI_DATA":
      return List();
    default:
      return state;
  }
};
