import { List } from "immutable";

export const guitars = (state = List(), action) => {
  switch (action.type) {
    case "UPDATE_GUITAR": {
      const guitar = action.payload;
      const index = state.findIndex(
        item => item.get("id") === guitar.get("id")
      );
      if (index > -1) {
        return state.set(index, guitar);
      } else {
        return state.push(guitar);
      }
    }

    case "ASSIGN_ALL_GUITARS": {
      const updates = state.map(guitar =>
        guitar.set("track", action.payload.trackName)
      );

      return updates;
    }

    case "GUITAR_DISCONNECTED": {
      const { guitarId } = action.payload;
      const index = state.indexOf(
        assignment => assignment.guitarId === guitarId
      );
      return state.delete(index);
    }

    case "UPDATE_MIDI_DATA": {
      const updates = state.map(guitar =>
        guitar.set("track", action.payload.guitarTracks.first().get("name"))
      );

      return updates;
    }

    default:
      return state;
  }
};

export const tunerIsActive = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_TUNER":
      return action.payload;
    default:
      return state;
  }
};

export const bleMenuIsActive = (state = false, action) => {
  switch (action.type) {
    case "TOGGLE_BLE_MENU":
      return action.payload;
    default:
      return state;
  }
};
