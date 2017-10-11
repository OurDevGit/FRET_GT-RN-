import React, { Component } from "react";
import { View, Button, Text } from "react-native";
import Dimensions from "Dimensions";
import { Provider, connect } from "react-redux";
import AdContainer from "./AdContainer";
import Playback from "./Playback";
import FretboardsContainer from "./Fretboards";
import Library from "./Library";
import TrackSelector from "./TrackSelector";
import { getDownload } from "../models/Downloads";
import { getMediaForPlay } from "../redux/selectors";

import testSongs from "../testSongs";
import testVideos from "../testVideos";

import Store from "./Store";

import { BtnLibrary } from "./StyleKit";

const testMedia = [...testVideos, ...testSongs];

const _doTestLibrary = true;

class Root extends Component {
  state = {
    libIsOpen: false,
    song: null,
    video: null,
    showAd: true,
    showFretboards: true,
    isShowingStore: false,
    layout: { width: 1, height: 1 }
  };

  render() {
    const { store, trackCount } = this.props;
    const aspectRatio = this.state.layout.width / this.state.layout.height;
    const supportsMultipleFretboards =
      this.state.layout.width > 1 && aspectRatio < 1.6;
    const isVideo = this.state.song === null;

    return (
      <Provider store={store}>
        <View
          style={{ backgroundColor: "white", flexGrow: 1 }}
          onLayout={this.handleLayout}
        >
          {this.state.isShowingStore && <Store />}
          {this.state.showAd && <AdContainer />}
          <Playback
            song={this.state.song}
            video={this.state.video}
            trackCount={this.props.trackCount}
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

          <Library
            isOpen={this.state.libIsOpen}
            onSelect={this.handleSelectMedia}
            media={testMedia}
          />

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

  async componentDidUpdate(prevProps, prevState) {
    // hide the store when selecting new Current Media
    if (this.props.currentMedia !== null) {
      if (prevProps.currentMedia !== this.props.currentMedia) {
        const song =
          this.props.mediaForPlay.id !== undefined
            ? this.props.mediaForPlay
            : null;

        this.setState({
          isShowingStore: false,
          song
        });
      }
    }
  }

  handleToggleLibrary = () => {
    if (_doTestLibrary) {
      this.setState({
        libIsOpen: !this.state.libIsOpen
      });
    } else {
      this.setState({
        isShowingStore: true
      });
    }
  };

  handleSelectMedia = mediaIndex => {
    const media = testMedia[mediaIndex];
    const isPhone = Dimensions.get("window").height < 500;
    if (media.type === "song") {
      this.setState({
        libIsOpen: false,
        song: media,
        video: null,
        showAd: true
      });
    } else if (media.type === "video") {
      this.setState({
        libIsOpen: false,
        song: null,
        video: media,
        showAd: !isPhone
      });
    }
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

const mapStateToProps = (state, ownProps) => {
  const currentMedia = state.get("currentMedia");
  const mediaForPlay = getMediaForPlay(state, currentMedia).toJS();
  return {
    currentMedia,
    mediaForPlay,
    trackCount: state.get("visibleTracks").count()
  };
};

export default connect(mapStateToProps)(Root);
