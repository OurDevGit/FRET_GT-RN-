import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, FlatList } from "react-native";
import PageControl from "react-native-page-control";
import Fretboard from "./Fretboard";

const keyExtractor = (item, index) => index;
const emptyTrack = { name: undefined, isBass: false };

class HorizontalContainer extends React.Component {
  state = {
    height: 0,
    width: 0
  };

  render() {
    const boardStyle = {
      width: this.state.width,
      height: this.state.height,
      paddingTop: "0.5%",
      paddingBottom: 20,
      paddingHorizontal: "1%"
    };
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <FlatList
            horizontal
            pagingEnabled
            directionalLockEnabled
            removeClippedSubviews={false}
            initialNumToRender={1}
            keyExtractor={keyExtractor}
            data={this.props.tracks.toJS()}
            onLayout={this.handleLayout.bind(this)}
            onMomentumScrollEnd={this.props.onScrollEnd}
            ListEmptyComponent={() => (
              <Fretboard
                isPhone={this.props.isPhone}
                track={emptyTrack}
                showSmart={false}
                isSmart={false}
                boardWidth={this.state.width}
                style={boardStyle}
              />
            )}
            renderItem={({ item }) => (
              <Fretboard
                isPhone={this.props.isPhone}
                track={item}
                showSmart={item.get("name") !== ""}
                isSmart={false}
                boardWidth={this.state.width}
                style={boardStyle}
              />
            )}
          />
        </View>

        <PageControl
          style={{ position: "absolute", left: 0, right: 0, bottom: 7 }}
          numberOfPages={this.props.tracks.count()}
          currentPage={this.props.currentPage}
          hidesForSinglePage={true}
          pageIndicatorTintColor="gray"
          currentPageIndicatorTintColor="white"
          indicatorStyle={{ borderRadius: 5 }}
          currentIndicatorStyle={{ borderRadius: 5 }}
          indicatorSize={{ width: 8, height: 8 }}
        />
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !this.props.tracks.equals(nextProps.tracks) ||
      nextProps.tracks.count() === 0
    );
  }

  handleLayout(e) {
    this.setState({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width
    });
  }
}

HorizontalContainer.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  deviceWidth: PropTypes.number.isRequired,
  tracks: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  onScrollEnd: PropTypes.func.isRequired
};

export default HorizontalContainer;
