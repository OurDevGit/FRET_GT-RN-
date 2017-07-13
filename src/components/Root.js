import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import { Provider } from "react-redux";
import AdContainer from "./AdContainer";
import MediaPlayer from "./Playback";
import FretboardsContainer from "./Fretboards";
import Library from "./Library";

const testSongs = [
  {
    name: "Song 1",
    file: "song1.m4a"
  },
  {
    name: "Song 2",
    file: "song2.m4a"
  },
  {
    name: "Song 3",
    file: "song3.m4a"
  }
];

class Root extends Component {
  state = {
    libIsOpen: false
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <View style={{ backgroundColor: "white", flexGrow: 1 }}>
          <StatusBar hidden />
          <AdContainer onToggleLibrary={this.handleToggleLibrary} />
          <MediaPlayer />
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
    console.log(testSongs[songIndex]);
    this.setState({
      libIsOpen: false
    });
  };
}

export default Root;
