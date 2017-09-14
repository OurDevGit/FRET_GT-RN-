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

  return matching[0] || {};
};

// MIDI

export const midiForTime = (time, midis) => {
  const matching = midis.filter(item => item.begin <= time && item.end >= time);
  return matching[0] !== undefined ? `${matching[0].name}.midi` : null;
};
