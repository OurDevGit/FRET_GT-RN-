const MidiConvert = require("midiconvert");
const MidiPlayer = require("midi-player-js");
const midiFileParser = require("midi-file-parser");
const fs = require("fs");

const doMC = () => {
  fs.readFile("./rpn_test_blister.mid", "binary", function(err, midiBlob) {
    if (!err) {
      const midi = MidiConvert.parse(midiBlob);

      fs.writeFileSync("./mcData.json", JSON.stringify(midi, null, 2));

      midi.tracks.forEach(track => {
        console.log(
          track.name,
          JSON.stringify(track.controlChanges["100"], null, 2)
        );
        console.log(
          track.name,
          JSON.stringify(track.controlChanges["101"], null, 2)
        );
        console.log(
          track.name,
          JSON.stringify(track.controlChanges["6"], null, 2)
        );
        console.log(
          track.name,
          JSON.stringify(track.controlChanges["38"], null, 2)
        );
        // console.log(`  has ${track.controlChanges.length} control changes\n`);
      });

      // console.log(midi)
    }
  });
};

const doMP = () => {
  var Player = new MidiPlayer.Player(function(event) {
    // console.log(event);
  });

  // Load a MIDI file
  Player.on("fileLoaded", data => {
    console.log("file is loaded!");
    // console.log(`${data.tracks.length} tracks found`);
    // console.log(JSON.stringify(data, null, 2));

    data.events.forEach(eventList => {
      eventList.forEach(event => {
        if (event.name === "Controller Change") {
          console.log(event);
        }
      });
    });

    fs.writeFileSync("./mpData.json", JSON.stringify(data, null, 2));
  });
  Player.loadFile("./rpn_test_blister.mid");
  // Player.play();
};

const doMFP = () => {
  var file = require("fs").readFileSync("rpn_test_blister.mid", "binary");

  var midi = midiFileParser(file);
  fs.writeFileSync("./mfpData.json", JSON.stringify(midi, null, 2));

  midi.tracks.forEach(track => {
    track.forEach(event => {
      if (event.subtype !== "noteOn" && event.subtype !== "noteOff") {
        // console.log(event.type, event.subtype);
        if (event.subtype === "controller") {
          console.log({
            type: event.controllerType,
            val: event.value
          });
        }
      }
    });
  });

  // console.log(JSON.stringify(midi, null, 2));
};

doMFP();
