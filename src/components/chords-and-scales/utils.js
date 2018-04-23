import { getCsPattern, getCsPatterns } from "../../models/Patterns";

const roots = ["E", "B", "G", "D", "A", "E"];
const scale = ["E", "F", "F#", "G", "G#", "A", "A#", "B", "C", "C#", "D", "D#"];
const intervals = [
  "Minor 2nd",
  "Major 2nd",
  "Minor 3rd",
  "Major 3rd",
  "Perfect 4th",
  "Augmented 4th",
  "Perfect 5th",
  "Minor 6th",
  "Major 6th",
  "Minor 7th",
  "Major 7th",
  "Perfect 8th"
];

export const Popover = {
  Category: "Category",
  Type: "Type",
  Key: "Key",
  Position: "Position"
};

export const TheoryResource = "chords_theory.html";
export const GlossaryResource = "chords_glossary.html";

export const getPattern = async (category, type, key, position) => {
  let pattern = await getCsPattern(category, type, key, position);

  var name = "";

  if (pattern !== undefined) {
    // set name
    var patternNotes = [];

    if (pattern.title !== undefined) {
      name += pattern.title;
    } else {
      if (pattern.type !== undefined) {
        name += `${pattern.type} `;
      }

      if (pattern.key !== undefined) {
        name += `| ${pattern.key.replace("b", "♭")} `;
      }

      if (pattern.position !== undefined) {
        name += `| ${pattern.position} `;
      }

      if (pattern.subTitle !== undefined) {
        name += `| ${pattern.subTitle}`;
      }
    }

    let rootKey = key.split("/")[0];
    let rootNotes = getNotesForKey(rootKey);

    if (
      pattern.noteData !== undefined &&
      pattern.noteData.notes !== undefined
    ) {
      patternNotes = pattern.noteData.notes;
    } else if (pattern.noteData.chord !== undefined) {
      let chordType = pattern.type.replace(" Chords", "");
      patternNotes = await getPatternNotes("Chords", chordType, key);
    } else if (pattern.noteData.scale !== undefined) {
      patternNotes = await getPatternNotes("Scales", pattern.type, key);
    } else if (pattern.noteData.interval !== undefined) {
      let intervalType = pattern.noteData.interval.csType;
      let secondKey = getIntervalSecondKey(intervalType, key);
      let secondNotes = getNotesForKey(secondKey);
      patternNotes = [...rootNotes, ...secondNotes];
    } else if (pattern.noteData.root !== undefined) {
      patternNotes = getNotesForKey(key);
    }

    let notes = patternNotes.map(note => {
      let fret = note.noteFret;
      let string = note.noteString;
      let isRoot =
        rootNotes.filter(n => n.noteFret === fret && n.noteString === string)
          .length > 0;
      let begin = 10;
      let end = isRoot ? 19 : 30;
      let ref = `${fret}-${string}`;
      return { fret, string, begin, end, ref };
    });

    let patternId = pattern.patternId;
    let chart =
      !pattern.imageName.includes("notesInfo") &&
      !pattern.imageName.includes("chordTonesInfo") &&
      !pattern.imageName.includes("IntervalsInfo.jpg")
        ? pattern.imageName
        : undefined;
    let photo =
      !pattern.altImage.includes("notesInfo") &&
      !pattern.imageName.includes("chordTonesInfo") &&
      !pattern.imageName.includes("IntervalsInfo.jpg")
        ? pattern.altImage
        : undefined;

    let root = key.replace("#", "♯").replace("b", "♭");
    return { patternId, name, chart, photo, root, notes };
  } else {
    return undefined;
  }
};

export const allNotesPattern = () => {
  var notes = [];

  for (var fret = 0; fret < 24; fret++) {
    for (var string = 0; string < 6; string++) {
      let begin = 10;
      let end = 30;
      let ref = `${fret}-${string}`;
      notes.push({ fret, string, begin, end, ref });
    }
  }

  return { name: "All Notes", notes };
};

export const getPatternNotes = async (category, type, key) => {
  let patterns = await getCsPatterns(category, type, key);
  let patternNotes = patterns.reduce((arr, pattern) => {
    if (pattern.noteData.notes !== undefined) {
      return arr.concat(pattern.noteData.notes);
    } else {
      return arr;
    }
  }, []);

  let keys = [...new Set(patternNotes.map(note => getKeyForNote(note)))];
  let notes = keys.reduce((arr, key) => {
    return arr.concat(getNotesForKey(key));
  }, []);

  return notes;
};

const getNotesForKey = selectedKey => {
  let key = selectedKey.split("/")[0];
  var notes = [];

  for (var noteString = 0; noteString < 6; noteString++) {
    let root = roots[noteString];
    var increment = scale.indexOf(root);

    for (var noteFret = 0; noteFret < 24; noteFret++) {
      if (key === scale[increment]) {
        notes.push({ noteString, noteFret });
      }

      increment =
        increment >= scale.length - 1 ? (increment = 0) : increment + 1;
    }
  }
  return notes;
};

const getKeyForNote = note => {
  if (note.noteString < roots.length) {
    let root = roots[note.noteString];
    let rootIndex = scale.indexOf(root);
    let index = note.noteFret + rootIndex;
    var remainder = index % scale.length;

    if (remainder < 0) {
      remainder = scale.length + remainder;
    }

    return scale[remainder];
  } else {
    return "NO ROOT";
  }
};

const getIntervalSecondKey = (interval, key) => {
  let intervalIndex = intervals.indexOf(interval);
  let keyIndex = scale.indexOf(key) || 0;
  let index = keyIndex + intervalIndex + 1;
  var remainder = index % scale.length;

  if (remainder < 0) {
    remainder = scale.length + remainder;
  }

  return scale[remainder];
};
