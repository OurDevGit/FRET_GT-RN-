import { Dimensions } from "react-native";

const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

export const guid = () => {
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
};

export const getIsPhone = () => {
  const width = Dimensions.get("window").width;
  const height = Dimensions.get("window").height;
  const max = Math.max(width, height);
  const min = Math.min(width, height);
  const ratio = max / min;

  const isSmall = width < 1024 || height < 500;
  const isWide = ratio > 1.7;

  const isPhone = isSmall || isWide;

  return isPhone;
};
