const middleA = 440;
var allNotes = [];
var allPitches = [];

const tuningPitch = (note, octave) => {
  let index = allNotes.findIndex(item => note === item);
  let midFrequency = middleA * Math.pow(2, index / 12);
  let frequency = midFrequency * Math.pow(2, octave - 4);
  return { note, octave, frequency };
};

export const setTuningNotation = notation => {
  let strings =
    notation === "Sharps"
      ? ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"]
      : ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

  allNotes = strings.map((note, index) => {
    let frequency = middleA * Math.pow(2, index / 12);
    return { note, frequency };
  });

  allPitches = [];
  for (var octave = 0; octave < 7; octave++) {
    allNotes.forEach(item => allPitches.push({ ...item, octave }));
  }
};

export const pitchForString = (string, isBass, notation) => {
  const mod = isBass ? 1 : 0;
  const pitches = [
    tuningPitch("E", 2 - mod),
    tuningPitch("A", 2 - mod),
    tuningPitch("D", 3 - mod),
    tuningPitch("G", 3 - mod),
    tuningPitch("B", 3 - mod),
    tuningPitch("E", 4 - mod)
  ];

  var pitch = pitches[string];
  // TODO: handle tuning adjustments
  return pitch;
};

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
