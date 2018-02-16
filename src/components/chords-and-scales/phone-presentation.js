import React from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Switch,
  Slider,
  Modal
} from "react-native";
import Dimensions from "Dimensions";
import { pure } from "recompose";
import { PrimaryBlue } from "../../design";
import { BtnPrevStep, BtnNextStep } from "../StyleKit";
import { TheoryResource, GlossaryResource, Popover } from "./utils";
import PopoverButton from "./PopoverButton";
import BtnFretlightAdmin from "../Playback/BtnFretlightAdmin";
import WebViewer from "./WebViewer";
import ScrollingPopover from "./ScrollingPopover";
import ImageScroller from "./ImageScroller";

const ChordsAndScalesPhonePresentation = props => {
  var typeText = props.currentType || "Select";
  var keyText = props.currentKey || "Select";
  var positionText = props.currentPosition || "Select";

  if (props.currentCategory === "All Notes") {
    typeText = "-";
    keyText = "-";
    positionText = "-";
  } else if (props.currentCategory === "Notes") {
    typeText = "-";
    positionText = "-";
  } else if (
    props.currentCategory === "Open Chords" ||
    props.currentCategory === "Chord Tones/Arp" ||
    props.currentCategory === "Intervals"
  ) {
    positionText = "-";
  }

  const typeIsActive = props.currentCategory !== undefined && typeText !== "-";
  const keyIsActive =
    (props.currentCategory === "Notes" || props.currentType !== undefined) &&
    keyText !== "-";
  const positionIsActive =
    props.currentKey !== undefined && positionText !== "-";
  const stepsAreActive = props.currentPosition !== undefined;

  const typeOpacity = typeIsActive ? 1.0 : 0.3;
  const keyOpacity = keyIsActive ? 1.0 : 0.3;
  const positionOpacity = positionIsActive ? 1.0 : 0.3;
  const selectKeyStyle =
    keyText === "Select a Key" || keyText === "Select"
      ? [styles.selectText, { opacity: keyOpacity }]
      : [styles.selectText, styles.keyFontFamily, { opacity: keyOpacity }];

  return (
    <View style={styles.parent}>
      <View style={styles.container}>
        {/* TITLEBAR */}
        <View style={styles.titlebar}>
          <Text style={styles.title}>Chords &amp; Scales</Text>
          <TouchableOpacity
            style={styles.titleButton}
            onPress={() => props.onPresentResource(TheoryResource)}
          >
            <Text style={styles.titleButtonText}>Theory</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.titleButton}
            onPress={() => props.onPresentResource(GlossaryResource)}
          >
            <Text style={styles.titleButtonText}>Glossary</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.ui}>
          <View style={styles.uiContainer}>
            {/* CATEGORY AND TYPE */}
            <View style={styles.row}>
              <View style={styles.section}>
                <Text style={styles.header}>Category:</Text>
                <View style={styles.buttonContainer}>
                  <PopoverButton
                    style={styles.selectButton}
                    popover={Popover.Category}
                    onPress={props.onPresentPopover}
                  >
                    <Text
                      style={styles.selectText}
                      numberOfLines={1}
                      ellipsizeMode={"tail"}
                    >
                      {props.currentCategory || "Select"}
                    </Text>
                  </PopoverButton>
                </View>
              </View>

              <View style={[styles.section, { flex: 1.2, marginRight: 6 }]}>
                <Text style={[styles.header, { opacity: typeOpacity }]}>
                  Type:
                </Text>
                <View style={styles.buttonContainer}>
                  <PopoverButton
                    style={styles.selectButton}
                    disabled={!typeIsActive}
                    popover={Popover.Type}
                    onPress={props.onPresentPopover}
                  >
                    <Text
                      style={[styles.selectText, { opacity: typeOpacity }]}
                      numberOfLines={1}
                      ellipsizeMode={"tail"}
                    >
                      {typeText}
                    </Text>
                  </PopoverButton>
                </View>
              </View>

              {/* KEY AND POSITION */}
              <View style={[styles.section, { flex: 0.7 }]}>
                <Text style={[styles.header, { opacity: keyOpacity }]}>
                  Note/Key:
                </Text>
                <View style={styles.buttonContainer}>
                  <PopoverButton
                    style={styles.selectButton}
                    disabled={!keyIsActive}
                    popover={Popover.Key}
                    onPress={props.onPresentPopover}
                  >
                    <Text
                      style={selectKeyStyle}
                      numberOfLines={1}
                      ellipsizeMode={"tail"}
                    >
                      {keyText.replace("b", "♭") || "Select a Key"}
                    </Text>
                  </PopoverButton>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={[styles.header, { opacity: positionOpacity }]}>
                  Position/Form
                </Text>
                <View style={styles.buttonContainer}>
                  <PopoverButton
                    style={styles.selectButton}
                    disabled={!positionIsActive}
                    popover={Popover.Position}
                    onPress={props.onPresentPopover}
                  >
                    <Text
                      style={[styles.selectText, { opacity: positionOpacity }]}
                      numberOfLines={1}
                      ellipsizeMode={"tail"}
                    >
                      {positionText}
                    </Text>
                  </PopoverButton>
                </View>
              </View>
            </View>

            {/* BLINKING, SPEED AND FRETLIGHT ADMIN */}
            <View style={[styles.row, { paddingTop: 0 }]}>
              <View style={styles.section}>
                <BtnFretlightAdmin
                  isPhone={true}
                  buttonStyle={styles.fretlight}
                  guitars={props.connectedDevices}
                  onPress={props.onToggleFretlightAdmin}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.blinkHeader}>Blink Root Notes</Text>
                <Switch
                  style={styles.switch}
                  value={props.isBlinking}
                  onTintColor={PrimaryBlue}
                  onValueChange={props.onToggleBlinkNotes}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.blinkHeader}>Blink Speed</Text>
                <Slider
                  style={styles.slider}
                  value={props.blinkSpeed}
                  onValueChange={props.onUpdateBlinkSpeed}
                  onSlidingComplete={props.onUpdateBlinkSpeed}
                />
              </View>

              {stepsAreActive ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginLeft: -16
                  }}
                >
                  <BtnPrevStep
                    style={{
                      width: 38,
                      height: 38
                    }}
                    color={PrimaryBlue}
                    onPress={props.onPrevPosition}
                  />
                  <BtnNextStep
                    style={{
                      width: 38,
                      height: 38
                    }}
                    color={PrimaryBlue}
                    onPress={props.onNextPosition}
                  />
                </View>
              ) : (
                <View style={styles.section} />
              )}
            </View>
          </View>
        </View>

        {/* WEBVIEW MODAL */}
        <Modal
          visible={props.resource !== undefined}
          animationType="slide"
          onRequestClose={props.onDismissResource}
        >
          <WebViewer
            resource={props.resource}
            onClose={props.onDismissResource}
          />
        </Modal>

        {/* SCROLLING POPOVER */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={props.popover !== undefined}
          onRequestClose={props.onDismissPopover}
        >
          <ScrollingPopover
            type={props.popover}
            selectedItem={props.popoverSelectedItem}
            items={props.popoverItems}
            frame={props.popoverFrame}
            onSelect={props.onSelection}
            onDismiss={props.onDismissPopover}
          />
        </Modal>
      </View>
      {/* IMAGE SCROLLVIEW */}
      {(props.chart || props.photo) && (
        <View style={{ flex: 1, paddingTop: 10 }}>
          <ImageScroller chart={props.chart} photo={props.photo} />
        </View>
      )}
    </View>
  );
};

