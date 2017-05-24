import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import Root from "./src/components/Root";
import configureStore from "./src/configureStore";

export default class GuitarTunes extends Component {
  render() {
    return <Root store={configureStore()} />;
  }
}

AppRegistry.registerComponent("GuitarTunes", () => GuitarTunes);