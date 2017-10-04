import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";

import ModalButton from "./ModalButton";
import TempoText from "./TempoText";
import Popover from "./Popover";
import { ModalType } from "./ModalType";

class BtnTempoModal extends React.Component {
  state = {
    modalIsVisible: false,
    modalFrame: { x: 0, y: 0, width: 0, height: 0 }
  };

  render() {
    var currentIndex = tempos.indexOf(this.props.currentTempo);
    currentIndex = currentIndex > -1 ? currentIndex : tempos.length - 1;
    const color = this.props.color || "#222222";

    const height = this.props.isPhone
      ? Dimensions.get("window").height - 40
      : 400;
    const top = this.props.isPhone
      ? 20
      : Math.max(100, this.state.modalFrame.y - 380);

    return (
      <ModalButton onPress={this.displayModal}>
        <TempoText
          color={color}
          tempo={this.props.currentTempo}
          isPhone={this.props.isPhone}
          withTitle={true}
        />
        {this.state.modalIsVisible && (
          <Popover
            type={ModalType.Position}
            style={{
              position: "absolute",
              top: top,
              left: this.state.modalFrame.x + this.state.modalFrame.width + 10,
              width: 180,
              height: height,
              padding: 20,
              backgroundColor: "white"
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
                Tempo
              </Text>
            </View>

            <FlatList
              keyExtractor={(item, index) => index}
              data={tempos}
              initialScrollIndex={currentIndex}
              initialNumToRender={19}
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
                      this.handleSelectTempo(item > 0.1 ? item : 0);
                    }}
                  >
                    <TempoText
                      color={"#222222"}
                      isPhone={this.props.isPhone}
                      tempo={item > 0.1 ? item : 0}
                      withTitle={false}
                    />
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
    if (this.props.onDisplayToggle !== undefined) {
      this.props.onDisplayToggle(true);
    }
    this.setState({ modalIsVisible: true, modalFrame: frame });
  };

  dismissModal = () => {
    if (this.props.onDisplayToggle !== undefined) {
      this.props.onDisplayToggle(false);
    }
    this.setState({ modalIsVisible: false });
  };

  handleSelectTempo = tempo => {
    this.props.onSelectTempo(tempo);
    this.setState({ modalIsVisible: false });
  };
}

const tempos = [
  1.25,
  1.2,
  1.115,
  1.1,
  1.05,
  1.0,
  0.95,
  0.9,
  0.85,
  0.8,
  0.75,
  0.7,
  0.65,
  0.6,
  0.55,
  0.5,
  0.45,
  0.4,
  0.35,
  0.1
];

BtnTempoModal.propTypes = {
  currentTempo: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  isPhone: PropTypes.bool.isRequired,
  onSelectTempo: PropTypes.func.isRequired,
  onDisplayToggle: PropTypes.func
};

export default BtnTempoModal;
