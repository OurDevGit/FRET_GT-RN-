import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, WebView } from "react-native";

class Home extends PureComponent {
  render() {
    return <WebView
    ref={ref => (this.webView = ref)}
    injectedJavaScript={
      injectAnchors.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1]
    }
    onMessage={this.handleWebMessage}
    source={{
      uri: "http://guitar-tunes-open.s3.amazonaws.com/home/index.html"
    }}
    onNavigationStateChange={state => {
      console.debug("onNavigationStateChange");
      console.debug(state);
      console.debug(`Page is loading: ${state.loading}`);

      // if (state.loading === false) {
      //   this.webView.injectJavaScript(
      //     "alert('inject on nav state change')"
      //   );
      // }
    }}
  />
  }

  handleWebMessage = event => {
    const data = event.nativeEvent.data;
    const message = JSON.parse(data);
    const { protocol, pathname, search } = message;
    console.debug(protocol, pathname, search);

    if (protocol === "optkguitartunes:") {
      if (pathname === "")
    }
  };
}

Home.propTypes = {

}

export default Home

/*
 * This function is going to be stringified and then run INSIDE the in-app browser that loads Home.
 * Therefore, you can't use ES6 here or anything you've imported into this file.
 */ 
function injectAnchors() {
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