import React from "react";
import PropTypes from "prop-types";
import Svg, { G, Rect, Polyline } from "react-native-svg";
import { StoreDark, LibraryDark } from "../../design/colors";

export const UpArrow = ({ enabled, store }) => (
  <Svg width={90} height={24}>
    <G fill="none" fillRule="evenodd">
      <Rect
        fill={store ? StoreDark : LibraryDark}
        x="0"
        y="0"
        width="90"
        height="24"
      />
      <Polyline
        stroke={enabled ? "white" : "silver"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="28 17 45 6 62 17"
      />
    </G>
  </Svg>
);

UpArrow.propTypes = {
  enabled: PropTypes.bool.isRequired,
  store: PropTypes.bool.isRequired
};

export const DownArrow = ({ enabled, store }) => (
  <Svg width={90} height={24}>
    <G fill="none" fillRule="evenodd">
      <Rect
        id="btnPageDown-rectangle"
        fill={store ? StoreDark : LibraryDark}
        fillRule="nonzero"
        x="0"
        y="0"
        width="90"
        height="24"
      />
      <Polyline
        id="btnPageDown-bezier"
        stroke={enabled ? "white" : "silver"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points="28 7 45 18 62 7"
      />
    </G>
  </Svg>
);

DownArrow.propTypes = {
  enabled: PropTypes.bool.isRequired,
  store: PropTypes.bool.isRequired
};
