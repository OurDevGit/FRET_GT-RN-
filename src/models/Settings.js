import { makeStore } from "./StorageFactory";

const Settings = makeStore("Settings");

// COUNTDOWN

export const getCountdownState = async () => {
  const countdown = await Settings.getObj("COUNTDOWN");
  return countdown || false;
};

export const setCountdownState = async bool => {
  await Settings.setObj("COUNTDOWN", bool);
  return bool;
};
