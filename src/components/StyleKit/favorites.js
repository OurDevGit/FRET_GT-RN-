import React, { PureComponent } from "react";
import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { BtnFavoriteSmall_isPressed } from "./styleKitComponents";
import { ResizingBehavior } from "./lib";
import { toggleFave, getFave } from "../../models/Favorites";

export class BtnHeart extends PureComponent {
  state = {
    isFilled: false
  };

  render() {
    const { mediaId } = this.props;
    return (
      <TouchableOpacity onPress={this.handleTouch}>
        <BtnFavoriteSmall_isPressed
          {...this.props}
          isPressed={this.state.isFilled}
        />
      </TouchableOpacity>
    );
  }

  async componentWillMount() {
    this.setState({
      isFilled: await getFave(this.props.mediaId)
    });
  }

  handleTouch = async () => {
    this.setState({ isFilled: await toggleFave(this.props.mediaId) });
  };
}

BtnHeart.propTypes = {
  mediaId: PropTypes.string.isRequired
};
