import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

class PopoverButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        style={this.props.style}
        ref={ref => (this.touchable = ref)}
        onPress={this.handlePress}
      >
        {this.props.children}
      </TouchableOpacity>
    );
  }

  handlePress = () => {
    this.touchable.measure((fx, fy, width, height, px, py) => {
      const frame = { x: px, y: py, width, height };
      this.props.onPress(this.props.popover, frame);
    });
  };
}

PopoverButton.propTypes = {
  style: PropTypes.number.isRequired,
  popover: PropTypes.string.isRequired,
  children: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired
};

export default PopoverButton;
