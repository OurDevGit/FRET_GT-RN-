import React from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import VerticalContainer from "./HorizontalContainer";
import HorizontalContainer from "./HorizontalContainer";

class FretboardsRoot extends React.PureComponent {
  state = {
    selectedIndex: 0
  };

  render() {
    const { supportsMultipleFretboards, deviceWidth, tracks } = this.props;
    return (
      <View
        style={{ width: "100%", aspectRatio: 4.3, backgroundColor: "#E6D9B9" }}
      >
        {supportsMultipleFretboards
          ? <VerticalContainer
              deviceWidth={deviceWidth}
              tracks={tracks}
              currentPage={this.state.selectedIndex}
              onScrollEnd={this.onScrollEnd.bind(this)}
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
    tracks: state.get("guitarTracks")
  };
};

export default connect(mapStateToProps, null)(FretboardsRoot);
