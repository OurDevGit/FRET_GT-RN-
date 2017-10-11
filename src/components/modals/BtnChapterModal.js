import React from "react";
import {
  Alert,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import { Map } from "immutable";

import ModalButton from "./ModalButton";
import Popover from "./Popover";

import { ModalType } from "./ModalType";

const styles = StyleSheet.create({
  bold: {
    marginVertical: 10,
    fontWeight: "800",
    fontSize: 18
  },
  normal: {
    marginVertical: 10,
    fontWeight: "200",
    fontSize: 18
  }
});

class BtnChapterModal extends React.Component {
  state = {
    modalIsVisible: false,
    videoMarkers: [],
    modalFrame: { x: 0, y: 0, width: 0, height: 0 }
  };

  render() {
    const {
      isPhone,
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
    const width = 400;

    return (
      <ModalButton onPress={this.displayModal}>
        <Text
          style={{
            flex: 1,
            minWidth: 50,
            height: 30,
            marginTop: 10,
            paddingTop: isPhone ? 0 : 4,
            fontSize: isPhone ? 16 : 20,
            lineHeight: isPhone ? 18 : 20,
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
                fontSize: 22,
                fontWeight: "800",
                height: 24,
                marginBottom: 20
              }}
            >
              Video Chapters
            </Text>

            <FlatList
              keyExtractor={(item, index) => index}
              data={videoMarkers}
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
                  <TouchableOpacity
                    style={{ flex: -1 }}
                    onPress={() => {
                      this.handlePress(item);
                    }}
                  >
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      {item.type === "marker" && (
                        <View
                          style={{
                            width: 12,
                            marginRight: 10,
                            marginVertical: 10
                          }}
                        >
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
      this.props.currentMarker !== nextProps.currentMarker ||
      this.state.modalIsVisible !== nextState.modalIsVisible ||
      this.state.modalFrame !== nextState.modalFrame
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
    this.props.onForceControlsVisible(true);
    this.setState({ modalIsVisible: true, modalFrame: frame });
  };

  dismissModal = () => {
    this.props.onForceControlsVisible(false);
    this.setState({ modalIsVisible: false });
  };

  handlePress = marker => {
    this.props.onMarkerPress(marker.begin);
    this.props.onForceControlsVisible(false);
    this.dismissModal();
  };
}

BtnChapterModal.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  currentChapter: PropTypes.object,
  currentMarker: PropTypes.object,
  videoMarkers: PropTypes.array.isRequired,
  onMarkerPress: PropTypes.func.isRequired,
  onForceControlsVisible: PropTypes.func
};

export default BtnChapterModal;
