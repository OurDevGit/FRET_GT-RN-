import { Dimensions } from "react-native";

const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);

export const guid = () => {
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4() + s4() + s4()}`;
};

export const getIsPhone = () => {
  return Dimensions.get("window").height < 500;
};
