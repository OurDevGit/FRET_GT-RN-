import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View } from "react-native";
import { Provider } from "react-redux";
import AdContainer from "./AdContainer";
import MediaPlayer from "./MediaPlayer";
import FretboardsContainer from "./Fretboards";

const Root = ({ store }) => (
  <Provider store={store}>
    <View style={{ backgroundColor: "#ddd", flexGrow: 1 }}>
      <AdContainer />
      <MediaPlayer />
      <FretboardsContainer />
    </View>
  </Provider>
);

Root.propTypes = {};

export default Root;
