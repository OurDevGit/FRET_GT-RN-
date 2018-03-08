import React from "react";
import {
  AppState,
  Dimensions,
  View,
  StyleSheet,
  Modal,
  NetInfo,
  WebView
} from "react-native";
import { FlatButton } from "./Material";
import { pure } from "recompose";
import { PrimaryBlue } from "../design";
import { version } from "../../package";
import { getViewedAppVersion, setViewedAppVersion } from "../models/User";

class ReleaseNotes extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    appState: AppState.currentState,
    url: undefined
  };

  render() {
    return (
      <Modal
        visible={this.state.url !== undefined}
        animationType="slide"
        onRequestClose={this.onClose}
      >
        <View style={styles.container}>
          <View style={styles.toolbar}>
            <FlatButton
              style={{ color: PrimaryBlue }}
              title="Close"
              onPress={this.onClose}
            />
          </View>
          <WebView
            style={styles.web}
            startInLoadingState={true}
            automaticallyAdjustContentInsets={true}
            source={{ uri: this.state.url }}
          />
        </View>
      </Modal>
    );
  }

  componentDidMount() {
    AppState.addEventListener("change", this.handleAppStateChange);
    this.checkReleaseNotes();
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = appState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      appState === "active"
    ) {
      this.checkReleaseNotes();
    }

    this.setState({ appState });
  };

  checkReleaseNotes = async () => {
    const isConnected = await NetInfo.isConnected.fetch();
    let savedVersion = await getViewedAppVersion();

    if (savedVersion !== version && isConnected) {
      let str = version.split(".").join("-");
      let url = `https://guitartunes.com/pages/android-${str})`;
      await setViewedAppVersion(version);
      this.setState({ url });
    }
  };

  onClose = () => {
    this.setState({ url: undefined });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  toolbar: {
    height: 50,
    width: "100%",
    alignItems: "flex-end",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1
  },
  web: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 50
  }
});

export default pure(ReleaseNotes);
