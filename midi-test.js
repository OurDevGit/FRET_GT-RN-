const MidiConvert = require("midiconvert");
const MidiPlayer = require("midi-player-js");
const midiFileParser = require("midi-file-parser");
const fs = require("fs");
const filename = "walk_away"
var tempos = []

function arrayBuffer(buffer) {
  var ab = new ArrayBuffer(buffer.length);
  var view = new Uint8Array(ab);

  for (var i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

function timeForBeats(beats) {
  var microseconds = 0
  var totalBeats = 0
  
  for (var i = 0; i < tempos.length; i++) {
    var tempo = tempos[i]
    
    if (beats > totalBeats + tempo.beats) {
      microseconds += (tempo.beats * tempo.microsecondsPerBeat)
      totalBeats += tempo.beats
    } else {
      var diff = beats - totalBeats
      microseconds += (diff * tempo.microsecondsPerBeat)
      totalBeats += tempo.beats
      break
    }
  }

  if (beats > totalBeats) {
    var lastTempo = tempos[tempos.length - 1]
    var diff = beats - totalBeats
    microseconds += (diff * lastTempo.microsecondsPerBeat)
  }

  return microseconds / 1000000
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
  // ✔︎ time/beats
  // ✔︎ tracks
  // ✔︎ markers
  // ✔︎ patterns / jambar
  // notes
  // tuning
  // rpn

  var file = require("fs").readFileSync(`${filename}.mid`, "binary");
  var midi = midiFileParser(file);
  fs.writeFileSync(`./${filename}.json`, JSON.stringify(midi, null, 2));

  var tempoTrack = midi.tracks[0]
  
  var signatureMicrosecondsPerBeat = 0
  var microsecondsPerBeat = 0
  var totalEventBeats = 0
  var totalEventTime = 0

  console.log("MARKERS: ")
  tempoTrack.forEach((event, index) => {
    if (event.subtype === "timeSignature") {
      var tempo = tempoTrack[index + 2]
      if (tempo.microsecondsPerBeat !== undefined) {
        signatureMicrosecondsPerBeat = tempo.microsecondsPerBeat
        microsecondsPerBeat = signatureMicrosecondsPerBeat
      }
    }
    
    if (event.deltaTime !== undefined) {
      var beats = event.deltaTime / midi.header.ticksPerBeat
      var seconds = beats * microsecondsPerBeat / 1000000

      totalEventBeats += beats 
      totalEventTime += seconds

      var tempo = {microsecondsPerBeat : microsecondsPerBeat, beats: beats}
      tempos.push(tempo)

      if (event.microsecondsPerBeat !== undefined) {
        microsecondsPerBeat = event.microsecondsPerBeat
      }
    }

    if (event.type === "meta" && event.text !== undefined) {
      if (event.text.includes("FMP -")) {
        var name = event.text.replace("FMP - ", "")
        console.log(`marker: ${name}; time: ${totalEventTime};`)
      }
    }
  });

  console.log(" ")
  var guitarTracks = midi.tracks.filter(arr => {
    return (arr[0].text.includes("FMP -") && arr[0].text !== "FMP - Jam Bar")
  })

  var tuningTracks = midi.tracks.filter(arr => {
    return arr[0].text.includes("T -")
  })

  var jamBarTracks = midi.tracks.filter(arr => {
    return arr[0].text.includes("FMP - Jam Bar")
  })

  if (jamBarTracks.length > 0) {
    console.log("JAMBAR: ")
    totalEventBeats = 0
    
    var track = jamBarTracks[0]
    track.forEach(event => {
      if (event.deltaTime !== undefined) {
        totalEventBeats += (event.deltaTime / midi.header.ticksPerBeat)
      }

      if (event.subtype === "text" && event.text !== undefined) {
        if (event.text.includes("@IMP_PATTERN_SCALE")) {
          var beats = event.deltaTime / midi.header.ticksPerBeat
          var time = timeForBeats(totalEventBeats)
          var arr = event.text.split(':');
          console.log(`jambar key: ${arr[2]} scale: ${arr[1]}; time: ${time}`)
        }
      }
    });
  }



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
