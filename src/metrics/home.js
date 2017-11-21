import Mixpanel from "react-native-mixpanel";

// TODO
export const startHomeView = () => {
  Mixpanel.timeEvent("Home View");
};

// TODO
export const trackHomeView = () => {
  Mixpanel.track("Home View");
};
