import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { BtnFavorite_isPressed } from "./styleKitComponents";
import { ResizingBehavior } from "./lib";
import * as actions from "../../redux/actions";

const Heart = BtnFavorite_isPressed;

class BtnHeartWithState extends React.PureComponent {
  render() {
    // console.debug(`BtnHeartWithState render()`);
    return (
      <TouchableOpacity onPress={this.handleTap} style={styles.heart}>
        <Heart
          resizing={ResizingBehavior.AspectFit}
          isPressed={this.props.isFilled}
        />
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
