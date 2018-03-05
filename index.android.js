import React, { Component } from "react";
import { AppRegistry, NativeModules } from "react-native";
import RNFetchBlob from "react-native-fetch-blob";

import Root from "./src/components/Root";
import configureStore from "./src/configureStore";
import { configureDownloadManager } from "./src/DownloadManager";
import { syncResources } from "./src/lib/resources";
import { syncChordsAndScales } from "./src/lib/chords_and_scales";
import { getSalt } from "./src/models/Crypto";

const crypto = NativeModules.GTCrypto;

getSalt().then(salt => {
  RNFetchBlob.setSalt(salt);
  crypto.setSalt(salt);
});

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
syncResources();
syncChordsAndScales();

class GuitarTunes extends Component {
  render() {
    return <Root store={_store} />;
  }

  // componentDidMount() {
  //   console.debug("root did mount");
  // }

  // componentWillUnmount() {
  //   console.debug("root umounting");
  // }
}

AppRegistry.registerComponent("GuitarTunes", () => GuitarTunes);
