import { makeStore } from "./StorageFactory";
import { guid } from "./utils";

const Loops = makeStore("Loops");

export const getLoops = async mediaId => {
  const loops = await Loops.getObj(mediaId);
  if (loops === null) {
    return [];
  } else {
    return loops.sort((a, b) => a.begin - b.begin);
  }
};

export const createOrUpdateLoop = async (loop, mediaId) => {
  const loops = await getLoops(mediaId);
  if (loop.id === undefined) {
    let updated = [...loops, { id: guid(), mediaId: mediaId, ...loop }];
    await Loops.setObj(mediaId, updated);
    return updated.sort((a, b) => a.begin - b.begin);
  } else {
    const index = loops.findIndex(item => item.id === loop.id);
    loops[index] = loop;
    await Loops.setObj(mediaId, loops);
    return loops.sort((a, b) => a.begin - b.begin);
  }
};

export const deleteLoop = async (loop, mediaId) => {
  var loops = await getLoops(mediaId);
  console.log("deleting", loops);
  console.log("loop", loop);
  const index = loops.findIndex(item => item.id === loop.id);
  loops.splice(index, 1);
  console.log("deleting", index, loops);

  await Loops.setObj(mediaId, loops);
  return loops.sort((a, b) => a.begin - b.begin);
};
