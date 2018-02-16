import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity } from "react-native";

class ModalButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
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
      this.props.onPress(frame);
    });
  };
}

ModalButton.propTypes = {
  children: PropTypes.array.isRequired,
  onPress: PropTypes.func.isRequired
};

export default ModalButton;
