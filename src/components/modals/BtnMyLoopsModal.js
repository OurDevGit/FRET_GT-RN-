import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import { realmify, guid } from "../../realm";
import Dimensions from "Dimensions";
import { Map } from "immutable";

import { PrimaryBlue } from "../../design";
import { BtnLoopDelete } from "../StyleKit";

import ModalButton from "./ModalButton";
import TempoText from "./TempoText";
import Popover from "./Popover";

import { BtnPhoneMyLoops } from "../StyleKit";
import { ModalType } from "./ModalType";

class BtnMyLoopsModal extends React.Component {
  state = {
    modalIsVisible: false,
    modalFrame: { x: 0, y: 0, width: 0, height: 0 },
    isEditing: false
  };

  render() {
    const { loops, currentLoop, isPhone } = this.props;
    const { isEditing, modalFrame } = this.state;

    const myLoops = loops || [];

    const height = Math.min(
      100 + (myLoops.length + 1) * 42,
      Dimensions.get("window").height - 40
    );
    const left = Math.max(10, modalFrame.x - 510);
    const width = modalFrame.x - left;

    const top = Math.max(
      30,
      modalFrame.y - (100 + (myLoops.length + 1) * 42) + 20
    );

    const maxHeight = Math.min(300, Dimensions.get("window").height - 60);

    return (
      <ModalButton onPress={this.displayModal}>
        {isPhone ? (
          <BtnPhoneMyLoops
            style={{ width: 36, height: 36 }}
            color={"#222222"}
          />
        ) : (
          <Text style={this.props.style}>My Loops</Text>
        )}

        {this.state.modalIsVisible && (
          <Popover
            type={ModalType.Position}
            style={{
              position: "absolute",
              backgroundColor: "white",
              padding: 20,
              top,
              left,
              width,
              height,
              maxHeight
            }}
            isVisible={this.state.modalIsVisible}
            onDismiss={this.dismissModal}
          >
            <View style={{ flex: -1, marginBottom: 20, flexDirection: "row" }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 22,
                  fontWeight: "800"
                }}
              >
                My Loops
              </Text>

              <TouchableOpacity
                style={{ flex: -1 }}
                onPress={this.toggleEditing}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "400",
                    textAlign: "right"
                  }}
                >
                  {isEditing ? "Done" : "Edit"}
                </Text>
              </TouchableOpacity>
            </View>

            <FlatList
              keyExtractor={(item, index) => index}
              data={[...loops, { name: "None" }]}
              ItemSeparatorComponent={this.separator}
              renderItem={({ item, index }) => (
                <View
                  style={{ width: "100%", height: 40, flexDirection: "row" }}
                >
                  <Text
                    style={{
                      height: "100%",
                      textAlignVertical: "center",
                      fontSize: 18,
                      fontWeight: "400",
                      marginRight: 10,
                      color: PrimaryBlue,
                      opacity:
                        currentLoop.get("name") === item.name &&
                        item.name !== "None"
                          ? 1.0
                          : 0.0
                    }}
                  >
                    ✓
                  </Text>
                  {isEditing &&
                  item.name !== "None" && (
                    <BtnLoopDelete
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        marginTop: 6
                      }}
                      color={"#B20000"}
                      onPress={() => {
                        this.handleDeleteLoop(item);
                      }}
                    />
                  )}

                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      item.name === "None"
                        ? this.handleClearLoop()
                        : this.handleSelectLoop(item);
                    }}
                  >
                    <Text
                      style={{
                        height: "100%",
                        textAlignVertical: "center",
                        fontSize: 18
                      }}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </Popover>
        )}
      </ModalButton>
    );
  }

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

  displayModal = frame => {
    this.setState({ modalIsVisible: true, modalFrame: frame });
  };

  dismissModal = () => {
    this.setState({ modalIsVisible: false });
  };

  toggleEditing = () => {
    const bool = !this.state.isEditing;
    this.setState({ isEditing: bool });
  };

  handleDeleteLoop = loop => {
    if (loop === this.props.currentLoop) {
      this.props.onClearCurrentLoop();
    }

    this.props.deleteLoop(loop);
  };

  handleClearLoop = () => {
    this.props.onClearCurrentLoop();
    this.setState({ modalIsVisible: false });
  };

  handleSelectLoop = loop => {
    this.props.onSetCurrentLoop(Map(loop));
    this.setState({ modalIsVisible: false });
  };
}

const mapQueriesToProps = (realm, ownProps) => ({
  loops: realm.objects("Loop").filtered("mediaId == $0", ownProps.mediaId) || {}
});

const mapMutationsToProps = ({ destroy }) => ({
  deleteLoop: loop => {
    destroy(loop);
  }
});

BtnMyLoopsModal.propTypes = {
  style: PropTypes.object.isRequired,
  mediaId: PropTypes.string.isRequired,
  loops: PropTypes.object,
  currentLoop: PropTypes.object.isRequired,
  onSetCurrentLoop: PropTypes.func.isRequired
};

export default realmify(mapQueriesToProps, mapMutationsToProps)(
  BtnMyLoopsModal
);
