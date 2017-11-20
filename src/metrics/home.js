import Mixpanel from "react-native-mixpanel";

export const startHomeView = () => {
  Mixpanel.timeEvent("Home View");
};

export const trackHomeView = () => {
  Mixpanel.track("Home View");
};
