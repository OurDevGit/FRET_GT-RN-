import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import Root from "./src/components/Root";
import configureStore from "./src/configureStore";
import { configureDownloadManager } from "./src/DownloadManager";

const _store = configureStore();
configureDownloadManager(_store);

export default class GuitarTunes extends Component {
  render() {
    return <Root store={_store} />;
  }
}

AppRegistry.registerComponent("GuitarTunes", () => GuitarTunes);
