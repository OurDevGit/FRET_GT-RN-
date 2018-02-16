import Mixpanel from "react-native-mixpanel";

export const recordBirthYear = Year => {
  print("WILL RECORD BIRTHDATE: ", Year);
  //Mixpanel.trackWithProperties("Birth Year", { Year });
};

export const recordExperienceLevel = Level => {
  print("WILL RECORD EXPERIENCE LEVEL: ", Level);
  //Mixpanel.trackWithProperties("Experience Level", { Level });
};
