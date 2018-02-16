import { List, Map } from "immutable";

export default (track, secondsForTicks) => {
  var patterns = List();
  var totalTicks = 0;

  track.forEach(event => {
    if (event.deltaTime !== undefined) {
      totalTicks += event.deltaTime;
    }

    if (event.subtype === "text" && event.text !== undefined) {
      if (event.text.includes("@IMP_PATTERN_SCALE")) {
        var arr = event.text.split(":");
        let key = arr[2];
        let type = toTitleCase(arr[1]);
        var begin = secondsForTicks(totalTicks);
        patterns = patterns.push(Map({ key, type, begin }));
      }
    }
  });

  return patterns;
};

const toTitleCase = str => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
