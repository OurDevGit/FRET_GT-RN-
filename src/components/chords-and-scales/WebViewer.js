import React from "react";
import { StyleSheet, View, WebView, Dimensions } from "react-native";
import PropTypes from "prop-types";

import { FlatButton } from "../Material";
import { PrimaryBlue } from "../../design";
// file://${this.props.filePath}

const WebViewer = ({ resource, onClose }) => (
  <View style={styles.container}>
    <View style={styles.toolbar}>
      <FlatButton
        style={{ color: PrimaryBlue }}
        title="Close"
        onPress={onClose}
      />
    </View>
    <WebView
      style={styles.web}
      startInLoadingState={true}
      automaticallyAdjustContentInsets={true}
      source={{
        uri: `file:///android_asset/chords_scales_html/${resource}` // if we ever do iOS, we'll need to differentiate the path
      }}
    />
  </View>
);

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
    flex: 1,
    width: Dimensions.get("window").width,
    height: 300
  }
});

WebViewer.propTypes = {
  resource: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default WebViewer;
