import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import Dimensions from "Dimensions";
import { Provider, connect } from "react-redux";
import AdContainer from "./AdContainer";
import Playback from "./Playback";
import FretboardsContainer from "./Fretboards";
import TrackSelector from "./TrackSelector";
import Store from "./Store";
import { BtnLibrary } from "./StyleKit";
import { getMediaForPlay } from "../redux/selectors";

class Root extends Component {
  state = {
    song: null,
    video: null,
    showAd: true,
    showFretboards: true,
    isShowingStore: false,
    layout: { width: 1, height: 1 }
  };

  render() {
    const { store, visibleTracks } = this.props;
    const aspectRatio = this.state.layout.width / this.state.layout.height;

    var availableFretboardCount = 1;
    if (this.state.layout.width) {
      if (aspectRatio < 1.6) {
        availableFretboardCount = 4;
      }
    }

    const isVideo = this.state.video !== null;
    const trackCount = visibleTracks !== undefined ? visibleTracks.count() : 0;
    const showLibraryButton = this.state.showAd && trackCount < 4;

    return (
      <Provider store={store}>
        <View
          style={{ backgroundColor: "white", flexGrow: 1 }}
          onLayout={this.handleLayout}
        >
          {this.state.isShowingStore && (
            <Store onClose={this.handleCloseStore} />
          )}
          {this.state.showAd && <AdContainer />}
          <Playback
            song={this.state.song}
            video={this.state.video}
            visibleTracks={this.props.visibleTracks}
            onToggleLibrary={this.handleToggleLibrary}
            onToggleAd={this.handleToggleAd}
            onToggleFretboards={this.handleToggleFretboards}
            onClearMedia={this.handleClearMedia}
          />

          {(this.state.song !== null || this.state.video !== null) && (
            <FretboardsContainer
              isVideo={isVideo}
              isVisible={this.state.showFretboards}
              deviceWidth={this.state.layout.width}
              deviceHeight={this.state.layout.height}
              availableFretboardCount={availableFretboardCount}
            />
          )}

          {showLibraryButton && (
            <View style={{ position: "absolute", right: 30, top: 5 }}>
              {!this.state.isShowingStore && (
                <BtnLibrary
                  color={"#FFFFFF"}
                  onPress={this.handleToggleLibrary}
                />
              )}
            </View>
          )}

          {availableFretboardCount > 1 &&
            this.state.showFretboards && (
              <TrackSelector max={availableFretboardCount} />
            )}
        </View>
      </Provider>
    );
  }

  async componentDidUpdate(prevProps) {
    // hide the store when selecting new Current Media
    if (this.props.currentMedia !== null) {
      if (prevProps.currentMedia !== this.props.currentMedia) {
        if (this.props.mediaForPlay.id !== undefined) {
          var song = null;
          var video = null;

          if (this.props.mediaForPlay.isSong === true) {
            song = this.props.mediaForPlay;
          } else if (this.props.mediaForPlay.isVideo === true) {
            video = this.props.mediaForPlay;
          }

          const newState = {
            isShowingStore: false,
            song,
            video
          };
          this.setState(newState);
        }
      }
    }
  }

  handleCloseStore = () => {
    this.setState({
      isShowingStore: false
    });
  };

  handleToggleLibrary = () => {
    console.debug("toggle lib press");
    this.setState({
      isShowingStore: true
    });
  };

  handleClearMedia = () => {
    this.setState({
      song: null,
      video: null,
      showAd: true
    });
  };

  handleToggleAd = bool => {
    this.setState({ showAd: bool });
  };

  handleToggleFretboards = bool => {
    if (bool === undefined) {
      this.setState({ showFretboards: !this.state.showFretboards });
    } else {
      this.setState({ showFretboards: bool });
    }
  };

  handleLayout = e => {
    this.setState({
      layout: { ...e.nativeEvent.layout }
    });
  };
}

Root.propTypes = {
  visibleTracks: PropTypes.object,
  store: PropTypes.object,
  currentMedia: PropTypes.string,
  mediaForPlay: PropTypes.object
};

const mapStateToProps = state => {
  const currentMedia = state.get("currentMedia");
  const mediaForPlay = getMediaForPlay(state, currentMedia).toJS();
  return {
    currentMedia,
    mediaForPlay,
    visibleTracks: state.get("visibleTracks")
  };
};

export default connect(mapStateToProps)(Root);
