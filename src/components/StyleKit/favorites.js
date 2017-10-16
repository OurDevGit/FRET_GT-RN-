import React, { PureComponent } from "react";
import { TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { gtPcSizeable } from "./lib";
import { BtnFavorite_targetFrame_resizing_isPressed } from "./styleKitComponents";
import { ResizingBehavior } from "./lib";
import { toggleFave, getFave } from "../../models/Favorites";

export class BtnHeart extends PureComponent {
  state = {
    isFilled: false
  };

  render() {
    const { mediaId } = this.props;
    const Comp = gtPcSizeable(BtnFavorite_targetFrame_resizing_isPressed);

    return (
      <TouchableOpacity onPress={this.handleTouch}>
        <Comp
          {...this.props}
          resizing={ResizingBehavior.AspectFit}
          isPressed={this.state.isFilled}
        />
      </TouchableOpacity>
    );
  }

  async componentWillMount() {
    // TODO: this is causing warnings about updating unmounted components.
    // I want to move this to be Props-driven for the table anyway...
    // this.setState({
    //   isFilled: await getFave(this.props.mediaId)
    // });
  }

  handleTouch = async () => {
    this.setState({ isFilled: await toggleFave(this.props.mediaId) });
  };
}

BtnHeart.propTypes = {
  mediaId: PropTypes.string.isRequired
};
