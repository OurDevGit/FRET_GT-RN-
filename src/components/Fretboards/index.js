import React from "react";
import { connect } from "react-redux";
import { View } from "react-native";
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
    var boardHeight = supportsMultipleFretboards
      ? deviceWidth * 0.16
      : deviceHeight * 0.44;

    if (visibleTracks.count() === 4) {
      boardHeight = (deviceHeight - 100) / 4;
    }

    const height = supportsMultipleFretboards
      ? boardHeight * visibleTracks.count()
      : boardHeight;
    return (
      <View
        style={{
          width: "100%",
          height: height,
          backgroundColor: "#E6D9B9"
        }}
      >
        {supportsMultipleFretboards
          ? <VerticalContainer
              deviceWidth={deviceWidth}
              tracks={visibleTracks}
            />
          : <HorizontalContainer
              deviceWidth={deviceWidth}
              tracks={tracks}
              currentPage={this.state.selectedIndex}
              onScrollEnd={this.onScrollEnd.bind(this)}
            />}
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
