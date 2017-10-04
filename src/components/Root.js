import React, { Component } from "react";
import { View, Button, Text } from "react-native";
import { Provider, connect } from "react-redux";
import AdContainer from "./AdContainer";
import Playback from "./Playback";
import FretboardsContainer from "./Fretboards";
import Library from "./Library";
import TrackSelector from "./TrackSelector";

import testSongs from "../testSongs";
import testVideos from "../testVideos";

// import RealmTester from "./RealmTester";
// import Store from "./Store";

import { BtnLibrary } from "./StyleKit";

const testMedia = [...testVideos, ...testSongs];

class Root extends Component {
  state = {
    libIsOpen: false,
    song: null,
    video: null,
    showAd: true,
    showFretboards: true,
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
          {/* <Store testProp="test 1" /> */}
          {/* <RealmTester />  */}
          {this.state.showAd && (
            <AdContainer onToggleLibrary={this.handleToggleLibrary} />
          )}
          <Playback
            song={this.state.song}
            video={this.state.video}
            trackCount={this.props.trackCount}
            onToggleLibrary={this.handleToggleLibrary}
            onToggleAd={this.handleToggleAd}
            onToggleFretboards={this.handleToggleFretboards}
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
            <View style={{ position: "absolute", left: 5, top: 5 }}>
              {!this.state.libIsOpen && (
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

          {supportsMultipleFretboards && <TrackSelector />}
        </View>
      </Provider>
    );
  }

  handleToggleLibrary = () => {
    this.setState({
      libIsOpen: !this.state.libIsOpen
    });
  };

  handleSelectMedia = mediaIndex => {
    const media = testMedia[mediaIndex];
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
        showAd: false
      });
    }
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
  return {
    trackCount: state.get("visibleTracks").count()
  };
};

export default connect(mapStateToProps)(Root);
