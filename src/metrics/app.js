import Mixpanel from "react-native-mixpanel";
var sessionIsActive = false;

// TODO
export const startAppSession = () => {
  sessionIsActive = true;

  Mixpanel.timeEvent("App Session");

  // TODO: do we need all of these with home resetting everything?
  // start tempo
  // start SMART
  // start active parts
  // start connected guitars
  // start guitar count
  // start chords and scales
  // start jam bar
  Mixpanel.flush();
};

// TODO
export const stopAppSession = () => {
  if (sessionIsActive) {
    sessionIsActive = false;
    Mixpanel.track("App Session");

    // stop tempo
    // stop SMART
    // stop active parts
    // stop connected guitars
    // stop guitar count
    // stop chords and scales
    // stop jam bar
    Mixpanel.flush();
  }
};
