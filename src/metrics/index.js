import Mixpanel from "react-native-mixpanel";
export * from "./app";
export * from "./chords-scales-jambar";
export * from "./fretboard";
export * from "./general";
export * from "./guitar";
export * from "./home";
export * from "./media";
export * from "./monetization";
export * from "./playback";

Mixpanel.sharedInstanceWithToken("307997d9f2627bce1d3753f8f2bdf988");

// called in Root.js
export const registerSuperProperties = (mediaId, Title, Artist) => {
  Mixpanel.registerSuperProperties({ mediaId, Title, Artist });
};
