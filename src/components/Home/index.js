import React from "react";
import PropTypes from "prop-types";
import {
  View,
  WebView,
  Alert,
  Linking,
  ActivityIndicator,
  StyleSheet,
  NetInfo
} from "react-native";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import { fromPairs } from "lodash";
import { sync, getHomePages } from "./sync";
import { setUserLevel } from "../../models/User";
import { recordExperienceLevel } from "../../metrics";
import { getPathParams, getLevelForInt } from "./utils";
import { injectAnchors } from "./injection";
import { mapStateToProps } from "./map-state-props";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.isMounted_ = false;
  }

  state = {
    indexFile: "RELOAD",
    reloadTrigger: 0,
    tappedMediaId: undefined
  };

  render() {
    const { indexFile } = this.state;
    const { userLevel } = this.props;
    const { device, level } = getPathParams(userLevel);
    const path = `home-${device}-${level}`;
    const isReloading = indexFile === null ? true : !indexFile.includes(path);
    const uri = `file://${indexFile}?trigger=${this.state.reloadTrigger}`;
    const injection = injectAnchors
      .toString()
      .match(/function[^{]+\{([\s\S]*)\}$/)[1];

    this.webView = undefined;

    return (
      <View style={styles.container}>
        {isReloading ? (
          <ActivityIndicator size="small" color="#3D9BFF" />
        ) : (
          <WebView
            ref={ref => (this.webView = ref)}
            injectedJavaScript={injection}
            source={{ uri }}
            onMessage={this.handleWebMessage}
            onNavigationStateChange={this.handleNavStateChange}
          />
        )}
      </View>
    );
  }

  componentWillMount() {
    if (this.props.userLevel !== undefined) {
      this.checkIndexFile(this.props.userLevel, this.props.homePage);
    }
  }

  componentDidMount() {
    this.props.fetchConfig();
    this.isMounted_ = true;
  }

  componentDidUpdate(prevProps, prevState) {
    // if the media we tapped comes through, play it
    if (this.props.downloadedMediaIds.contains(this.state.tappedMediaId)) {
      this.props.onChoose(this.state.tappedMediaId);
      this.setState({
        tappedMediaId: undefined
      });
    }
  }

  componentWillUnmount() {
    this.isMounted_ = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const shouldUpdate =
      this.state.indexFile !== nextState.indexFile ||
      this.props.purchasedMedia.length !== nextProps.purchasedMedia.length;

    return shouldUpdate;
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.userLevel !== undefined) {
      await this.checkIndexFile(nextProps.userLevel, nextProps.homePage);
    }
  }

  checkIndexFile = async (userLevel, page) => {
    const { device, level } = getPathParams(userLevel);

    // loading local files (if available)
    var homePages = await getHomePages();
    var indexFile = homePages[page];

    const prefix =
      this.props.environment === "sandbox"
        ? "home-android/STAGING/home"
        : "home-android/LIVE/home";
    const path = `${prefix}-${device}-${level}`;
    const forceUpdate = indexFile === null ? true : !indexFile.includes(path);
    var reloadTrigger = Date.now();

    if (this.isMounted_ === false) {
      return;
    } else if (forceUpdate) {
      this.setState({ indexFile: "RELOAD" });
    } else if (indexFile !== this.state.indexFile) {
      this.setState({ indexFile, reloadTrigger });
    }

    // syncing remote files
    homePages = await sync(this.props.environment, device, level, forceUpdate);
    indexFile = homePages[page];

    if (this.isMounted_ === false) {
      return;
    } else if (indexFile !== undefined) {
      reloadTrigger = Date.now();
      this.setState({ indexFile });
    }
  };

  handleWebMessage = async event => {
    const data = event.nativeEvent.data;
    const message = JSON.parse(data);

    if (typeof message === "string") {
      this.handleStringMessage(message);
      return;
    }

    const { protocol, pathname, search } = message;
    // console.debug(message);
    // console.debug(protocol, pathname, search);

    if (protocol === "optkguitartunes:") {
      // console.debug({ pathname });

      switch (pathname) {
        case "//purchase": {
          const mediaId = search.split("=")[1] || "";
          console.debug(`Choose ${mediaId}`);
          this.setState({
            tappedMediaId: mediaId
          });
          this.props.onChoose(mediaId);
          if (this.props.downloadedMediaIds.includes(mediaId) !== true) {
            Alert.alert(null, "Your Media is downloading.", [{ text: "OK" }]);
          }
          break;
        }
        case "//store": {
          // transform the query string into a dictionary
          const pairs = search
            .slice(1)
            .split("&")
            .map(pair => pair.split("="));
          const params = fromPairs(pairs);

          this.props.onDetails(params);
          break;
        }
        case "//library": {
          console.log("library");
          break;
        }
        case "//chords-scales": {
          this.props.onChordsAndScales();
          break;
        }
        case "//user": {
          const isConnected = await NetInfo.isConnected.fetch();

          if (isConnected) {
            const levelInt = search.split("=")[1] || "";
            const level = getLevelForInt(levelInt);

            if (level !== undefined) {
              setUserLevel(level);
              recordExperienceLevel(level);
              this.props.onUpdateLevel(level);
            }
          } else {
            Alert.alert(
              "No Internet Connection",
              "It appears you're not connected to the internet. Please check your connection and try again"
            );
          }
          break;
        }
        default:
          break;
      }
    } else if (protocol === "file:") {
      this.props.onPageLoad(pathname);
    }
  };

  handleNavStateChange = event => {
    // send web links out of app
    if (
      event.url.indexOf("https://") === 0 ||
      event.url.indexOf("http://") === 0
    ) {
      this.webView.stopLoading();
      Linking.openURL(event.url);
    }
  };

  handleStringMessage = message => {
    if (message === "GET_PURCHASES") {
      // console.debug("GET PURCHASES!");
      // console.debug(this.props.purchasedMedia);
      // console.debug(JSON.stringify(this.props.purchasedMedia));

      const injection = `window.handlePurchases(${JSON.stringify(
        this.props.purchasedMedia
      )});`;
      // console.debug(injection);

      this.webView.injectJavaScript(injection);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center"
  }
});

Home.propTypes = {
  userLevel: PropTypes.string,
  homePage: PropTypes.string.isRequired,
  downloadedMediaIds: PropTypes.object,
  purchasedMedia: PropTypes.array,
  dlMediaIdsDidChange: PropTypes.bool,
  environment: PropTypes.string,
  onChoose: PropTypes.func.isRequired,
  onDetails: PropTypes.func.isRequired,
  onUpdateLevel: PropTypes.func.isRequired,
  onChordsAndScales: PropTypes.func.isRequired,
  onPageLoad: PropTypes.func.isRequired,
  fetchConfig: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(Home);
