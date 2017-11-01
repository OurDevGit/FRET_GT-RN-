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
