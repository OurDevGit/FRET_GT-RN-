import React from "react";
import {
  View,
  Text,
  Image,
  FlatButton,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import DigitalTuner from "./DigitalTuner";
import AudioTuner from "./AudioTuner";

class Tuner extends React.Component {
  state = {
    isDigital: true
  };
  render() {
    const { track, origin, onClose } = this.props;
    const { isDigital } = this.state;

    return (
      <Modal animationType="fade" transparent={true} onRequestClose={onClose}>
        <TouchableOpacity style={styles.container} onPress={onClose}>
          <View style={styles.content}>
            <View style={styles.titlebar}>
              <Text style={styles.heading}>{`Tuning for ${track.name}`}</Text>
              <View>
                <FlatButton
                  title={isDigital ? "Go to Audible" : "Go to Digital"}
                  style={{
                    color: PrimaryGold
                  }}
                  onPress={this.handleToggleMode}
                />
              </View>
              <View>
                <FlatButton
                  title="Close"
                  style={{
                    color: PrimaryGold
                  }}
                  onPress={onClose}
                />
              </View>
            </View>

            {isDigital ? <DigitalTuner /> : <AudioTuner />}
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }

  handleToggleMode = () => {
    this.setState({ isDigital: !this.state.isDigital });
  };
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(1,1,1,0.5)",
    width: "100%",
    height: "100%"
  },
  content: {
    width: "90%",
    height: "90%",
    backgroundColor: "#dddddd",
    padding: 15
  },
  titlebar: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginHorizontal: 4,
    height: 50,
    textAlignVertical: "center",
    marginLeft: 10
  },
  scrollView: {}
});

Tuner.propTypes = {
  track: PropTypes.object.isRequired,
  origin: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Tuner;
