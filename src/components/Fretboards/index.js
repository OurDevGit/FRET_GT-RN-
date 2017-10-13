import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View } from "react-native";
import { List, Map } from "immutable";
import Dimensions from "Dimensions";
import VerticalContainer from "./VerticalContainer";
import HorizontalContainer from "./HorizontalContainer";

class FretboardsRoot extends React.PureComponent {
  state = {
    selectedIndex: 0
  };

  render() {
    const {
      isVideo,
      isVisible,
      deviceWidth,
      deviceHeight,
      supportsMultipleFretboards,
      tracks,
      visibleTracks
    } = this.props;

    const isPhone = Dimensions.get("window").height < 500;

    // empty tracks (mainly for video)
    var boardTracks = List([Map({ name: "" })]);

    if (isVisible) {
      // applying visible tracks for tablet on audio
      if (supportsMultipleFretboards && visibleTracks.count() > 0) {
        boardTracks = visibleTracks;
      }
      // applying tracks for phone on audio
      if (!supportsMultipleFretboards && tracks.count() > 0) {
        boardTracks = tracks;
      }
    }

    boardTracks = List([
      { name: "Guitar 1" },
      { name: "Guitar 2" },
      { name: "Guitar 3" },
      { name: "Guitar 4" }
    ]);

    var boardHeight = supportsMultipleFretboards
      ? deviceWidth * 0.17
      : isVideo ? deviceWidth * 0.18 : deviceWidth * 0.23;

    if (visibleTracks.count() === 4) {
      boardHeight = (deviceHeight - 110) / 4;
    }

    const height = supportsMultipleFretboards
      ? boardHeight * boardTracks.count()
      : boardHeight;

    return (
      <View
        style={{
          width: "100%",
          height: isVisible ? height : 0,
          backgroundColor: "#E6D9B9"
        }}
      >
        {supportsMultipleFretboards ? (
          <VerticalContainer
            isVideo={isVideo}
            isPhone={isPhone}
            deviceWidth={deviceWidth}
            tracks={boardTracks}
          />
        ) : (
          <HorizontalContainer
            isVideo={isVideo}
            isPhone={isPhone}
            deviceWidth={deviceWidth}
            tracks={boardTracks}
            currentPage={this.state.selectedIndex}
            onScrollEnd={this.onScrollEnd.bind(this)}
            onPage={this.handlePagePress.bind(this)}
          />
        )}
      </View>
    );
  }

  onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let page = Math.round(contentOffset.x / viewSize.width);
    this.setState({ selectedIndex: page });
  }

  handlePagePress(page) {
    this.setState({ selectedIndex: page });
  }
}

const mapStateToProps = state => {
  return {
    tracks: state.get("guitarTracks"),
    visibleTracks: state.get("visibleTracks")
  };
};

FretboardsRoot.propTypes = {
  isVideo: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  deviceWidth: PropTypes.number.isRequired,
  deviceHeight: PropTypes.number.isRequired,
  supportsMultipleFretboards: PropTypes.bool.isRequired,
  tracks: PropTypes.object,
  visibleTracks: PropTypes.object
};

export default connect(mapStateToProps, null)(FretboardsRoot);
