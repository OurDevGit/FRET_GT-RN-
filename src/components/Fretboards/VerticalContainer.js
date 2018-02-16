import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import Fretboard from "./Fretboard";

class VerticalContainer extends React.Component {
  render() {
    const width = this.props.deviceWidth;
    const height = this.props.boardHeight;
    const paddingTop = 8; //this.props.tracks.count() < 3 ? "0.5%" : 0;
    const paddingBottom = 5; //this.props.tracks.count() < 3 ? "1%" : 0;

    return (
      <View style={styles.container}>
        {this.props.tracks.map(track => {
          const fretRange = track.get("lastFret") - track.get("firstFret");
          const showSmart =
            track.get("name") !== "" && !this.props.isVideo && fretRange < 12;

          return (
            <Fretboard
              key={track.get("name")}
              isPhone={this.props.isPhone}
              leftHandState={this.props.leftHandState}
              currentNotation={this.props.currentNotation}
              showSmart={showSmart}
              track={track.toJS()}
              isSmart={false}
              boardWidth={width}
              trackIndex={-1}
              scrollIndex={-1}
              style={[
                styles.board,
                {
                  width,
                  height,
                  paddingTop,
                  paddingBottom
                }
              ]}
            />
          );
        })}
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
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "column", backgroundColor: "#E6D9B9" },
  board: {
    flex: 1,
    paddingHorizontal: "1%"
  }
});

VerticalContainer.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  isVideo: PropTypes.bool.isRequired,
  leftHandState: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  deviceWidth: PropTypes.number.isRequired,
  boardHeight: PropTypes.number.isRequired,
  tracks: PropTypes.object
};

export default VerticalContainer;
