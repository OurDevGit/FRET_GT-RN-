import React from "react";
import { connect } from "react-redux";
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
      supportsMultipleFretboards,
      deviceWidth,
      deviceHeight,
      tracks,
      visibleTracks
    } = this.props;

    const isPhone = Dimensions.get("window").height < 500;

    // empty tracks (mainly for video)
    var boardTracks = List([Map({ name: "" })]);

    // applying visible tracks for tablet on audio
    if (supportsMultipleFretboards && visibleTracks.count() > 0) {
      boardTracks = visibleTracks;
    }
    // applying tracks for phone on audio
    if (!supportsMultipleFretboards && tracks.count() > 0) {
      boardTracks = tracks;
    }

    var boardHeight = supportsMultipleFretboards
      ? deviceWidth * 0.17
      : deviceWidth * 0.23;

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
          height: height,
          backgroundColor: "#E6D9B9"
        }}
      >
        {supportsMultipleFretboards ? (
          <VerticalContainer
            isPhone={isPhone}
            deviceWidth={deviceWidth}
            tracks={boardTracks}
          />
        ) : (
          <HorizontalContainer
            isPhone={isPhone}
            deviceWidth={deviceWidth}
            tracks={boardTracks}
            currentPage={this.state.selectedIndex}
            onScrollEnd={this.onScrollEnd.bind(this)}
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
}

const mapStateToProps = state => {
  return {
    tracks: state.get("guitarTracks"),
    visibleTracks: state.get("visibleTracks")
  };
};

export default connect(mapStateToProps, null)(FretboardsRoot);
