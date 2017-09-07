import Dimensions from "Dimensions";

export const scaledFontSize = scale => {
  const percentage = scale * 0.02;
  return Dimensions.get("window").width * percentage;
};
