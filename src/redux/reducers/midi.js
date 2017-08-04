import { List, Map } from "immutable";

exports.markers = (state = List(), action) => {
  switch (action.type) {
    case "UPDATE_MIDI_DATA":
      return List(action.payload.markers);
    case "CLEAR_MIDI_DATA":
      return List();
    default:
      return state;
  }
};

const test = List([
  Map({ name: "Guitar 1" }),
  Map({ name: "Guitar 2" }),
  Map({ name: "The Best Soloist Around" }),
  Map({ name: "Bass" }),
  Map({ name: "Easy Chords" })
]);
const visible = List([Map({ name: "Guitar 1" })]);

exports.guitarTracks = (state = List(), action) => {
  switch (action.type) {
    case "UPDATE_MIDI_DATA":
      return List(action.payload.guitarTracks);
    case "CLEAR_MIDI_DATA":
      return List();
    default:
      return state;
  }
};

exports.visibleTracks = (state = List(), action) => {
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

exports.tuningTracks = (state = List(), action) => {
  switch (action.type) {
    case "UPDATE_MIDI_DATA":
      return List(action.payload.tuningTracks);
    case "CLEAR_MIDI_DATA":
      return List();
    default:
      return state;
  }
};

exports.patterns = (state = List(), action) => {
  switch (action.type) {
    case "UPDATE_MIDI_DATA":
      return List(action.payload.patterns);
    case "CLEAR_MIDI_DATA":
      return List();
    default:
      return state;
  }
};
