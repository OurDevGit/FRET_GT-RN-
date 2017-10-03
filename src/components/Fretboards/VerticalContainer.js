import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View } from "react-native";
import PageControl from "react-native-page-control";
import Fretboard from "./Fretboard";

const keyExtractor = (item, index) => index;
const emptyTrack = { name: undefined, isBass: false };

class VerticalContainer extends React.Component {
  state = {
    height: 0,
    width: 0
  };

  render() {
    return (
      <View
        style={{ flex: 1, flexDirection: "column", backgroundColor: "#E6D9B9" }}
        onLayout={this.handleLayout.bind(this)}
      >
        {this.fretboards()}
      </View>
    );
  }

  fretboards() {
    return this.props.tracks.map(track => {
      return (
        <Fretboard
          isPhone={this.props.isPhone}
          key={track.get("name")}
          showSmart={track.get("name") !== "" && !this.props.isVideo}
          track={track.toJS()}
          isSmart={false}
          boardWidth={this.state.width}
          style={{
            flex: 1,
            width: this.state.width,
            height: this.state.height,
            paddingTop: this.props.tracks.count() < 4 ? "0.5%" : 0,
            paddingBottom: this.props.tracks.count() < 4 ? "1%" : 6,
            paddingHorizontal: "1%"
          }}
        />
      );
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !this.props.tracks.equals(nextProps.tracks) ||
      nextProps.tracks.count() === 0 ||
      this.state.width === 0
    );
  }

  handleLayout(e) {
    this.setState({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width
    });
  }
}

VerticalContainer.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  isVideo: PropTypes.bool.isRequired,
  deviceWidth: PropTypes.number.isRequired,
  tracks: PropTypes.object
};

export default VerticalContainer;
