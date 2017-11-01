import { makeStore } from "./StorageFactory";

const Settings = makeStore("Settings");

// COUNTDOWN

export const getCountdownTimerState = async () => {
  const countdown = await Settings.getObj("COUNTDOWN_TIMER_STATE");
  return countdown || false;
};

export const setCountdownTimerState = async bool => {
  await Settings.setObj("COUNTDOWN_TIMER_STATE", bool);
  return bool;
};

// LEFT HAND

export const getLeftHandState = async () => {
  const countdown = await Settings.getObj("LEFT_HAND_STATE");
  return countdown || false;
};

export const setLeftHandState = async bool => {
  await Settings.setObj("LEFT_HAND_STATE", bool);
  return bool;
};

// AUTO PART SWITCHING

export const getAutoPartSwitchingState = async () => {
  const countdown = await Settings.getObj("AUTO_PART_SWITCHING_STATE");
  return countdown || false;
};

export const setAutoPartSwitchingState = async bool => {
  await Settings.setObj("AUTO_PART_SWITCHING_STATE", bool);
  return bool;
};
