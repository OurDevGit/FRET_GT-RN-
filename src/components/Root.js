import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import { Provider } from "react-redux";
import AdContainer from "./AdContainer";
import MediaPlayer from "./Playback";
import FretboardsContainer from "./Fretboards";
import Library from "./Library";

const testSongs = [
  {
    name: "A Day in the Life",
    audio: "a_day_in_the_life_a.m4a",
    midi: "a_day_in_the_life_m.mid"
  },
  {
    name: "Autumn Leaves",
    audio: "autumn_leaves_a.m4a",
    midi: "autumn_leaves_m.mid"
  },
  {
    name: "Bad Moon Rising",
    audio: "bad_moon_rising_a.m4a",
    midi: "bad_moon_rising_m.mid"
  },
  {
    name: "Cliffs of Dover",
    audio: "cliffs_of_dover_a.m4a",
    midi: "cliffs_of_dover_m.mid"
  },
  {
    name: "Crossfire",
    audio: "crossfire_a.m4a",
    midi: "crossfire_m.mid"
  },
  {
    name: "D'yer Maker",
    audio: "dyer_audio_a.m4a",
    midi: "dyer_data_m.mid"
  },
  {
    name: "Sultans of Swing",
    audio: "sultans_of_swing_a.m4a",
    midi: "sultans_of_swing_m.mid"
  }
];

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
          <MediaPlayer song={this.state.song} />
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
