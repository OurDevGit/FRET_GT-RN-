import React from "react";
import PropTypes from "prop-types";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal
} from "react-native";
import { pure } from "recompose";
import { Popover } from "./utils";
import PopoverButton from "../chords-and-scales/PopoverButton";
import ScrollingPopover from "./scrolling-popover";
import { getIsPhone } from "../../utils";
const background = getIsPhone()
  ? require("../../images/user-form-background-phone.png")
  : require("../../images/user-form-background-tablet.png");
const logo = require("../../images/logo-guitar-tunes.png");

const UserFormPresentation = props => {
  return (
    <View style={styles.container}>
      {/* BACKGROUND */}
      <Image
        style={styles.background}
        source={background}
        resizeMode="contain"
      />

      <ScrollView style={styles.scroller}>
        {/* LOGO */}
        <Image style={styles.logo} source={logo} resizeMode="contain" />

        <Text style={styles.heading}>
          Guitar Tunes delivers custom lessons. Choose your playing level and
          birthdate.
        </Text>

        <Text style={styles.subheading}>
          You can change your level at any time. Birthdate helps us prioritize
          song licensing.
        </Text>

        {/* USER BUTTONS */}

        <View style={styles.buttons}>
          <View style={styles.column}>
            <Text style={styles.buttonheader}>Birthdate</Text>
            <PopoverButton
              style={styles.selectButton}
              popover={Popover.Birthdate}
              onPress={props.onPresentPopover}
            >
              <Text style={styles.selectText}>
                {props.birthdate || "Choose"}
              </Text>
            </PopoverButton>
          </View>

          <View style={styles.column}>
            <Text style={styles.buttonheader}>Playing Level</Text>
            <PopoverButton
              style={styles.selectButton}
              popover={Popover.ExperienceLevel}
              onPress={props.onPresentPopover}
            >
              <Text style={styles.selectText}>
                {props.experienceLevel || "Choose"}
              </Text>
            </PopoverButton>
          </View>
        </View>

        {/* LEVEL DESCRIPTION */}
        <Text style={styles.levels}>
          <Text style={styles.levelsHeading}>Guitar Tunes Playing Levels</Text>
          <Text style={styles.levelTitle}>Beginner:</Text> Never played before
          or just starting out? Maybe you&#39;ve tried a few chords or someone
          showed you a riff? The step-by-step Beginner course will explore
          everything from tuning your guitar to playing your first songs. You
          can choose songs that have an “Easy Chords” track so you can start
          playing right away. Learning to play has never been faster or more
          fun!
          <Text style={styles.levelTitle}>Intermediate I:</Text> You strum open
          chords and maybe some barre chords. You’re ready to venture into
          scales. The Intermediate I course will guide you from Intermediate
          rhythm techniques to navigating your first scales and solos!
          <Text style={styles.levelTitle}>Intermediate II:</Text> Your rhythm
          playing is good and you’re comfortable playing riffs. It’s time to
          learn different rhythm techniques and to dive into solos using
          improvisation. The Intermediate II course explores everything from
          advanced rhythm techniques to improvisation and scale auditioning.
          <Text style={styles.levelTitle}>Advanced:</Text> You&#39;re a good
          player. Time to conquer some cutting-edge rhythm and lead techniques
          and master the fretboard. The Advanced course teaches you how to use
          the entire fretboard for both rhythm and lead playing and introduces
          you to various genres of each.
        </Text>

        <TouchableOpacity>
          <Text style={styles.playbutton}>Play Now</Text>
        </TouchableOpacity>
      </ScrollView>

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
  background: {},
  scroller: {},
  logo: {},
  heading: {
    fontSize: 28,
    marginRight: 20,
    textAlignVertical: "bottom",
    height: 30
  },
  subheading: {
    fontSize: 28,
    marginRight: 20,
    textAlignVertical: "bottom",
    height: 30
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    maxHeight: 300
  },
  column: {
    flex: 1
  },
  section: { flex: 1 },
  buttonheader: { fontSize: 18 },
  selectText: { fontSize: 23 },
  levels: {},
  levelsHeading: {},
  levelTitle: {},
  playbutton: {}
});

UserFormPresentation.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  birthdate: PropTypes.number,
  experienceLevel: PropTypes.string,
  popover: PropTypes.string,
  popoverSelectedItem: PropTypes.string,
  popoverItems: PropTypes.array,
  popoverFrame: PropTypes.object,
  onPresentPopover: PropTypes.func.isRequired,
  onDismissPopover: PropTypes.func.isRequired,
  onSelection: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default pure(UserFormPresentation);
