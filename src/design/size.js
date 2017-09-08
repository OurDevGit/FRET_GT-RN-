import Dimensions from "Dimensions";

export const adjustedFontSize = size => {
  console.log("height", Dimensions.get("window").height);
  const height = Dimensions.get("window").height;
  return height > 600 ? size * 1.5 : size;
};
