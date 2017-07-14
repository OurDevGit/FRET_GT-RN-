import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import { Provider } from "react-redux";
import AdContainer from "./AdContainer";
import Playback from "./Playback";
import FretboardsContainer from "./Fretboards";
import Library from "./Library";

import testSongs from "../testSongs";

class Root extends Component {
  state = {
    libIsOpen: false,
    song: testSongs[0]
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <View style={{ backgroundColor: "white", flexGrow: 1 }}>
          <StatusBar hidden />
          <AdContainer onToggleLibrary={this.handleToggleLibrary} />
          <Playback song={this.state.song} />
          <FretboardsContainer />
          <Library
            isOpen={this.state.libIsOpen}
            onSelect={this.handleSelectSong}
            songs={testSongs}
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

  handleSelectSong = songIndex => {
    this.setState({
      libIsOpen: false,
      song: testSongs[songIndex]
    });
  };
}

export default Root;