const isCompact = () => {
  return Dimensions.get("window").height <= 400;
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    flexDirection: "row"
  },
  container: {
    flex: 4,
    paddingVertical: isCompact() ? 8 : 15,
    paddingHorizontal: isCompact() ? 12 : 15
  },
  titlebar: {
    height: isCompact() ? 22 : 24,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: isCompact() ? 6 : 8
  },
  title: {
    fontSize: isCompact() ? 18 : 19,
    marginRight: isCompact() ? 14 : 20,
    textAlignVertical: "bottom",
    height: isCompact() ? 20 : 22
  },
  titleButton: {
    height: "100%",
    marginLeft: 30
  },
  titleButtonText: {
    textAlignVertical: "bottom",
    height: isCompact() ? 20 : 22,
    fontSize: 16,
    color: "#777777",
    marginTop: -1
  },
  ui: {
    flex: 1
  },
  uiContainer: {
    flex: 1
  },
  row: {
    flex: 1,
    flexDirection: "row"
  },
  section: { flex: 1, alignContent: "flex-start" },
  header: { fontSize: isCompact() ? 12 : 13, color: PrimaryBlue },
  buttonContainer: { flex: 1, flexDirection: "row" },
  selectButton: { flexDirection: "row" },
  selectText: { fontSize: isCompact() ? 15 : 16, color: PrimaryBlue },
  keyFontFamily: { fontFamily: "DejaVuSansMono" },
  blinkHeader: { color: "#555555", fontSize: 14 },
  switch: { width: 75 },
  slider: { flex: 1, maxWidth: 110, marginLeft: -12 },
  fretlight: {
    flex: 1,
    maxHeight: isCompact() ? 30 : 35,
    maxWidth: isCompact() ? 70 : 80,
    marginLeft: 0
  }
});

ChordsAndScalesPhonePresentation.propTypes = {
  resource: PropTypes.string,
  popover: PropTypes.string,
  popoverSelectedItem: PropTypes.string,
  popoverItems: PropTypes.array,
  popoverFrame: PropTypes.object,
  currentCategory: PropTypes.string,
  currentType: PropTypes.string,
  currentKey: PropTypes.string,
  currentPosition: PropTypes.string,
  categories: PropTypes.array,
  types: PropTypes.array,
  keys: PropTypes.array,
  positions: PropTypes.array,
  chart: PropTypes.string,
  photo: PropTypes.string,
  isBlinking: PropTypes.bool.isRequired,
  blinkSpeed: PropTypes.number.isRequired,
  connectedDevices: PropTypes.number.isRequired,
  onPresentResource: PropTypes.func.isRequired,
  onDismissResource: PropTypes.func.isRequired,
  onPresentPopover: PropTypes.func.isRequired,
  onDismissPopover: PropTypes.func.isRequired,
  onSelection: PropTypes.func.isRequired,
  onPrevPosition: PropTypes.func.isRequired,
  onNextPosition: PropTypes.func.isRequired,
  onToggleBlinkNotes: PropTypes.func.isRequired,
  onUpdateBlinkSpeed: PropTypes.func.isRequired,
  onToggleFretlightAdmin: PropTypes.func.isRequired
};

export default pure(ChordsAndScalesPhonePresentation);
