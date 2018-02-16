import React from "react";
import Svg, { Defs, G, Path } from "react-native-svg";

const X = () => (
  <Svg width={18} height={16} viewBox="0 0 18 16" version="1.1">
    <Defs />
    <G
      stroke="none"
      strokeWidth="1"
      fill="none"
      fillRule="evenodd"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <G stroke="#000000">
        <Path d="M15.6666667,0.333333333 L0.333333333,15.6666667" />
        <Path d="M15.6666667,15.6666667 L0.333333333,0.333333333" />
      </G>
    </G>
  </Svg>
);

export default X;
