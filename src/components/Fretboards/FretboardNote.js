import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";
import { getCurrentPattern } from "../../midi-store";
// import { Sentry } from "react-native-sentry";

class FretboardNote extends React.Component {
  isVisible_ = false;
  isRoot_ = false;

  constructor(props) {
    super(props);

    this.state = {
      noteSize: this.getNoteSize(props.fretHeight)
    };
  }

  render() {
    const { noteSize } = this.state;
    const chars = this.props.notation.split("");
    const key = chars[0];
    const step = chars.length > 1 ? chars[1] : "";
    const fontSize = noteSize * 0.6;
    const paddingLeft = step === "" ? "2%" : "16%";

    return (
      <View
        style={styles.container}
        opacity={0}
        ref={ref => (this.fretView = ref)}
      >
        <View style={{ flex: 1 }}>
          {/* REGULAR BACKGROUND */}
          <View style={styles.background}>
            <View
              style={[
                styles.circle,
                {
                  width: noteSize,
                  height: noteSize,
                  backgroundColor: "#17A3E3",
                  borderColor: "#17A3E3"
                }
              ]}
            />
          </View>

          {/* ROOT BACKGROUND */}
          <View style={styles.background} ref={ref => (this.rootView = ref)}>
            <View
              style={[
                styles.circle,
                {
                  width: noteSize,
                  height: noteSize,
                  backgroundColor: "#97FAEE",
                  borderColor: "#97FAEE"
                }
              ]}
            />
          </View>

          {/* TEXT / NOTATION */}
          <View style={[styles.text, { paddingLeft }]}>
            <Text style={[styles.notation, { fontSize }]}>{key}</Text>
            {step !== "" && (
              <Text style={[styles.step, { fontSize }]}>{step}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }

  show = () => {
    if (this.isVisible_ !== true) {
      // Sentry.captureBreadcrumb({
      //   message: "Turning fret ON via setNativeProps",
      //   category: "setNativeProps",
      //   level: "debug"
      // });

      this.fretView.setNativeProps({ opacity: 1 });
      this.isVisible_ = true;
    }

    // toggling root view for root color
    const { root } = getCurrentPattern();

    if (root !== undefined) {
      let nextIsRoot = root === this.props.notation;
      if (this.isRoot !== nextIsRoot) {
        this.rootView.setNativeProps({ opacity: nextIsRoot ? 1 : 0 });
        this.isRoot = nextIsRoot;
      }
    } else if (this.isRoot !== false) {
      this.rootView.setNativeProps({ opacity: 0 });
      this.isRoot = false;
    }
  };

  hide = () => {
    if (this.isVisible_ !== false) {
      // Sentry.captureBreadcrumb({
      //   message: "Turning fret OFF via setNativeProps",
      //   category: "setNativeProps",
      //   level: "debug"
      // });

      this.fretView.setNativeProps({ opacity: 0 });
      this.isVisible_ = false;
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.fretHeight !== this.props.fretHeight) {
      this.setState({
        noteSize: this.getNoteSize(nextProps.fretHeight)
      });
    }
  }

  getNoteSize = fretHeight => {
    return fretHeight / 6 - 4;
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    marginVertical: 1
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center"
  },
  circle: {
    alignSelf: "center",
    borderRadius: 100
  },
  text: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap"
  },
  notation: {
    fontFamily: "DejaVuSansMono",
    textAlign: "right",
    textAlignVertical: "center"
  },
  step: {
    fontFamily: "DejaVuSansMono",
    textAlign: "left",
    textAlignVertical: "center",
    marginLeft: "-8%"
  }
});

FretboardNote.propTypes = {
  isRoot: PropTypes.bool.isRequired,
  isBass: PropTypes.bool.isRequired,
  notation: PropTypes.string.isRequired,
  boardWidth: PropTypes.number.isRequired,
  fretHeight: PropTypes.number.isRequired
};

export default FretboardNote;
