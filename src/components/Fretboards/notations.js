export const getNotation = (fret, string, isLeft, currentNotation) => {
  if (currentNotation === "None") {
    return " ";
  } else {
    const roots = ["E", "B", "G", "D", "A", "E"];
    const defaultName = roots[string];
    const scale = scaleForNotation(currentNotation);
    const index = scale.indexOf(defaultName) || 0;
    const adjusted = fret + index; // + adjustment
    var remainder = adjusted % scale.length;

    if (remainder < 0) {
      remainder = scale.count + remainder;
    }

    return scale[remainder];
  }
};

export const getTuningNotation = (string, currentNotation) => {
  return getNotation(0, string, false, currentNotation);
};

const scaleForNotation = notation => {
  switch (notation) {
    case "Sharps":
      return ["E", "F", "F♯", "G", "G♯", "A", "A♯", "B", "C", "C♯", "D", "D♯"];
    default:
      return ["E", "F", "G♭", "G", "A♭", "A", "B♭", "B", "C", "D♭", "D", "E♭"];
  }
};
