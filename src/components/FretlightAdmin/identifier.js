export const startIdentification = (controller, guitars) => {
  guitars.forEach((guitar, index) => {
    controller.clearAll(guitar.get("id"));
    controller.setLeft(false, guitar.get("id"));
    controller.setBass(false, guitar.get("id"));

    let notes = identificationNotes(index + 1);
    notes.forEach(note => {
      controller.setNote(note.string, note.fret, true, guitar.get("id"));
    });
  });
};

export const stopIdentification = (controller, guitars) => {
  guitars.forEach((guitar, index) => {
    controller.setLeft(guitar.get("isLeft"), guitar.get("id"));
    controller.setBass(guitar.get("isBass"), guitar.get("id"));
    controller.clearAll(guitar.get("id"));
  });
};

const fretNotes = fret => {
  return [
    { string: 2, fret },
    { string: 3, fret },
    { string: 4, fret },
    { string: 5, fret }
  ];
};

const note = (string, fret) => {
  return { string, fret };
};

const identificationNotes = number => {
  // display a number of notes for the guitar number
  var notes = [];
  let frets = Math.floor(number / 4);
  let remainder = number % 4;
  var remainderFret = 1;

  for (var i = 0; i < frets; i++) {
    notes = [...notes, ...fretNotes(i + 1)];
    remainderFret = i + 2;
  }

  for (var i = 0; i < remainder; i++) {
    notes = [...notes, note(5 - i, remainderFret)];
  }

  switch (number) {
    case 9:
      notes = [
        ...notes,
        ...fretNotes(17),
        ...fretNotes(19),
        ...fretNotes(20),
        note(2, 18),
        note(5, 18),
        note(2, 20)
      ];
      break;
    case 8:
      notes = [
        ...notes,
        ...fretNotes(17),
        ...fretNotes(19),
        ...fretNotes(21),
        note(2, 18),
        note(5, 18),
        note(2, 20),
        note(5, 20)
      ];
      break;
    case 7:
      notes = [
        ...notes,
        ...fretNotes(17),
        note(2, 18),
        note(2, 19),
        note(2, 20),
        note(2, 21)
      ];
      break;
    case 6:
      notes = [
        ...notes,
        ...fretNotes(19),
        ...fretNotes(21),
        note(5, 17),
        note(5, 18),
        note(2, 20),
        note(5, 20)
      ];
      break;
    case 5:
      notes = [
        ...notes,
        ...fretNotes(17),
        ...fretNotes(19),
        ...fretNotes(21),
        note(5, 18),
        note(2, 20)
      ];
      break;
    case 4:
      notes = [
        ...notes,
        ...fretNotes(19),
        note(2, 17),
        note(5, 17),
        note(2, 18),
        note(5, 18),
        note(2, 20),
        note(5, 21)
      ];
      break;
    case 3:
      notes = [
        ...notes,
        ...fretNotes(17),
        ...fretNotes(19),
        ...fretNotes(21),
        note(2, 18),
        note(2, 20)
      ];
      break;
    case 2:
      notes = [
        ...notes,
        ...fretNotes(17),
        ...fretNotes(19),
        ...fretNotes(21),
        note(2, 18),
        note(5, 20)
      ];
      break;
    case 1:
      notes = [
        ...notes,
        note(3, 17),
        note(3, 18),
        note(4, 18),
        note(3, 19),
        note(3, 20),
        note(3, 21)
      ];
      break;
    default:
      break;
  }
  return notes;
};
