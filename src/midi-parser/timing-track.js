// returns markers and function to convert ticks to seconds for all other tracks

var abbreviations = [];
const abbreviation = (first, index) => {
  if (index < abbreviations.length) {
    let matchingBelow = abbreviations
      .slice(0, index)
      .filter(name => name === first);
    let matchingAbove = abbreviations
      .slice(index, abbreviations.length)
      .filter(name => name === first);

    if (matchingBelow.length > 0) {
      return first + (matchingBelow.length + 1);
    } else if (matchingAbove.length > 1) {
      return first + "1";
    } else {
      return first;
    }
  } else {
    return first;
  }
};

const timingTrack = (track, header) => {
  var microsecondsPerTick = 0;
  var totalTicks = 0;
  var tempos = [];
  var markers = [];

  const secondsForTicks = ticks => {
    var microseconds = 0;
    var totalTicks = 0;

    for (var i = 0; i < tempos.length; i++) {
      var tempo = tempos[i];

      if (ticks > totalTicks + tempo.ticks) {
        microseconds += tempo.ticks * tempo.rate;
        totalTicks += tempo.ticks;
      } else {
        var diff = ticks - totalTicks;
        microseconds += diff * tempo.rate;
        totalTicks += tempo.ticks;
        break;
      }
    }

    if (ticks > totalTicks) {
      var lastTempo = tempos[tempos.length - 1];
      diff = ticks - totalTicks;
      microseconds += diff * lastTempo.rate;
    }

    return microseconds / 1000000;
  };

  track.forEach((event, index) => {
    if (event.subtype === "timeSignature") {
      var tempo = track[index + 2];
      if (tempo !== undefined && tempo.microsecondsPerTick !== undefined) {
        microsecondsPerTick = tempo.microsecondsPerBeat / header.ticksPerBeat;
      }
    }

    if (event.deltaTime !== undefined) {
      totalTicks += event.deltaTime;
      tempos.push({ rate: microsecondsPerTick, ticks: event.deltaTime });

      if (event.microsecondsPerBeat !== undefined) {
        microsecondsPerTick = event.microsecondsPerBeat / header.ticksPerBeat;
      }
    }

    if (
      event.type === "meta" &&
      event.subtype === "marker" &&
      event.text !== undefined &&
      event.text.includes("FMP -")
    ) {
      var name = event.text.replace("FMP -  ", "").replace("FMP - ", "");
      var time = secondsForTicks(totalTicks);
      markers.push({ name: name, time: time });
      console.log(name, event);
    }
  });

  abbreviations = markers.map(marker => marker.name.charAt(0));

  for (var i = 0; i < markers.length; i++) {
    markers[i].abbreviation = abbreviation(markers[i].name.charAt(0), i);
  }

  return { markers: markers, secondsForTicks: secondsForTicks };
};

export default timingTrack;
