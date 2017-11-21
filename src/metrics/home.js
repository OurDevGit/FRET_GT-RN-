import Mixpanel from "react-native-mixpanel";
var isShowingHome = false;

// called in Root.js
export const startHomeView = () => {
  Mixpanel.timeEvent("Home View");
  isShowingHome = true;
};

// called in Root.js
export const trackHomeView = () => {
  if (isShowingHome) {
    Mixpanel.track("Home View");
  }

  isShowingHome = false;
};
