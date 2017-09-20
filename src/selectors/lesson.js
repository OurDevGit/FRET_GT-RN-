import { createSelector } from "reselect";

const getTimeSelector = state => state.get("time");
const getMarkersSelector = (_, props) => props.videoMarkers;

// CHAPTERS

exports.flattenedChapters = chapters => {
  return chapters.reduce((acc, chapter) => {
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
};

exports.chapterForTime = createSelector(
  getTimeSelector,
  getMarkersSelector,
  (time, markers) => {
    const matching = markers.filter(
      item => item.type === "chapter" && item.end >= time
    );

    return matching[0];
  }
);

// MARKERS

exports.flattenedMarkers = chapters => {
  return chapters.reduce((acc, chapter, index) => {
    return acc.concat(chapter.children);
  }, []);
};

exports.markerForTime = createSelector(
  getTimeSelector,
  getMarkersSelector,
  (time, markers) => {
    const matching = markers.filter(
      item => item.type === "marker" && item.begin <= time && item.end >= time
    );
    return matching[0];
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
