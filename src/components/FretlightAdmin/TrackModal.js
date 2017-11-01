import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";

import ModalButton from "../modals/ModalButton";
import Popover from "../modals/Popover";
import { ModalType } from "../modals/ModalType";
import { trackModalStyles } from "./styles";

class TrackModal extends React.Component {
  state = {
    modalIsVisible: false,
    modalFrame: { x: 0, y: 0, width: 0, height: 0 }
  };

  render() {
    const { guitar, tracks, isPhone } = this.props;
    const color = this.props.color || "#222222";
    var currentIndex = -1;
    const height = Math.min(300, tracks.length * 40 + 90);
    var pStyle = { ...trackModalStyles.popover, height };

    if (guitar === undefined) {
      pStyle.top = this.state.modalFrame.y - height - 10;
      pStyle.left = this.state.modalFrame.x + 20;
    } else {
      currentIndex = tracks.findIndex(item => item.name === guitar.track);
      pStyle.top = isPhone ? 20 : Math.max(100, this.state.modalFrame.y - 380);
      pStyle.left = this.state.modalFrame.x + this.state.modalFrame.width + 10;
    }

    return (
      <ModalButton onPress={this.displayModal}>
        {guitar === undefined ? (
          <Text style={trackModalStyles.bottomButton}>Assign Part to All</Text>
        ) : (
          <Text style={trackModalStyles.button}>
            Assigned Part: {guitar.track}
          </Text>
        )}

        {this.state.modalIsVisible && (
          <Popover
            type={ModalType.Position}
            style={pStyle}
            isVisible={this.state.modalIsVisible}
            onDismiss={this.dismissModal}
          >
            <View style={{ flex: -1, marginBottom: 20, flexDirection: "row" }}>
              <Text
                style={{
                  flex: 1,
                  fontSize: 22,
                  fontWeight: "800",
                  marginBottom: -10
                }}
              >
                Assign a new track
              </Text>
            </View>

            <FlatList
              keyExtractor={(item, index) => index}
              data={tracks}
              initialScrollIndex={0}
              initialNumToRender={5}
              getItemLayout={(item, index) => ({
                length: 40,
                offset: 40 * index,
                index
              })}
              ItemSeparatorComponent={this.separator}
              renderItem={({ item, index }) => (
                <View
                  style={{ width: "100%", height: 40, flexDirection: "row" }}
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      this.handleSelectTrack(item.name);
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      {guitar && (
                        <View
                          style={{
                            width: 12,
                            marginRight: 5
                          }}
                        >
                          {currentIndex === index && (
                            <Text
                              style={{
                                height: "100%",
                                textAlignVertical: "center"
                              }}
                            >
                              ✔︎
                            </Text>
                          )}
                        </View>
                      )}

                      <Text
                        style={{
                          flex: 1,
                          fontSize: 18,
                          textAlignVertical: "center"
                        }}
                      >
                        {item.name}
                      </Text>
                    </View>
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

  handleSelectTrack = trackName => {
    if (this.props.guitar === undefined) {
      this.props.onAssignAllTrack(trackName);
    } else {
      this.props.onAssignTrack(trackName, this.props.guitar);
    }

    this.setState({ modalIsVisible: false });
  };
}

TrackModal.propTypes = {
  guitar: PropTypes.object,
  tracks: PropTypes.array.isRequired,
  isPhone: PropTypes.bool.isRequired,
  onAssignTrack: PropTypes.func,
  onAssignAllTrack: PropTypes.func
};

export default TrackModal;
