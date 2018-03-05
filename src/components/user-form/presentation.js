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

class UserFormPresentation extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {/* BACKGROUND */}
        <Image
          style={styles.background}
          source={background}
          resizeMode="cover"
        />

        <ScrollView
          ref={ref => {
            this.props.onScrollView(ref);
          }}
          contentContainerStyle={styles.scroller}
        >
          {/* LOGO */}
          <Image style={styles.logo} source={logo} resizeMode="contain" />

          <Text style={styles.heading}>
            Guitar Tunes delivers custom lessons.{"\n"}
            Choose your playing level and birthdate.
          </Text>

          <Text style={styles.subheading}>
            You can change your level at any time.{"\n"}
            Birthdate helps us prioritize song licensing.
          </Text>

          {/* USER BUTTONS */}

          <View style={styles.buttons}>
            <View style={styles.column}>
              <Text style={styles.buttonheader}>Birthdate</Text>
              <PopoverButton
                style={styles.selectButton}
                popover={Popover.Birthdate}
                onPress={this.props.onPresentPopover}
              >
                <Text style={styles.selectText}>
                  {this.props.birthdate || "Choose"}
                </Text>
              </PopoverButton>
            </View>

            <View style={styles.column}>
              <Text style={styles.buttonheader}>Playing Level</Text>
              <PopoverButton
                style={styles.selectButton}
                popover={Popover.ExperienceLevel}
                onPress={this.props.onPresentPopover}
              >
                <Text style={styles.selectText}>
                  {this.props.experienceLevel || "Choose"}
                </Text>
              </PopoverButton>
            </View>
          </View>

          {/* LEVEL DESCRIPTION */}
          <View style={styles.levels}>
            <View style={styles.levelView}>
              <Text style={styles.levelsHeading}>
                Guitar Tunes Playing Levels
              </Text>
            </View>
            <View style={styles.levelView}>
              <Text style={styles.level}>
                <Text style={styles.levelTitle}>Beginner:</Text> Never played
                before or just starting out? Maybe you&#39;ve tried a few chords
                or someone showed you a riff? The step-by-step Beginner course
                will explore everything from tuning your guitar to playing your
                first songs. You can choose songs that have an “Easy Chords”
                track so you can start playing right away. Learning to play has
                never been faster or more fun!
              </Text>
            </View>
            <View style={styles.levelView}>
              <Text style={styles.level}>
                <Text style={styles.levelTitle}>Intermediate I:</Text> You strum
                open chords and maybe some barre chords. You’re ready to venture
                into scales. The Intermediate I course will guide you from
                Intermediate rhythm techniques to navigating your first scales
                and solos!
              </Text>
            </View>
            <View style={styles.levelView}>
              <Text style={styles.level}>
                <Text style={styles.levelTitle}>Intermediate II:</Text> Your
                rhythm playing is good and you’re comfortable playing riffs.
                It’s time to learn different rhythm techniques and to dive into
                solos using improvisation. The Intermediate II course explores
                everything from advanced rhythm techniques to improvisation and
                scale auditioning.
              </Text>
            </View>
            <View style={styles.levelView}>
              <Text style={styles.level}>
                <Text style={styles.levelTitle}>Advanced:</Text> You&#39;re a
                good player. Time to conquer some cutting-edge rhythm and lead
                techniques and master the fretboard. The Advanced course teaches
                you how to use the entire fretboard for both rhythm and lead
                playing and introduces you to various genres of each.
              </Text>
            </View>
          </View>

          <View style={styles.playContainer}>
            <TouchableOpacity
              style={styles.playbutton}
              onPress={this.props.onSubmit}
            >
              <Text style={styles.playbuttonText}>Play Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* SCROLLING POPOVER */}

        <Modal
          transparent={true}
          animationType="fade"
          visible={this.props.popover !== undefined}
          onRequestClose={this.props.onDismissPopover}
        >
          <ScrollingPopover
            type={this.props.popover}
            selectedItem={this.props.popoverSelectedItem}
            items={this.props.popoverItems}
            frame={this.props.popoverFrame}
            onSelect={this.props.onSelection}
            onDismiss={this.props.onDismissPopover}
          />
        </Modal>
      </View>
    );
  }

  scrollToEnd = () => {
    console.log("SCROLL TO END");
  };
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%"
  },
  scroller: { alignContent: "center" },
  logo: {
    flex: 1,
    alignSelf: "center",
    height: getIsPhone() ? 60 : 100,
    aspectRatio: 2.6,
    marginTop: getIsPhone() ? 2 : 6
  },
  heading: {
    flex: 1,
    alignSelf: "center",
    fontSize: getIsPhone() ? 18 : 30,
    color: "white",
    textAlign: "center",
    marginTop: getIsPhone() ? 2 : 6
  },
  subheading: {
    flex: 1,
    alignSelf: "center",
    fontSize: getIsPhone() ? 10 : 16,
    marginRight: 20,
    textAlign: "center",
    textAlignVertical: "center",
    color: "white",
    marginTop: getIsPhone() ? 2 : 6
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: getIsPhone() ? 6 : 10
  },
  column: {
    flex: 1,
    marginHorizontal: 20,
    maxWidth: getIsPhone() ? 180 : 250
  },
  section: { flex: 1 },
  buttonheader: {
    fontSize: getIsPhone() ? 16 : 30,
    color: "white",
    textAlign: "center",
    marginTop: getIsPhone() ? 0 : 10
  },
  selectButton: { backgroundColor: "#AAAAAA", marginTop: 4 },
  selectText: {
    fontSize: getIsPhone() ? 20 : 28,
    textAlign: "center",
    marginVertical: 10
  },
  levels: {
    marginHorizontal: 20,
    maxWidth: 1100,
    alignSelf: "center",
    marginTop: 10
  },
  levelView: {
    marginTop: 6
  },
  level: {
    color: "white",
    fontSize: getIsPhone() ? 12 : 19
  },
  levelsHeading: {
    fontSize: getIsPhone() ? 12 : 22,
    fontWeight: "bold",
    color: "white"
  },
  levelTitle: {
    fontSize: getIsPhone() ? 12 : 20,
    color: "#9E8844",
    fontWeight: "bold",
    fontStyle: "italic"
  },
  playContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20
  },
  playbutton: {
    flex: 1,
    maxWidth: 220,
    backgroundColor: "#51AB4B"
  },
  playbuttonText: {
    fontSize: getIsPhone() ? 20 : 28,
    textAlign: "center",
    marginVertical: 10
  }
});

UserFormPresentation.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  birthdate: PropTypes.string,
  experienceLevel: PropTypes.string,
  popover: PropTypes.string,
  popoverSelectedItem: PropTypes.string,
  popoverItems: PropTypes.array,
  popoverFrame: PropTypes.object,
  onPresentPopover: PropTypes.func.isRequired,
  onDismissPopover: PropTypes.func.isRequired,
  onSelection: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onScrollView: PropTypes.func.isRequired
};

export default pure(UserFormPresentation);
