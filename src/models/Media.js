import { makeStore } from "./StorageFactory";

export const GetMediaButtonMode = {
  Purchase: "purchaseMode",
  ComingSoon: "comingSoonMode",
  Download: "downloadMode",
  Downloading: "downloadingMode",
  Indetermindate: "indeterminateMode",
  Play: "playMode"
};

const Faves = makeStore("Media");

export const getFaves = async () => {
  const faves = await Faves.getObj("FAVES");
  return faves || [];
};

export const addFave = async mediaId => {
  const faves = await getFaves();
  if (faves.indexOf(mediaId) === -1) {
    await Faves.setObj("FAVES", [...faves, mediaId]);
  }
};

export const deleteFave = async mediaId => {
  const faves = await getFaves();
  const idx = faves.indexOf(mediaId);

  if (idx !== -1) {
    const newFaves = faves.filter(fave => fave !== mediaId);
    await Faves.setObj("FAVES", newFaves);
  }
};
