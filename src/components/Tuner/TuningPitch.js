const middleA = 440;
var tuningNotes = [];
var allNotes = [];
var allFrequencies = [];
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
  let midFrequency = middleA * Math.pow(2, (index - 9) / 12);
  let frequency = midFrequency * Math.pow(2, octave - 4);

  return { note, octave, frequency };
};

export const setTuningParameters = (track, notation, tuningTrackNotes) => {
  let strings =
    notation === "Sharps"
      ? ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"]
      : ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

  allNotes = strings.map((note, index) => {
    let frequency = middleA * Math.pow(2, (index - 9) / 12);
    return { note, frequency };
  });

  tuningNotes = tuningTrackNotes;
  allFrequencies = [];
  for (var octave = 0; octave < 7; octave++) {
    allNotes.forEach(item =>
      allFrequencies.push(item.frequency * Math.pow(2, octave - 4))
    );
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

// used for fine-tuning
const distanceToPitchBelow = frequency => {
  let matching = allFrequencies.filter(item => item < frequency);

  if (matching.length > 0) {
    let freqBelow = matching[matching.length - 1];
    return frequency - freqBelow;
  } else {
    return 0.0;
  }
};

const distanceToPitchAbove = frequency => {
  let matching = allFrequencies.filter(item => item > frequency);

  if (matching.length > 0) {
    let freqAbove = matching[0];
    return freqAbove - frequency;
  } else {
    return 0.0;
  }
};

export const fineTuningAdjustment = (frequency, fineTuning) => {
  let tuning = fineTuning / 8192;

  if (tuning < 0) {
    return distanceToPitchBelow(frequency) * tuning;
  } else if (tuning > 0) {
    return distanceToPitchAbove(frequency) * tuning;
  } else {
    return 0;
  }
};
