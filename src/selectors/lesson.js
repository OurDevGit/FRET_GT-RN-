import { Map } from "immutable";

const filteredItem = (items, predicate) => {
  return items === undefined ? Map() : Map(items.filter(predicate).first());
};

exports.chapterForTime = (time, items) => {
  return filteredItem(
    items,
    item => item.type === "chapter" && item.begin <= time && item.end >= time
  );
};

exports.markerForTime = (time, items) => {
  return filteredItem(
    items,
    item => item.type === "marker" && item.begin <= time && item.end >= time
  );
};

exports.midiForTime = (time, items) => {
  return filteredItem(items, item => item.begin <= time && item.end >= time);
};
