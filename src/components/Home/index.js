import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { WebView, Alert, Linking } from "react-native";
import { connect } from "react-redux";
import { Set } from "immutable";
import { fromPairs } from "lodash";
import { getAllMedia } from "../../redux/selectors";
import { sync, getIndexFile } from "./sync";

class Home extends PureComponent {
  //`http://guitar-tunes-open.s3.amazonaws.com/home/index.html?trigger=${this.props.reloadTrigger}`
  state = {
    indexFile: null
  };

  render() {
    return (
      <WebView
        startInLoadingState={true}
        ref={ref => (this.webView = ref)}
        onMessage={this.handleWebMessage}
        onNavigationStateChange={this.handleNavStateChange}
        injectedJavaScript={
          injectAnchors.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1]
        }
        source={{
          uri: `file://${this.state.indexFile}?trigger=${
            this.props.reloadTrigger
          }`
        }}
      />
    );
  }

  async componentWillMount() {
    var indexFile = await getIndexFile();
    this.setState({
      indexFile
    });

    indexFile = await sync();

    this.setState({
      indexFile
    });
  }

  handleWebMessage = event => {
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
        default:
          break;
      }
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

Home.propTypes = {
  onChoose: PropTypes.func.isRequired,
  onDetails: PropTypes.func.isRequired,
  reloadTrigger: PropTypes.number
};

const mapStateToProps = state => {
  // get downloads and purchases from state
  const downloadedMediaIds = Set.fromKeys(state.get("downloadedMedia"));
  const purchasedIds = state.get("purchasedMedia");

  // purchases will be lowercase for Google IAB, but we need the upper-case versions
  const allMediaIds = getAllMedia(state)
    .toJS()
    .map(m => m.mediaID);
  const purchasedMediaIds = allMediaIds.filter(id =>
    purchasedIds.includes(id.toLowerCase())
  );

  // combine downloads and purchases
  const allIds = downloadedMediaIds.union(purchasedMediaIds);

  // map them for what the webview expects
  const purchasedMedia = allIds
    .map(id => ({
      purchaseId: id,
      isCached: downloadedMediaIds.includes(id)
    }))
    .toJS();

  return { purchasedMedia, downloadedMediaIds: downloadedMediaIds };
};

export default connect(mapStateToProps)(Home);

/*
 * This function is going to be stringified and then injected and runs INSIDE the in-app browser that loads Home.
 * Therefore, you can't use ES6 here or anything you've imported into this file.
 * to get the body text: injectAnchors.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1]
 */

function injectAnchors() {
  window.callback = null;

  window.handlePurchases = function(purchases) {
    window.callback(null, purchases);
    window.callback = null;
  };

  // retrieves objects saved to the persistent store
  window.optek = {
    app: {
      purchases: function(newCallback) {
        window.callback = newCallback;
        window.postMessage(JSON.stringify("GET_PURCHASES"));
      }
    }
  };

  var anchors = document.getElementsByTagName("a");
  for (var i in anchors) {
    anchors[i].onclick = function(event) {
      var anchor = event.currentTarget;
      var href = anchor.href;
      var protocol = anchor.protocol;
      var pathname = anchor.pathname;
      var search = anchor.search;
      window.postMessage(
        JSON.stringify({
          href: href,
          protocol: protocol,
          pathname: pathname,
          search: search
        })
      );
    };
  }
}
