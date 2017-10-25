import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { gtPcSizeable } from "./lib";
import { BtnFavorite_targetFrame_resizing_isPressed } from "./styleKitComponents";
import { ResizingBehavior } from "./lib";
import * as actions from "../../redux/actions";

const Heart = gtPcSizeable(BtnFavorite_targetFrame_resizing_isPressed);

class BtnHeartWithState extends React.PureComponent {
  render() {
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
  mediaId: PropTypes.string.isRequired
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
  mediaId: PropTypes.string.isRequired
};

const styles = StyleSheet.create({
  heart: {
    width: 40,
    height: 40
  }
});
