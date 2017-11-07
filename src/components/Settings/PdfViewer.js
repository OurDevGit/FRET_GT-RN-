import React from "react";
import { StyleSheet, View } from "react-native";
import PropTypes from "prop-types";

import Pdf from "react-native-pdf";

import { FlatButton } from "../Material";
import { PrimaryBlue } from "../../design";

export default class PdfViewer extends React.Component {
  render() {
    let source = {
      uri: `file://${this.props.filePath}`,
      cache: true
    };

    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <FlatButton
            style={{ color: PrimaryBlue }}
            title="Close"
            onPress={this.props.onClose}
          />
        </View>
        <Pdf source={source} fitWidth={true} style={styles.pdf} />
      </View>
    );
  }
}

PdfViewer.propTypes = {
  filePath: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  pdf: {
    flex: 1,
    width: "100%"
  },
  toolbar: {
    height: 50,
    width: "100%",
    alignItems: "flex-end",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1
  }
});
