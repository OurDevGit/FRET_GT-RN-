export const chapterFromTime = (time, chapters) => {
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

export const allChapters = chapters => {
  var chaps = [];

  for (var key in chapters) {
    if (chapters.hasOwnProperty(key)) {
      var element = chapters[key];
      // chaps.push({ ...element.children[0], name: element.name });  // parent element
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
