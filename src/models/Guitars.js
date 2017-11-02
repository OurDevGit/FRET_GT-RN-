import { makeStore } from "./StorageFactory";

const Guitars = makeStore("Guitars");

export const getGuitar = async guitarId => {
  return Guitars.getObj(guitarId);
};

export const getAllGuitars = async () => {
  const allKeys = await Guitars.getAllKeys();
  const allObjs = await Guitars.getObjs(allKeys);
  return allObjs;
};

export const setGuitar = async guitar => {
  delete guitar.track;
  try {
    await Guitars.setObj(guitar.id, guitar);
    return true;
  } catch (error) {
    return false;
  }
};
