const MidiConvert = require("midiconvert");
const MidiPlayer = require("midi-player-js");
const midiFileParser = require("midi-file-parser");
const fs = require("fs");
const filename = "walk_away"

function arrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);
  var i;

  for(i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

const doMC = () => {
  fs.readFile("./walk_away.mid", "binary", function(err, midiBlob) {
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
  // time/beats
  // tracks
  // markers
  // patterns / jambar
  // notes
  // rpn

  var file = require("fs").readFileSync(`${filename}.mid`, "binary");
  var midi = midiFileParser(file);
  fs.writeFileSync(`./${filename}.json`, JSON.stringify(midi, null, 2));

  var tempoTrack = midi.tracks[0]
  var microsecondsPerBeat = 0
  var totalEventTime = 0

  tempoTrack.forEach((event, index) => {
    if (event.subtype === "timeSignature") {
      var tempo = tempoTrack[index + 2]
      if (tempo.microsecondsPerBeat !== undefined) {
        microsecondsPerBeat = tempo.microsecondsPerBeat
      }
    }

    if (event.deltaTime !== undefined) {
      var beats = event.deltaTime / midi.header.ticksPerBeat
      var seconds = beats * microsecondsPerBeat / 1000000
      totalEventTime += seconds
    }

    if (event.microsecondsPerBeat !== undefined) {
      microsecondsPerBeat = event.microsecondsPerBeat
    }

    if (event.type === "meta" && event.text !== undefined) {
      if (event.text.includes("FMP -")) {
        var name = event.text.replace("FMP - ", "")
        console.log(`marker: ${name}; time: ${totalEventTime};`)
      }
    }
  });

  var guitarTracks = midi.tracks.filter(arr => {
    return (arr[0].text.includes("FMP -") && arr[0].text !== "FMP - Jam Bar")
  })

  var tuningTracks = midi.tracks.filter(arr => {
    return arr[0].text.includes("T -")
  })

  var jamBar = midi.tracks.filter(arr => {
    return arr[0].text.includes("FMP - Jam Bar")
  })



  midi.tracks.forEach(track => {
    track.forEach(event => {
      if (event.subtype !== "noteOn" && event.subtype !== "noteOff") {
        // console.log(event.type, event.subtype);

        if (event.subtype === "controller") {
          /*console.log({
            type: event.controllerType,
            track: event.value
          });*/
        }

        /*
        if (event.subtype === "controller") {
          console.log({
            type: event.controllerType,
            val: event.value
          });
        }*/
      }
    });
  });

  // console.log(JSON.stringify(midi, null, 2));
};



doMFP();
