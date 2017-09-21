import { List } from "immutable";

exports.videoChapters = (state = List(), action) => {
  switch (action.type) {
    case "SET_VIDEO_CHAPTERS":
      const reduced = action.payload.reduce((acc, chapter) => {
        const { name } = chapter;
        var type = "chapter";
        var begin,
          end = 0;

        const markers = chapter.children.reduce((acc2, marker) => {
          const { name, begin, end } = marker;
          var type = "marker";
          return acc2.concat({ type, name, begin, end });
        }, []);

        if (markers.length > 0) {
          const lastIndex = markers.length - 1;
          begin = markers[0].begin;
          end = markers[lastIndex].end;
        }

        return acc.concat([{ type, name, begin, end }, ...markers]);
      }, []);

      return List(reduced);

    case "CLEAR_MIDI_DATA":
      return List();
    default:
      return state;
  }
};

exports.videoMarkers = (state = List(), action) => {
  switch (action.type) {
    case "SET_VIDEO_CHAPTERS":
      const reduced = action.payload.reduce((acc, chapter, index) => {
        return acc.concat(chapter.children);
      }, []);

      return List(reduced);
    case "CLEAR_MIDI_DATA":
      return List();
    default:
      return state;
  }
};
