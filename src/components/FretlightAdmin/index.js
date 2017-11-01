import React from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  NativeModules,
  KeyboardAvoidingView
} from "react-native";
import Dimensions from "Dimensions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import { Map, List } from "immutable";

import { PrimaryBlue } from "../../design";
import { startIdentification, stopIdentification } from "./identifier";
import GuitarRow from "./GuitarRow";
import TrackModal from "./TrackModal";
import { setGuitar } from "../../models/Guitars";
import { guitarModalStyles } from "./styles";

var guitarController = NativeModules.GTGuitarController;

class FretlightModal extends React.Component {
  state = {
    isIdentifying: false
  };

  render() {
    const { isPhone, guitars, tracks } = this.props;

    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "white",
          padding: 10
        }}
      >
        {/* Top Bar */}
        <View style={guitarModalStyles.toolbar}>
          <Text style={guitarModalStyles.titleText}>Fretlight Status</Text>
          <TouchableOpacity
            style={guitarModalStyles.doneButton}
            onPress={() => {
              this.props.onToggleFretlightAdmin(false);
            }}
          >
            <Text style={guitarModalStyles.doneText}>Done</Text>
          </TouchableOpacity>
        </View>

        {guitars.count() > 0 ? (
          <FlatList
            style={{ flex: 1 }}
            keyExtractor={(item, index) => index}
            data={guitars.toJS()}
            initialNumToRender={10}
            ItemSeparatorComponent={this.separator}
            renderItem={({ item, index }) => (
              <GuitarRow
                index={index}
                guitar={item}
                guitars={guitars.toJS()}
                tracks={tracks.toJS()}
                isPhone={isPhone}
                onRename={this.handleRename}
                onAssignTrack={this.handleAssignTrack}
                onLeft={this.handleLeft}
                onBass={this.handleBass}
                onToggleScanning={this.handleToggleScanning}
              />
            )}
          />
        ) : (
          <Text
            style={{
              flex: 1,
              color: PrimaryBlue,
              fontSize: 21,
              padding: 10,
              paddingTop: 20
            }}
          >
            No Fretlight Guitars connected. The Fretlight Guitar lights
            fingering positions right on the neck of a real guitar. Everything
            you see in Guitar Tunes will light in real-time right under your
            fingers!
          </Text>
        )}

        {/* Bottom Bar */}

        <View style={guitarModalStyles.bottomBar}>
          <TouchableOpacity
            style={guitarModalStyles.bottomButton}
            onPress={this.handleIdentify}
          >
            <Text style={guitarModalStyles.bottomButtonText}>
              {this.state.isIdentifying
                ? "Stop Identification"
                : "Identify All Guitars"}
            </Text>
          </TouchableOpacity>

          <TrackModal
            tracks={tracks.toJS()}
            isPhone={isPhone}
            onAssignAllTrack={this.handleAssignAll}
          />
        </View>
      </View>
    );
  }

  componentWillMount() {
    guitarController.startScanning();
  }

  componentWillUnmount() {
    guitarController.stopScanning();
  }

  handleToggleScanning = bool => {
    if (bool) {
      guitarController.startScanning();
    } else {
      guitarController.stopScanning();
    }
  };

  separator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#DDDDDD"
        }}
      />
    );
  };

  handleRename = async (name, guitar) => {
    guitar.name = name;
    this.props.updateGuitarSetting(Map(guitar));
    await setGuitar(guitar);
  };

  handleLeft = async guitar => {
    guitar.isLeft = !guitar.isLeft;
    guitarController.setLeft(guitar.isLeft, guitar.id);
    this.props.updateGuitarSetting(Map(guitar));
    await setGuitar(guitar);
  };

  handleBass = async guitar => {
    guitar.isBass = !guitar.isBass;
    guitarController.setBass(guitar.isBass, guitar.id);
    this.props.updateGuitarSetting(Map(guitar));
    await setGuitar(guitar);
  };

  handleAssignTrack = (track, guitar) => {
    guitar.track = track;
    this.props.updateGuitarSetting(Map(guitar));
  };

  handleAssignAll = track => {
    this.props.guitars.forEach(guitar => {
      this.props.updateGuitarSetting(guitar.set("track", track));
    });
  };

  handleIdentify = () => {
    if (this.state.isIdentifying) {
      stopIdentification(guitarController, this.props.guitars);
    } else {
      startIdentification(guitarController, this.props.guitars);
    }
    this.setState({ isIdentifying: !this.state.isIdentifying });
  };
}

FretlightModal.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  tracks: PropTypes.object.isRequired,
  guitars: PropTypes.object.isRequired,
  onToggleFretlightAdmin: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    tracks: state.get("guitarTracks"),
    guitars: state.get("guitars")
  };
};

export default connect(mapStateToProps, actions)(FretlightModal);
