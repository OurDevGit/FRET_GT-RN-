import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import Root from "./src/components/Root";
import configureStore from "./src/configureStore";
import { configureDownloadManager } from "./src/DownloadManager";

// Sentry is our crash reporter
import { Sentry } from "react-native-sentry";
const sentry = Sentry.config(
  "https://2e35d7f0dafb4e4ea9b4f6fcc787bdd3:95bc331c66e34694940f6d2bbcfb612f@sentry.io/239038"
);

if (__DEV__) {
  Sentry.setTagsContext({
    environment: "development"
  });
} else {
  // only install the Sentry client in Production
  sentry.install();
  Sentry.setTagsContext({
    environment: "production"
  });
}

const _store = configureStore();
configureDownloadManager(_store);

export default class GuitarTunes extends Component {
  render() {
    return <Root store={_store} />;
  }
}

AppRegistry.registerComponent("GuitarTunes", () => GuitarTunes);
