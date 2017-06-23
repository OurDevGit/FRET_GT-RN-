import React, { PropTypes } from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
import AdContainer from "./AdContainer";
import MediaPlayer from "./MediaPlayer";
import Fretboard from "./Fretboard";

const Root = ({ store }) => (
  <Provider store={store}>
    <View style={{ backgroundColor: "#ddd", flexGrow: 1 }}>
      <AdContainer />
      <MediaPlayer />
      <Fretboard />
    </View>
  </Provider>
);

Root.propTypes = {};

export default Root;
