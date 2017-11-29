import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "../../redux/actions";
import Svg, { Path } from "react-native-svg";

const Heart = ({ isPressed }) => (
  <Svg height="44" width="44">
    {isPressed === true ? (
      <Path
        id="btnFavorite-selected"
        stroke="rgb(234, 24, 109)"
        stroke-width="1"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        fill="rgb(234, 24, 109)"
        d="M 21.43,35.31 C 21.43,35.31 33.3,26.13 33.3,17.43 33.3,8.74 22.77,8.07 21.43,16.76 20.1,8.07 9.57,8.74 9.57,18.1 9.57,27.46 21.43,35.31 21.43,35.31 L 21.43,35.31 Z M 21.43,35.31"
      />
    ) : (
      <Path
        id="btnFavorite-bezier"
        stroke="rgb(234, 24, 109)"
        stroke-width="1"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        fill="none"
        d="M 21.43,35.31 C 21.43,35.31 33.3,26.13 33.3,17.43 33.3,8.74 22.77,8.07 21.43,16.76 20.1,8.07 9.57,8.74 9.57,18.1 9.57,27.46 21.43,35.31 21.43,35.31 L 21.43,35.31 Z M 21.43,35.31"
      />
    )}
  </Svg>
);

Heart.propTypes = {
  isPressed: PropTypes.bool.isRequired
};

class BtnHeartWithState extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={this.handleTap} style={styles.heart}>
        <Heart isPressed={this.props.isFilled} />
      </TouchableOpacity>
    );
  }

  handleTap = () => {
    this.props.toggleFavorite(this.props.mediaId);
  };
}

BtnHeartWithState.propTypes = {
  isFilled: PropTypes.bool,
  mediaId: PropTypes.string.isRequired,
  toggleFavorite: PropTypes.func
};

const mapStateToPropsForHeart = (state, props) => {
  return {
    isFilled: state.get("favorites").includes(props.mediaId)
  };
};

export const BtnHeartSmart = connect(mapStateToPropsForHeart, actions)(
  BtnHeartWithState
);

BtnHeartSmart.propTypes = {
  isFilled: PropTypes.bool,
  mediaId: PropTypes.string.isRequired,
  toggleFavorite: PropTypes.func
};

const styles = StyleSheet.create({
  heart: {
    width: 40,
    height: 40
  }
});
