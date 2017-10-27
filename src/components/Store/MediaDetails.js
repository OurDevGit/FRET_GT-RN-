import React from "react";
import PropTypes from "prop-types";
import { View, Text, Image, StyleSheet, Modal, ScrollView } from "react-native";

import { PrimaryGold, Danger } from "../../design";
import { FlatButton } from "../Material";

const MediaDetails = ({
  isVisible,
  artworkURL,
  title,
  subtitle,
  details,
  hasFiles,
  onClose,
  onArchiveFiles
}) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={isVisible}
    onRequestClose={onClose}
  >
    <View style={styles.shade}>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.contentTop}>
            <Image source={{ uri: artworkURL }} style={styles.thumb} />
            <View style={styles.contentText}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>
          <ScrollView style={{ height: 1 }}>
            <Text>{details}</Text>
          </ScrollView>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            borderTopColor: "lightgray",
            borderTopWidth: 1
          }}
        >
          {hasFiles === true && (
            <FlatButton
              title="Archive Files"
              style={{ color: Danger }}
              onPress={onArchiveFiles}
            />
          )}

          <FlatButton
            title="Close"
            style={{ color: PrimaryGold }}
            onPress={onClose}
          />
        </View>
      </View>
    </View>
  </Modal>
);

const basePadding = 8;
const titleSize = 18;
const subTitleSize = 14;
const modalWidth = 500;
const modalHeight = 320;
const iconSize = 80;

const styles = StyleSheet.create({
  shade: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    backgroundColor: "hsla(0, 0%, 0%, 0.5)"
  },
  container: {
    width: modalWidth,
    height: modalHeight,
    backgroundColor: "white",
    elevation: 25
  },
  content: {
    flexGrow: 1,
    padding: basePadding * 2,
    paddingBottom: 0
  },
  thumb: {
    width: iconSize,
    height: iconSize,
    marginRight: basePadding * 2,
    marginBottom: basePadding
  },
  title: { fontSize: titleSize, marginBottom: titleSize / 2 },
  subtitle: { fontSize: subTitleSize, marginBottom: subTitleSize / 2 },
  contentTop: { flexDirection: "row" },
  contentText: {
    // width: modalWidth - basePadding * 4 - basePadding - iconSize,
    // height: "100%",
    // backgroundColor: "blue"
  }
});

MediaDetails.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  hasFiles: PropTypes.bool.isRequired,
  artworkURL: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  details: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onArchiveFiles: PropTypes.func.isRequired
};

export default MediaDetails;
