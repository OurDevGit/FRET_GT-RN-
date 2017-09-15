import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  Modal,
  ScrollView
} from "react-native";

import { PrimaryGold } from "../../design";
import { FlatButton } from "../Material";

const MediaDetails = ({ isVisible, artworkURL, title, subtitle, onClose }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={isVisible}
    onRequestClose={() => {
      console.debug("dismiss details");
    }}
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
            <Text>
              Here's a bunch of body text! Here's a bunch of body text! Here's a
              bunch of body text! Here's a bunch of body text! Here's a bunch of
              body text! Here's a bunch of body text! Here's a bunch of body
              text! Here's a bunch of body text! Here's a bunch of body text!
              Here's a bunch of body text! Here's a bunch of body text! Here's a
              bunch of body text! Here's a bunch of body text! Here's a bunch of
              body text! Here's a bunch of body text! Here's a bunch of body
              text! Here's a bunch of body text! Here's a bunch of body text!
              Here's a bunch of body text! Here's a bunch of body text! Here's a
              bunch of body text! Here's a bunch of body text! Here's a bunch of
              body text! Here's a bunch of body text! Here's a bunch of body
              text! Here's a bunch of body text! Here's a bunch of body text!
              Here's a bunch of body text! Here's a bunch of body text! Here's a
              bunch of body text! Here's a bunch of body text! Here's a bunch of
              body text! Here's a bunch of body text! Here's a bunch of body
              text! Here's a bunch of body text! Here's a bunch of body text!
              Here's a bunch of body text! Here's a bunch of body text! Here's a
              bunch of body text! Here's a bunch of body text! Here's a bunch of
              body text! Here's a bunch of body text! Here's a bunch of body
              text! Here's a bunch of body text! Here's a bunch of body text!
              Here's a bunch of body text! Here's a bunch of body text! Here's a
              bunch of body text! Here's a bunch of body text! Here's a bunch of
              body text! Here's a bunch of body text! Here's a bunch of body
              text! Here's a bunch of body text! Here's a bunch of body text!
              Here's a bunch of body text! Here's a bunch of body text! Here's a
              bunch of body text! Here's a bunch of body text! Here's a bunch of
              body text! Here's a bunch of body text!
            </Text>
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
    // flexDirection: "row",
    // backgroundColor: "yellow"
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

export default MediaDetails;
