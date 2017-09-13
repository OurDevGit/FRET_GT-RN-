import Dimensions from "Dimensions";
import PixelRatio from "PixelRatio";

export const adjustedFontSize = size => {
  const width = Math.round(Dimensions.get("window").width);
  const height = Math.round(Dimensions.get("window").height);

  const scale = PixelRatio.getFontScale();
  const pd = PixelRatio.get();
  console.log(`width: ${width}; height: ${height}; scale: ${scale}; pd: ${pd}`);

  return height > 600 ? size * 1 : size;
};
