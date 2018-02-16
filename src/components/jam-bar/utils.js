import { getCsTypes, getCsKeys, getCsPositions } from "../../models/Patterns";

export const Table = {
  Type: "Type",
  Key: "Key",
  Position: "Position"
};

var types = [];
var keys = [];
var positions = [];

export const loadJamBarData = async () => {
  types = await getCsTypes("Scales");
  keys = await getCsKeys("Scales", "Major");
  positions = await getCsPositions("Scales", "Major", "A");
};

export const getJamBarData = () => {
  return { types, keys, positions };
};
