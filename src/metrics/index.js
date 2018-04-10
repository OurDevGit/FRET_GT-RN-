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
export * from "./user";

Mixpanel.sharedInstanceWithToken("f4d7c21c34d1d3642f111062ca91dc1d");

// called in Root.js
export const registerSuperProperties = (mediaId, Title, Artist) => {
  Mixpanel.registerSuperProperties({ mediaId, Title, Artist });
};

export const registerUserSuperProperties = (BirthYear, PlayLevel) => {
  console.log("metrics BirthYear", BirthYear, "PlayLevel", PlayLevel);
  Mixpanel.registerSuperProperties({ BirthYear, PlayLevel });
};
