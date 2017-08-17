import React, { Component } from "react";
import { View, StatusBar, Button } from "react-native";
import { Provider } from "react-redux";
import AdContainer from "./AdContainer";
import Playback from "./Playback";
import FretboardsContainer from "./Fretboards";
import Library from "./Library";
import TrackSelector from "./TrackSelector";

import testSongs from "../testSongs";
import testVideos from "../testVideos";

import realm from "../realm";

const testMedia = [...testVideos, ...testSongs];

class Root extends Component {
  state = {
    libIsOpen: false,
    song: null,
    video: null,
    showAd: true,
    layout: { width: 1, height: 1 }
  };

  render() {
    const { store } = this.props;
    const aspectRatio = this.state.layout.width / this.state.layout.height;
    const supportsMultipleFretboards =
      this.state.layout.width > 1 && aspectRatio < 1.6;

    return (
      <Provider store={store}>
        <View
          style={{ backgroundColor: "white", flexGrow: 1 }}
          onLayout={this.handleLayout}
        >
          <StatusBar hidden />

          {this.state.showAd &&
            <AdContainer onToggleLibrary={this.handleToggleLibrary} />}
          <Playback song={this.state.song} video={this.state.video} />
          <FretboardsContainer
            deviceWidth={this.state.layout.width}
            deviceHeight={this.state.layout.height}
            supportsMultipleFretboards={supportsMultipleFretboards}
          />
          <Library
            isOpen={this.state.libIsOpen}
            onSelect={this.handleSelectMedia}
            media={testMedia}
          />
          <View style={{ position: "absolute", left: 5, top: 5 }}>
            {!this.state.libIsOpen &&
              <Button title="Lib" onPress={this.handleToggleLibrary} />}
          </View>

          {supportsMultipleFretboards && <TrackSelector />}
        </View>
      </Provider>
    );
  }

  componentDidMount() {
    // try {
    //   realm.write(() => {
    //     realm.create("Category", { id: "1" });
    //   });
    // } catch (err) {
    //   console.error(err);
    // }

    let categories = realm.objects("Category");
    console.debug(JSON.stringify(categories[0], null, 2));
    console.debug(categories[0]);
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

  handleLayout = e => {
    this.setState({
      layout: { ...e.nativeEvent.layout }
    });
  };
}

export default Root;
