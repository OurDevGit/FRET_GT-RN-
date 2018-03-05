import Mixpanel from "react-native-mixpanel";

export const recordBirthYear = Year => {
  Mixpanel.trackWithProperties("Birth Year", { Year });
};

export const recordExperienceLevel = Level => {
  Mixpanel.trackWithProperties("Experience Level", { Level });
};
