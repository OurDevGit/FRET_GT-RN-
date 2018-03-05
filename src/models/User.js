import { makeStore } from "./StorageFactory";

const User = makeStore("User");
const birthdateKey = "birthdate";
const levelKey = "level";

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
