// CHAPTERS

export const allChapters = chapters => {
  var chaps = [];

  for (var key in chapters) {
    if (chapters.hasOwnProperty(key)) {
      var element = chapters[key];
      chaps = chaps.concat(
        element.children.map(child => {
          return {
            ...child,
            name: `   ${child.name}`
          };
        })
      );
    }
  }

  return chaps;
};

export const chapterForTime = (time, chapters) => {
  const allChaps = allChapters(chapters);
  for (var key in allChaps) {
    if (allChaps.hasOwnProperty(key)) {
      var element = allChaps[key];
      if (element.begin <= time && element.end >= time) {
        return element;
      }
    }
  }

  return {};
};

// MARKERS

export const allMarkers = chapters => {
  return chapters.reduce((acc, chapter, index) => {
    return acc.concat(chapter.children);
  }, []);
};

export const markerForTime = (time, markers) => {
  const matching = markers.filter(
    item => item.begin <= time && item.end >= time
  );

  return matching[0];
};

// MIDI

export const midiForTime = (time, midis) => {
  const matching = midis.filter(item => item.begin <= time && item.end >= time);
  return matching[0];
};

export const midiOffsetForTime = (time, midis, markers) => {
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
