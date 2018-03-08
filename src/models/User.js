import { makeStore } from "./StorageFactory";

//getViewedAppVersion,
//setViewedAppVersion

const User = makeStore("User");
const birthdateKey = "birthdate";
const levelKey = "level";
const appVersionKey = "appVersion";

export const getUserBirthdate = async () => {
  const birthdate = await User.getObj(birthdateKey);
  if (birthdate === null) {
    return undefined;
  } else {
    return birthdate;
  }
};

export const getUserLevel = async () => {
  const level = await User.getObj(levelKey);
  if (level === null) {
    return undefined;
  } else {
    return level;
  }
};

export const setUserBirthdate = async birthdate => {
  await User.setObj(birthdateKey, birthdate);
  return birthdate;
};

export const setUserLevel = async level => {
  await User.setObj(levelKey, level);
  return level;
};

export const getViewedAppVersion = async () => {
  const version = await User.getObj(appVersionKey);
  if (version === null) {
    return undefined;
  } else {
    return version;
  }
};

export const setViewedAppVersion = async version => {
  await User.setObj(appVersionKey, version);
  return version;
};
