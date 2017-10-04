import React from "react";
import { Alert, View, Text, FlatList, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import { Map } from "immutable";

import ModalButton from "./ModalButton";
import Popover from "./Popover";

import { ModalType } from "./ModalType";

class BtnMyLoopsModal extends React.Component {
  state = {
    modalIsVisible: false,
    modalFrame: { x: 0, y: 0, width: 0, height: 0 }
  };

  render() {
    const {
      currentChapter,
      currentMarker,
      videoMarkers,
      onMarkerPress
    } = this.props;
    const { modalFrame } = this.state;

    const height = Math.min(
      100 + videoMarkers.length * 42,
      Dimensions.get("window").height - 40
    );
    const maxHeight = Math.min(300, Dimensions.get("window").height - 60);
    const topHeight = Math.min(height, maxHeight);
    const top = Math.max(30, modalFrame.y - topHeight + 20);

    const left = this.state.modalFrame.x + this.state.modalFrame.width + 10;
    const width = 300;

    return (
      <ModalButton onPress={this.displayModal}>
        <Text
          style={{
            flex: 1,
            minWidth: 50,
            height: 30,
            marginTop: 10,
            paddingTop: 4,
            fontSize: 20,
            lineHeight: 20,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          Select Chapter
        </Text>

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
            <Text
              style={{
                flex: 1,
                fontSize: 22,
                fontWeight: "800"
              }}
            >
              Video Chapters
            </Text>

            <FlatList
              keyExtractor={(item, index) => index}
              data={allLoops}
              ItemSeparatorComponent={this.separator}
              renderItem={({ item, index }) => {
                const isActiveChapter =
                  currentChapter !== undefined &&
                  item.type === currentChapter.type &&
                  item.name === currentChapter.name &&
                  item.begin === currentChapter.begin &&
                  item.end === currentChapter.end;

                const isActiveMarker =
                  currentMarker !== undefined &&
                  item.type === currentMarker.type &&
                  item.name === currentMarker.name &&
                  item.begin === currentMarker.begin &&
                  item.end === currentMarker.end;
                return (
                  <View
                    style={{
                      flex: -1,
                      marginVertical: 2,
                      flexDirection: "row"
                    }}
                  >
                    <TouchableOpacity
                      style={{ flex: 1 }}
                      onPress={() => {
                        onMarkerPress(item.begin);
                      }}
                    >
                      <View style={{ flex: 1, flexDirection: "row" }}>
                        {item.type === "marker" && (
                          <View style={{ width: 12, marginRight: 2 }}>
                            {isActiveMarker && <Text>✔︎</Text>}
                          </View>
                        )}
                        <Text
                          style={isActiveChapter ? styles.bold : styles.normal}
                        >
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </Popover>
        )}
      </ModalButton>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.currentChapter !== nextProps.currentChapter ||
      this.props.currentMarker !== nextProps.currentMarker
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
    this.setState({ modalIsVisible: true, modalFrame: frame });
  };

  dismissModal = () => {
    this.setState({ modalIsVisible: false });
  };
}

BtnMyLoopsModal.propTypes = {
  currentChapter: PropTypes.object,
  currentMarker: PropTypes.object,
  videoMarkers: PropTypes.array.isRequired,
  onMarkerPress: PropTypes.func.isRequired
};

export default BtnMyLoopsModal;
