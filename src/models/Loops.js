import { makeStore } from "./StorageFactory";
import { guid } from "./utils";

const Loops = makeStore("Loops");

export const getLoops = async mediaId => {
  const loops = await Loops.getObj(mediaId);
  if (loops === null) {
    return [];
  } else {
    return loops.sort((a, b) => a.begin < b.begin);
  }
};

export const createOrUpdateLoop = async (loop, mediaId) => {
  const loops = getLoops(mediaId);
  if (loop.id === undefined) {
    let updated = [...loops, { id: guid(), ...loop }];
    await Loops.setObj(mediaId, updated);
    return updated.sort((a, b) => a.begin < b.begin);
  } else {
    const index = loops.findIndex(item => item.id === loop.id);
    loops[index] = loop;
    await Loops.setObj(mediaId, loops);
    return loops.sort((a, b) => a.begin < b.begin);
  }
};

export const deleteLoop = async (loop, mediaId) => {
  const loops = getLoops(mediaId);
  const index = loops.findIndex(item => item.id === loop.id);
  const updated = loops.splice(index, 1);

  await Loops.setObj(mediaId, updated);
  return updated.sort((a, b) => a.begin < b.begin);
};
