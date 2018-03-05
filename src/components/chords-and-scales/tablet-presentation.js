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
import { pure } from "recompose";
import { PrimaryBlue } from "../../design";
import { BtnPrevStep, BtnNextStep } from "../StyleKit";
import { TheoryResource, GlossaryResource, Popover } from "./utils";
import PopoverButton from "./PopoverButton";
import BtnFretlightAdmin from "../Playback/BtnFretlightAdmin";
import WebViewer from "./WebViewer";
import ScrollingPopover from "./ScrollingPopover";
import ImageScroller from "./ImageScroller";

const ChordsAndScalesTabletPresentation = props => {
  var typeText = props.currentType || "Select a Type";
  var keyText = props.currentKey || "Select a Key";
  var positionText = props.currentPosition || "Select a Position";

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
    keyText === "Select a Key"
      ? [styles.selectText, { opacity: keyOpacity }]
      : [styles.selectText, styles.keyFontFamily, { opacity: keyOpacity }];

  return (
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
          <View style={styles.column}>
            <View style={styles.section}>
              <Text style={styles.header}>Category:</Text>
              <View style={styles.buttonContainer}>
                <PopoverButton
                  style={styles.selectButton}
                  popover={Popover.Category}
                  onPress={props.onPresentPopover}
                >
                  <Text style={styles.selectText}>
                    {props.currentCategory || "Select a Category"}
                  </Text>
                </PopoverButton>
              </View>
            </View>

            <View style={styles.section}>
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
                  <Text style={[styles.selectText, { opacity: typeOpacity }]}>
                    {typeText}
                  </Text>
                </PopoverButton>
              </View>
            </View>
          </View>

          {/* KEY AND POSITION */}
          <View style={styles.column}>
            <View style={styles.section}>
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
                  <Text style={selectKeyStyle}>
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
                  >
                    {positionText}
                  </Text>
                </PopoverButton>
              </View>

              {stepsAreActive && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    marginTop: 4,
                    marginLeft: -4
                  }}
                >
                  <BtnPrevStep
                    style={{
                      width: 40,
                      height: 40
                    }}
                    color={PrimaryBlue}
                    onPress={props.onPrevPosition}
                  />
                  <BtnNextStep
                    style={{
                      width: 40,
                      height: 40
                    }}
                    color={PrimaryBlue}
                    onPress={props.onNextPosition}
                  />
                </View>
              )}
            </View>
          </View>

          {/* BLINKING, SPEED AND FRETLIGHT ADMIN */}
          <View style={[styles.column, { paddingTop: 20 }]}>
            <View style={[styles.section, { alignItems: "center" }]}>
              <Text style={styles.blinkHeader}>Blink Root Notes</Text>
              <Switch
                style={styles.switch}
                value={props.isBlinking}
                onTintColor={PrimaryBlue}
                onValueChange={props.onToggleBlinkNotes}
              />
            </View>

            <View style={[styles.section, { alignItems: "center" }]}>
              <Text style={styles.blinkHeader}>Blink Speed</Text>
              <Slider
                style={styles.slider}
                value={props.blinkSpeed}
                onValueChange={props.onUpdateBlinkSpeed}
                onSlidingComplete={props.onUpdateBlinkSpeed}
              />
            </View>

            <View style={[styles.section, { alignItems: "center" }]}>
              <BtnFretlightAdmin
                isPhone={false}
                buttonStyle={styles.fretlight}
                guitars={props.connectedDevices}
                onPress={props.onToggleFretlightAdmin}
              />
            </View>
          </View>

          {/* IMAGE SCROLLVIEW */}
          {(props.chart || props.photo) && (
            <ImageScroller chart={props.chart} photo={props.photo} />
          )}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 30
  },
  titlebar: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 20
  },
  title: {
    fontSize: 28,
    marginRight: 20,
    textAlignVertical: "bottom"
  },
  titleButton: {
    marginLeft: 50
  },
  titleButtonText: {
    textAlignVertical: "bottom",
    fontSize: 20,
    color: "#777777",
    marginTop: -2,
    marginBottom: 3
  },
  ui: {
    flex: 1,
    justifyContent: "center"
  },
  uiContainer: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 300
  },
  column: {
    flex: 1
  },
  section: { flex: 1 },
  header: { fontSize: 18, color: PrimaryBlue },
  buttonContainer: { flex: 1, flexDirection: "row" },
  selectButton: { flexDirection: "row" },
  selectText: { fontSize: 23, color: PrimaryBlue },
  keyFontFamily: { fontFamily: "DejaVuSansMono" },
  blinkHeader: { color: "#555555", fontSize: 16, marginBottom: 10 },
  switch: {},
  slider: { width: "100%", maxWidth: 200 },
  fretlight: { flex: 1, maxHeight: 46, paddingLeft: 16, paddingRight: 18 }
});

ChordsAndScalesTabletPresentation.propTypes = {
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

export default pure(ChordsAndScalesTabletPresentation);
