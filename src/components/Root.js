import React, { Component } from "react";
import { View, StatusBar, Button } from "react-native";
import { Provider } from "react-redux";
import AdContainer from "./AdContainer";
import Playback from "./Playback";
import FretboardsContainer from "./Fretboards";
import Library from "./Library";

import testSongs from "../testSongs";
import testVideos from "../testVideos";

import PaintCode from "./PaintCode.js";

const testMedia = [...testVideos, ...testSongs];

class Root extends Component {
  state = {
    libIsOpen: false,
    song: null,
    video: null,
    showAd: true
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <View style={{ backgroundColor: "white", flexGrow: 1 }}>
          <StatusBar hidden />

          {this.state.showAd &&
            <AdContainer onToggleLibrary={this.handleToggleLibrary} />}
          <Playback song={this.state.song} video={this.state.video} />
          <FretboardsContainer />
          <Library
            isOpen={this.state.libIsOpen}
            onSelect={this.handleSelectMedia}
            media={testMedia}
          />
          <View style={{ position: "absolute", left: 5, top: 5 }}>
            {!this.state.libIsOpen &&
              <Button title="Lib" onPress={this.handleToggleLibrary} />}
          </View>
          <PaintCode
            drawMethod="BtnPlay"
            drawArgs={[
              "isPressed",
              "isShowingPause",
              "redValue",
              "greenValue",
              "blueValue"
            ]}
            isPressed={false}
            isShowingPause={false}
            redValue={1}
            greenValue={0.35}
            blueValue={0.75}
            style={{ height: 25, backgroundColor: "white" }}
          />
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
}

export default Root;
