import React from "react";
import PropTypes from "prop-types";
import { View, FlatList, StyleSheet } from "react-native";
import Fretboard from "./Fretboard";

const keyExtractor = (item, index) => index;
const emptyTrack = { name: undefined, isBass: false };

class HorizontalContainer extends React.Component {
  render() {
    let width = this.props.deviceWidth;
    let paddingBottom = this.props.isVideo ? 15 : 20;
    const boardStyle = [styles.board, { width, paddingBottom }];

    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            horizontal
            pagingEnabled
            directionalLockEnabled
            ref={ref => {
              this.flatList = ref;
            }}
            removeClippedSubviews={false}
            initialNumToRender={1}
            keyExtractor={keyExtractor}
            data={this.props.tracks.toJS()}
            onMomentumScrollEnd={this.props.onScrollEnd}
            ListEmptyComponent={() => (
              <Fretboard
                isPhone={this.props.isPhone}
                isHidingLabels={true}
                leftHandState={this.props.leftHandState}
                currentNotation={this.props.currentNotation}
                track={emptyTrack}
                showSmart={false}
                isSmart={false}
                trackIndex={-1}
                boardWidth={this.props.deviceWidth}
                style={boardStyle}
              />
            )}
            renderItem={({ item, index }) => {
              const fretRange = item.lastFret - item.firstFret;
              const showSmart =
                item.name !== "" && !this.props.isVideo && fretRange < 12;
              return (
                <Fretboard
                  isPhone={this.props.isPhone}
                  isHidingLabels={this.props.isVideo && this.props.isPhone}
                  leftHandState={this.props.leftHandState}
                  currentNotation={this.props.currentNotation}
                  track={item}
                  showSmart={showSmart}
                  isSmart={false}
                  trackIndex={index}
                  boardWidth={this.props.deviceWidth}
                  style={boardStyle}
                />
              );
            }}
          />
        </View>
      </View>
    );
  }

  shouldComponentUpdate(nextProps) {
    return (
      this.props.currentNotation !== nextProps.currentNotation ||
      !this.props.tracks.equals(nextProps.tracks) ||
      nextProps.tracks.count() === 0
    );
  }

  setPage = page => {
    this.flatList.scrollToIndex({ animated: true, index: page });
  };

  setJamBar = bool => {
    this.flatList.scrollToIndex({ animated: true, index: 0 });
    this.flatList.setNativeProps({ scrollEnabled: !bool });
  };
}

const styles = StyleSheet.create({
  board: {
    height: "100%",
    paddingTop: "0.5%",
    paddingHorizontal: "1%"
  }
});

HorizontalContainer.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  isVideo: PropTypes.bool.isRequired,
  leftHandState: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  deviceWidth: PropTypes.number.isRequired,
  tracks: PropTypes.object.isRequired,
  onScrollEnd: PropTypes.func.isRequired,
  onPage: PropTypes.func.isRequired
};

export default HorizontalContainer;
