import React from "react";
import { Alert, View, Text, FlatList, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import { Map } from "immutable";

import { PrimaryBlue } from "../../design";
import { BtnLoopDelete } from "../StyleKit";

import { getLoops, deleteLoop } from "../../models/Loops";

import ModalButton from "./ModalButton";
import TempoText from "./TempoText";
import Popover from "./Popover";

import { BtnPhoneMyLoops } from "../StyleKit";
import { ModalType } from "./ModalType";

class BtnMyLoopsModal extends React.Component {
  state = {
    modalIsVisible: false,
    modalFrame: { x: 0, y: 0, width: 0, height: 0 },
    isEditing: false,
    myLoops: []
  };

  render() {
    const { quickLoops, currentLoop, color, isPhone, isVideo } = this.props;
    const { isEditing, modalFrame, myLoops } = this.state;
    var allLoops = [];
    var myLoopsFirstIndex = 0;

    if (isVideo) {
      if (quickLoops.length > 0) {
        allLoops = [{ name: "SMARTLOOPS™" }, ...quickLoops];
      }

      if (myLoops.length > 0) {
        myLoopsFirstIndex = allLoops.length;
        allLoops = [...allLoops, { name: "USER LOOPS" }, ...myLoops];
      }
    } else {
      allLoops = myLoops;
    }

    allLoops = [...allLoops, { name: "None" }];

    const height = Math.min(
      100 + allLoops.length * 42,
      Dimensions.get("window").height - 40
    );
    const maxHeight = Math.min(300, Dimensions.get("window").height - 60);
    const topHeight = Math.min(height, maxHeight);
    const top = Math.max(30, modalFrame.y - topHeight + 20);

    const left = Math.max(10, modalFrame.x - 510);
    const width = modalFrame.x - left;

    return (
      <ModalButton onPress={this.displayModal}>
        {isPhone ? (
          <BtnPhoneMyLoops
            style={{
              marginHorizontal: this.props.style.marginHorizontal,
              width: 36,
              height: 36
            }}
            color={color}
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
              {myLoops.length > 0 && (
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
              )}
            </View>

            <FlatList
              keyExtractor={(item, index) => index}
              data={allLoops}
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
                        item.name !== "None" &&
                        item.name !== "SMARTLOOPS™" &&
                        item.name !== "USER LOOPS"
                          ? 1.0
                          : 0.0
                    }}
                  >
                    ✓
                  </Text>
                  {isEditing &&
                    item.name !== "None" &&
                    item.name !== "SMARTLOOPS™" &&
                    item.name !== "USER LOOPS" &&
                    index > myLoopsFirstIndex && (
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

                  {item.name !== "SMARTLOOPS™" && item.name !== "USER LOOPS" ? (
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
                  ) : (
                    <Text
                      style={{
                        marginLeft: -20,
                        height: "100%",
                        textAlignVertical: "center",
                        fontSize: 18,
                        fontWeight: "800",
                        color: "#888888"
                      }}
                    >
                      {item.name}
                    </Text>
                  )}
                </View>
              )}
            />
          </Popover>
        )}
      </ModalButton>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.mediaId !== nextProps.mediaId ||
      this.props.quickLoops.length !== nextProps.quickLoops.length ||
      !this.props.currentLoop.equals(nextProps.currentLoop) ||
      this.state.isEditing !== nextState.isEditing ||
      this.state.modalFrame !== nextState.modalFrame ||
      this.state.modalIsVisible !== nextState.modalIsVisible ||
      this.state.myLoops.length !== nextState.myLoops.length
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

  displayModal = async frame => {
    const { quickLoops, isVideo } = this.props;
    const myLoops = await getLoops(this.props.mediaId);

    if (myLoops === undefined && quickLoops.length === 0) {
      if (isVideo) {
        Alert.alert(
          "Loops Unavailable",
          "You currently have no saved loops for this lesson, nor are there SMARTLOOPS™"
        );
      } else {
        Alert.alert(
          "Loops Unavailable",
          "You currently have no saved loops for this media"
        );
      }
    } else {
      if (this.props.onForceControlsVisible !== undefined) {
        this.props.onForceControlsVisible(true);
      }
      this.setState({ modalIsVisible: true, modalFrame: frame, myLoops });
    }
  };

  dismissModal = () => {
    if (this.props.onForceControlsVisible !== undefined) {
      this.props.onForceControlsVisible(false);
    }
    this.setState({ modalIsVisible: false, isEditing: false });
  };

  toggleEditing = () => {
    const bool = !this.state.isEditing;
    this.setState({ isEditing: bool });
  };

  handleDeleteLoop = async loop => {
    const { mediaId, currentLoop, onClearCurrentLoop } = this.props;
    if (loop.id === currentLoop.get("id")) {
      onClearCurrentLoop();
    }
    this.setState({ myLoops: await deleteLoop(loop, mediaId) });
  };

  handleClearLoop = () => {
    this.props.onClearCurrentLoop();
    this.setState({ modalIsVisible: false });
  };

  handleSelectLoop = loop => {
    this.props.onSetCurrentLoop(Map(loop));
    if (this.props.onForceControlsVisible !== undefined) {
      this.props.onForceControlsVisible(false);
    }
    this.setState({ modalIsVisible: false });
  };
}

BtnMyLoopsModal.defaultProps = {
  quickLoops: []
};

BtnMyLoopsModal.propTypes = {
  style: PropTypes.object.isRequired,
  mediaId: PropTypes.string.isRequired,
  quickLoops: PropTypes.array,
  currentLoop: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  isPhone: PropTypes.bool.isRequired,
  isVideo: PropTypes.bool.isRequired,
  onSetCurrentLoop: PropTypes.func.isRequired,
  onForceControlsVisible: PropTypes.func
};

export default BtnMyLoopsModal;
