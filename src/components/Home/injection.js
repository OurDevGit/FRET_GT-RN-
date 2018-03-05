/*
 * This function is going to be stringified and then injected and runs INSIDE the in-app browser that loads Home.
 * Therefore, you can't use ES6 here or anything you've imported into this file.
 * to get the body text: injectAnchors.toString().match(/function[^{]+\{([\s\S]*)\}$/)[1]
 */

export function injectAnchors() {
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

  var anchors = document.querySelectorAll("a,area");
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
