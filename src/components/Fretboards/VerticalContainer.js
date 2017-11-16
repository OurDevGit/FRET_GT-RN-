import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View } from "react-native";
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
      const fretRange = track.get("lastFret") - track.get("firstFret");
      const showSmart =
        track.get("name") !== "" && !this.props.isVideo && fretRange < 12;
      return (
        <Fretboard
          key={track.get("name")}
          isPhone={this.props.isPhone}
          leftHandState={this.props.leftHandState}
          currentNotation={this.props.currentNotation}
          showSmart={showSmart}
          track={track.toJS()}
          isSmart={false}
          boardWidth={this.state.width}
          trackIndex={-1}
          scrollIndex={-1}
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
      this.props.currentNotation !== nextProps.currentNotation ||
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
  leftHandState: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  deviceWidth: PropTypes.number.isRequired,
  tracks: PropTypes.object
};

export default VerticalContainer;
