const middleA = 440;
var tuningNotes = [];
var allNotes = [];
var allPitches = [];
var stringPitches = [];

const tuningPitch = (defaultNote, string, octave) => {
  var note = defaultNote;
  var index = allNotes.findIndex(item => note === item.note);

  if (tuningNotes !== undefined) {
    var tuningIndex = tuningNotes.findIndex(item => string === item.string);

    if (tuningIndex > -1) {
      const mod = tuningNotes[tuningIndex].fret;
      let adjusted = index + mod;

      if (adjusted > allNotes.length) {
        let remainder = adjusted % allNotes.length;
        index = remainder;
      } else if (adjusted < 0) {
        let remainder = adjusted % allNotes.length;
        index = allNotes.length + remainder;
      } else {
        index = index + mod;
      }
    }
  }

  note = allNotes[index].note;
  let midFrequency = middleA * Math.pow(2, index / 12);
  let frequency = midFrequency * Math.pow(2, octave - 4);

  console.log(note, midFrequency, frequency);

  return { note, octave, frequency };
};

export const setTuningParameters = (track, notation, tuningTrackNotes) => {
  let strings =
    notation === "Sharps"
      ? ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"]
      : ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

  allNotes = strings.map((note, index) => {
    let frequency = middleA * Math.pow(2, index / 12);
    return { note, frequency };
  });

  tuningNotes = tuningTrackNotes;
  allPitches = [];
  for (var octave = 0; octave < 7; octave++) {
    allNotes.forEach(item => allPitches.push({ ...item, octave }));
  }

  stringPitches = track.isBass
    ? [
        tuningPitch("E", 5, 1),
        tuningPitch("A", 4, 1),
        tuningPitch("D", 3, 2),
        tuningPitch("G", 2, 2)
      ]
    : [
        tuningPitch("E", 5, 2),
        tuningPitch("A", 4, 2),
        tuningPitch("D", 3, 3),
        tuningPitch("G", 2, 3),
        tuningPitch("B", 1, 3),
        tuningPitch("E", 0, 4)
      ];
};

export const pitchForString = string => {
  return stringPitches[string];
};

// FLAGGED FOR REMOVAL; MAY NOT NEED
// MAY ALSO NOT NEED allPitches

/*

export const distanceToPitchBelow = pitch => {
  let matching = allPitches.filter(item => item.frequency < pitch.frequency);

  if (matching.length > 0) {
    let pitchBelow = matching[matching.length - 1];
    return pitch.frequency - pitchBelow.frequency;
  } else {
    return 0.0;
  }
};

export const distanceToPitchAbove = pitch => {
  let matching = allPitches.filter(item => item.frequency > pitch.frequency);

  if (matching.length > 0) {
    let pitchAbove = matching[0];
    return pitchAbove.frequency - pitch.frequency;
  } else {
    return 0.0;
  }
};
*/
