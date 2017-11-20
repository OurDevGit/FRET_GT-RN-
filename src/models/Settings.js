import { makeStore } from "./StorageFactory";

const Settings = makeStore("Settings");

// COUNTDOWN

export const getCountdownTimerState = async () => {
  const bool = await Settings.getObj("COUNTDOWN_TIMER_STATE");
  return bool || false;
};

export const setCountdownTimerState = async bool => {
  await Settings.setObj("COUNTDOWN_TIMER_STATE", bool);
  return bool;
};

// LEFT HAND

export const getLeftHandState = async () => {
  const bool = await Settings.getObj("LEFT_HAND_STATE");
  return bool || false;
};

export const setLeftHandState = async bool => {
  await Settings.setObj("LEFT_HAND_STATE", bool);
  return bool;
};

// AUTO PART SWITCHING

export const getAutoPartSwitchingState = async () => {
  const bool = await Settings.getObj("AUTO_PART_SWITCHING_STATE");
  return bool || true;
};

export const setAutoPartSwitchingState = async bool => {
  await Settings.setObj("AUTO_PART_SWITCHING_STATE", bool);
  return bool;
};

// NOTATIONS

export const getCurrentNotation = async () => {
  const notation = await Settings.getObj("CURRENT_NOTATION");
  return notation || "Sharps";
};

export const setCurrentNotation = async notation => {
  await Settings.setObj("CURRENT_NOTATION", notation);
  return notation;
};

// TUNING

// "digital" || "audio"
export const getTuningMode = async () => {
  const mode = await Settings.getObj("TUNING_MODE");
  return mode || "digital";
};

export const setTuningMode = async mode => {
  await Settings.setObj("TUNING_MODE", mode);
  return mode;
};
