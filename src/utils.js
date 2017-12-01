import { Dimensions } from "react-native";

const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

export const guid = () => {
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
};

export const getIsPhone = () => {
  let width = Dimensions.get("window").width;
  let height = Dimensions.get("window").height;
  let max = Math.max(width, height);
  let min = Math.min(width, height);
  let ratio = max / min;

  let isSmall = width < 1024 || height < 500;
  let isWide = ratio > 1.7;

  return isSmall || isWide;
};
