import React from "react";
import PropTypes from "prop-types";
import { View, Image, Text, StyleSheet } from "react-native";
import DigitalLight from "./DigitalLight";
import DigitalNeedle from "./DigitalNeedle";

class DigitalTuner extends React.Component {
  render() {
    const { currentNote } = this.props;
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={require("../../images/tuner-background.png")}
          resizeMode="contain"
        >
          <DigitalLight type={"left"} isOn={true} />
          <DigitalLight type={"right"} isOn={false} />
          <DigitalNeedle rotation={0} />
          <Image
            style={styles.housing}
            source={require("../../images/tuner-housing.png")}
            resizeMode="contain"
          />
        </Image>
      </View>
    );
  }
}

DigitalTuner.propTypes = {
  currentNote: PropTypes.string.isRequired,
  currentIndex: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center" },
  image: {
    height: "100%",
    aspectRatio: 1.333,
    alignItems: "center"
  },
  housing: { position: "absolute", bottom: "10%" }
});

export default DigitalTuner;
