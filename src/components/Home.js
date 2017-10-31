import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { WebView } from "react-native";

class Home extends PureComponent {
  render() {
    return (
      <WebView
        startInLoadingState={true}
        ref={ref => (this.webView = ref)}
        onMessage={this.handleWebMessage}
        injectedJavaScript={
          injectAnchors.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1]
        }
        source={{
          uri: "http://guitar-tunes-open.s3.amazonaws.com/home/index.html"
        }}
      />
    );
  }

  handleWebMessage = event => {
    const data = event.nativeEvent.data;
    const message = JSON.parse(data);

    if (typeof message === "string") {
      this.handleStringMessage(message);
      return;
    }

    const { protocol, pathname, search } = message;
    console.debug(protocol, pathname, search);

    if (protocol === "optkguitartunes:") {
      console.debug({ pathname });

      switch (pathname) {
        case "//purchase": {
          const mediaId = search.split("=")[1] || "";
          console.debug(`Choose ${mediaId}`);
          this.props.onChoose(mediaId);
          break;
        }
        case "//store": {
          const mediaId = search.split("=")[1];
          this.props.onDetails(mediaId);
          break;
        }
        default:
          break;
      }
    }
  };

  handleStringMessage = message => {
    if (message === "GET_PURCHASES") {
      console.debug("GET PURCHASES!");

      this.webView.injectJavaScript(
        "window.handlePurchases([{purchaseId:'200_Acoustic_Licks_Part1', isCached:true}]);"
      );
    }
  };
}

Home.propTypes = {
  onChoose: PropTypes.func.isRequired,
  onDetails: PropTypes.func.isRequired
};

export default Home;

/*
 * This function is going to be stringified and then run INSIDE the in-app browser that loads Home.
 * Therefore, you can't use ES6 here or anything you've imported into this file.
 * to get the body text: injectAnchors.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1]
 */

function injectAnchors() {
  window.callback = null;

  window.handlePurchases = function(purchases) {
    alert(JSON.stringify(purchases[0]));
    window.callback(purchases);
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
      // alert("link: " + href);
    };
  }
}
