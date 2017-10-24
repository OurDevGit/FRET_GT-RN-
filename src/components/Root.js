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
    const supportsMultipleFretboards =
      this.state.layout.width > 1 && aspectRatio < 1.6;
    const isVideo = this.state.video !== null;
    const trackCount = visibleTracks !== undefined ? visibleTracks.count() : 0;

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
              supportsMultipleFretboards={supportsMultipleFretboards}
            />
          )}

          {this.state.showAd &&
            trackCount < 4 && (
              <View style={{ position: "absolute", right: 30, top: 5 }}>
                {!this.state.isShowingStore && (
                  <BtnLibrary
                    style={{
                      marginLeft: 10,
                      marginTop: 10,
                      width: 40,
                      height: 40
                    }}
                    color={"#FFFFFF"}
                    onPress={this.handleToggleLibrary}
                  />
                )}
              </View>
            )}

          {supportsMultipleFretboards &&
            this.state.showFretboards && <TrackSelector />}
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

  handleToggleFretboards = () => {
    this.setState({ showFretboards: !this.state.showFretboards });
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
