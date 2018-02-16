import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";
import { PrimaryBlue } from "../../design";
import { isEqual } from "lodash";

const lengthForHeight = h => {
  const hypot = h * Math.cos(Math.PI / 4);
  return hypot;
};

class Marker extends React.Component {
  state = {
    width: 0,
    isDown: false
  };

  render() {
    const { marker, left } = this.props;
    const adjustedLeft = left - (this.state.width - 30) / 2;
    return (
      <View
        key={marker.name}
        style={{
          position: "absolute",
          top: 0,
          left: adjustedLeft,
          height: "100%",
          alignItems: "center",
          opacity: this.state.isDown ? 0.4 : 1.0
        }}
        pointerEvents="box-none"
        onLayout={this.handleLayout}
      >
        {this.state.width > 0 && (
          <View
            style={{ width: 2, height: 15, backgroundColor: PrimaryBlue }}
          />
        )}

        <View
          style={{
            width: lengthForHeight(this.props.height) * 2,
            height: 25,
            transform: [
              { translateX: 5 },
              { translateY: this.props.height < 125 ? -5 : 0 },
              { rotate: "-45deg" }
            ]
          }}
          pointerEvents="box-none"
        >
          <View
            style={{
              width: lengthForHeight(this.props.height),
              height: 25,
              flexDirection: "row",
              justifyContent: "flex-end"
            }}
          >
            <Text
              onStartShouldSetResponder={() => true}
              onResponderGrant={() => this.handlePressDown()}
              onResponderRelease={() => this.handlePressUp()}
              onResponderTerminate={() => this.handlePressUp()}
              style={{
                maxWidth: lengthForHeight(this.props.height),
                fontSize: 17,
                color: `rgba(0, 0, 0, ${this.state.width === 0 ? 0.0 : 1.0})`,
                textAlign: "right"
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {marker.name}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !isEqual(nextProps.marker, this.props.marker) ||
      !isEqual(nextProps.left, this.props.left) ||
      !isEqual(nextProps.end, this.props.end) ||
      !isEqual(nextState.width, this.state.width)
    );
  }

  handlePressDown = () => {
    const { marker, end, onMarkerLongPress } = this.props;
    this.setState({ isDown: true });

    setTimeout(() => {
      if (this.state.isDown) {
        this.setState({ isDown: false });
        onMarkerLongPress(marker.time, end, marker.name);
      }
    }, 850);
  };

  handlePressUp = () => {
    const { marker, onMarkerPress } = this.props;

    if (this.state.isDown) {
      this.setState({ isDown: false });
      onMarkerPress(marker.time, marker.name);
    }
  };

  handleLayout = e => {
    this.setState({
      width: Math.round(e.nativeEvent.layout.width)
    });
  };
}

Marker.propTypes = {
  marker: PropTypes.object.isRequired,
  left: PropTypes.number.isRequired,
  end: PropTypes.number.isRequired,
  onMarkerPress: PropTypes.func.isRequired,
  onMarkerLongPress: PropTypes.func.isRequired,
  height: PropTypes.number.isRequired
};

export default Marker;
