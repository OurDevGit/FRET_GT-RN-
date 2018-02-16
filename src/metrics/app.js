import Mixpanel from "react-native-mixpanel";
import { restartTempo, trackTempo } from "./playback";
import {
  restartSMARTFretboard,
  trackSMARTFretboard,
  startActiveParts,
  trackActiveParts
} from "./fretboard";
import {
  startConnectedGuitars,
  trackConnectedGuitars,
  startGuitarCount,
  trackGuitarCount
} from "./guitar";
import {
  startChordsAndScales,
  trackChordsAndScales,
  startJamBar,
  trackJamBar
} from "./chords-scales-jambar";

var sessionIsActive_ = false;

// called in Root.js
export const startAppSession = () => {
  sessionIsActive_ = true;

  restartTempo();
  restartSMARTFretboard();
  startActiveParts();
  startConnectedGuitars();
  startGuitarCount();
  startChordsAndScales();
  startJamBar();

  Mixpanel.timeEvent("App Session");
  Mixpanel.flush();
};

// called in Root.js
export const stopAppSession = () => {
  if (sessionIsActive_) {
    sessionIsActive_ = false;
    Mixpanel.track("App Session");

    trackTempo();
    trackSMARTFretboard(false);
    trackActiveParts();
    trackConnectedGuitars();
    trackGuitarCount();
    trackChordsAndScales(false);
    trackJamBar(false);
    Mixpanel.flush();
  }
};
