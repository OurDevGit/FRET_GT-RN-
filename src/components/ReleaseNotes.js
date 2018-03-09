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
import { getIsPhone } from "../utils";
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
        transparent={true}
        animationType="fade"
        onRequestClose={this.onClose}
      >
        <View style={styles.shader}>
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
    const savedVersion = await getViewedAppVersion();

    if (savedVersion !== version && isConnected) {
      const str = version.split(".").join("-");
      const url = `https://www.guitartunes.com/pages/android-${str}`;
      await setViewedAppVersion(version);
      this.setState({ url });
    }
  };

  onClose = () => {
    this.setState({ url: undefined });
  };
}

const sizeMod = getIsPhone() ? 0.6 : 0.4;

const styles = StyleSheet.create({
  shader: {
    flex: 1,
    backgroundColor: "rgba(1,1,1,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    width: Dimensions.get("window").width * sizeMod,
    height: Dimensions.get("window").height * sizeMod,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white"
  },
  toolbar: {
    height: 44,
    width: "100%",
    alignItems: "flex-end",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    backgroundColor: "lightgray"
  },
  web: {
    width: Dimensions.get("window").width * sizeMod,
    height: Dimensions.get("window").height * sizeMod - 50
  }
});

export default pure(ReleaseNotes);
