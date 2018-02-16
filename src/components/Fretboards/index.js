import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import * as actions from "../../redux/actions";
import { View, StyleSheet } from "react-native";
import { List, Map } from "immutable";
import { onlyUpdateForKeys } from "recompose";
import VerticalContainer from "./VerticalContainer";
import HorizontalContainer from "./HorizontalContainer";
import { getIsPhone } from "../../utils";
import { updateActiveParts } from "../../metrics";
import PageControl from "./PageControl";

class FretboardsRoot extends React.PureComponent {
  render() {
    const {
      isVideo,
      isVisible,
      leftHandState,
      currentNotation,
      deviceWidth,
      deviceHeight,
      availableFretboardCount,
      tracks,
      visibleTracks
    } = this.props;
    const isPhone = getIsPhone();

    // empty tracks (mainly for video)
    var boardTracks = List([Map({ name: "" })]);
    const isShowingScroller = availableFretboardCount === 1;

    if (isVisible) {
      // applying visible tracks for tablet on audio
      if (!isShowingScroller && visibleTracks.count() > 0) {
        boardTracks = visibleTracks;
      }
      // applying tracks for phone on audio
      if (isShowingScroller && tracks.count() > 0) {
        boardTracks = tracks;
      }
    }

    var boardHeight = !isShowingScroller
      ? deviceWidth * 0.19
      : isVideo ? deviceWidth * 0.19 : deviceWidth * 0.24;

    if (visibleTracks.count() === 3) {
      boardHeight = (deviceHeight - 200) / 3;
    }

    if (visibleTracks.count() === 4) {
      boardHeight = (deviceHeight - 110) / 4;
    }

    const height = !isShowingScroller
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
        {isShowingScroller ? (
          <HorizontalContainer
            isVideo={isVideo}
            isPhone={isPhone}
            leftHandState={leftHandState}
            currentNotation={currentNotation}
            deviceWidth={deviceWidth}
            tracks={boardTracks}
            ref={ref => (this.horizontalContainer = ref)}
            onScrollEnd={this.onScrollEnd.bind(this)}
            onPage={this.handlePagePress.bind(this)}
          />
        ) : (
          <VerticalContainer
            isVideo={isVideo}
            isPhone={isPhone}
            leftHandState={leftHandState}
            currentNotation={currentNotation}
            deviceWidth={deviceWidth}
            boardHeight={boardHeight}
            tracks={boardTracks}
          />
        )}

        {isShowingScroller && (
          <PageControl
            style={styles.pageControl}
            indicatorStyle={styles.indicator}
            count={this.props.tracks.count()}
            offColor="gray"
            onColor="white"
            ref={ref => (this.pageControl = ref)}
            onPage={this.handlePagePress.bind(this)}
          />
        )}
      </View>
    );
  }

  componentWillUpdate(nextProps) {
    if (
      this.pageControl !== undefined &&
      this.horizontalContainer !== undefined
    ) {
      this.pageControl.setJamBar(nextProps.isShowingJamBar);
      this.horizontalContainer.setJamBar(nextProps.isShowingJamBar);
    }
  }

  onScrollEnd(e) {
    if (this.props.tracks.count() > 0) {
      let contentOffset = e.nativeEvent.contentOffset;
      let viewSize = e.nativeEvent.layoutMeasurement;

      // Divide the horizontal offset by the width of the view to see which page is visible
      let page = Math.round(contentOffset.x / viewSize.width);
      this.pageControl.setPage(page);
      const track = this.props.tracks.get(page);

      if (track !== undefined) {
        updateActiveParts([track.name]);
        this.checkForAutoPartSwitching(track);
      }
    }
  }

  handlePagePress(page) {
    if (this.props.tracks.count() > 0) {
      this.pageControl.setPage(page);
      this.horizontalContainer.setPage(page);
      const track = this.props.tracks.get(page);

      if (track !== undefined) {
        updateActiveParts([track.name]);
        this.checkForAutoPartSwitching(track);
      }
    }
  }

  checkForAutoPartSwitching(track) {
    if (this.props.autoPartSwitchingState) {
      this.props.assignAllGuitars(track.get("name"));
    }
  }
}

const styles = StyleSheet.create({
  pageControl: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 7
  },
  indicator: {
    marginLeft: 5,
    marginRight: 5,
    width: 8,
    height: 8,
    borderRadius: 5
  }
});

const mapStateToProps = state => {
  return {
    tracks: state.get("guitarTracks"),
    visibleTracks: state.get("visibleTracks"),
    leftHandState: state.get("leftHandState"),
    currentNotation: state.get("currentNotation"),
    isShowingJamBar: state.get("isShowingJamBar"),
    autoPartSwitchingState: state.get("autoPartSwitchingState")
  };
};

FretboardsRoot.propTypes = {
  tracks: PropTypes.object,
  visibleTracks: PropTypes.object,
  isVideo: PropTypes.bool.isRequired,
  isVisible: PropTypes.bool.isRequired,
  autoPartSwitchingState: PropTypes.bool.isRequired,
  leftHandState: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  deviceWidth: PropTypes.number.isRequired,
  deviceHeight: PropTypes.number.isRequired,
  availableFretboardCount: PropTypes.number.isRequired,
  updateVisibleTracks: PropTypes.func.isRequired,
  assignAllGuitars: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(
  onlyUpdateForKeys([
    "tracks",
    "visibleTracks",
    "isVisible",
    "leftHandState",
    "currentNotation",
    "isShowingJamBar"
  ])(FretboardsRoot)
);
