import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import PropTypes from "prop-types";
import { realmify, guid } from "../../realm";

import ModalButton from "./ModalButton";
import Popover from "./Popover";
import { ModalType } from "./ModalType";

class BtnSaveLoopModal extends React.Component {
  state = {
    modalIsVisible: false,
    inputText: ""
  };

  render() {
    const existingName = this.props.currentLoop.get("name");
    return (
      <ModalButton onPress={this.displayModal}>
        <Text style={this.props.style}>Save Loop</Text>

        {this.state.modalIsVisible &&
          <Popover
            type={ModalType.Center}
            style={{
              width: 500,
              height: 200,
              marginTop: -300,
              padding: 20,
              backgroundColor: "white"
            }}
            isVisible={this.state.modalIsVisible}
            onDismiss={this.dismissModal}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 22,
                  fontWeight: "800"
                }}
              >
                {existingName ? "Rename Loop" : "Name Your Loop"}
              </Text>

              <Text
                style={{
                  flex: 1,
                  fontSize: 18,
                  fontWeight: "400"
                }}
              >
                {existingName
                  ? `Please enter a new name for '${existingName}'`
                  : "Please enter a name for the new loop"}
              </Text>

              <TextInput
                style={{
                  flex: 1,
                  fontSize: 22,
                  fontWeight: "400"
                }}
                autoFocus={true}
                placeholder={"Loop name"}
                defaultValue={existingName}
                autoCapitalize={"words"}
                onChangeText={this.handleTextInput}
              />

              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center"
                }}
              >
                <TouchableOpacity
                  style={{ flex: -1 }}
                  onPress={this.dismissModal}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      textAlign: "right"
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: -1, marginLeft: 50 }}
                  onPress={this.saveLoop}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "200",
                      textAlign: "right"
                    }}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Popover>}
      </ModalButton>
    );
  }

  displayModal = () => {
    const begin = this.props.currentLoop.get("begin");
    const end = this.props.currentLoop.get("end");
    if (begin === undefined && end == undefined) {
      Alert.alert(
        "Loop Times",
        "Please set a begin and end time for your loop"
      );
    } else {
      this.setState({ modalIsVisible: true });
    }
  };

  dismissModal = () => {
    this.setState({ modalIsVisible: false });
  };

  handleTextInput = text => {
    this.setState({ inputText: text });
  };

  saveLoop = () => {
    const name = this.state.inputText;

    if (name === "") {
      Alert.alert("Loop Name", "Please enter a name with at least 1 character");
    } else {
      const matching = this.props.loops.filter(loop => loop.name === name);
      if (matching.length > 0) {
        Alert.alert("Existing Name", "Please give your loop another name");
      } else {
        const loop = this.props.currentLoop
          .set("name", name)
          .set("mediaId", this.props.mediaId);
        this.props.onSetCurrentLoop(loop);
        this.props.createLoop(loop.toJS());
        this.setState({ modalIsVisible: false });
      }
    }
  };
}

const mapQueriesToProps = (realm, ownProps) => ({
  loops: realm.objects("Loop").filtered("mediaId == $0", ownProps.mediaId)
});

const mapMutationsToProps = ({ create, destroy }) => ({
  createLoop: loop => {
    var obj = { ...loop, id: guid() };
    create("Loop", obj);
  },
  updateLoop: loop => {
    create("Loop", loop, true);
  }
});

BtnSaveLoopModal.propTypes = {
  style: PropTypes.object.isRequired,
  mediaId: PropTypes.string.isRequired,
  currentLoop: PropTypes.object.isRequired,
  onSetCurrentLoop: PropTypes.func.isRequired
};

export default realmify(mapQueriesToProps, mapMutationsToProps)(
  BtnSaveLoopModal
);