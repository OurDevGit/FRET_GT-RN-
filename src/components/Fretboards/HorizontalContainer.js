import React from "react";
import { connect } from "react-redux";
import { View, FlatList } from "react-native";
import PageControl from "react-native-page-control";
import Fretboard from "./Fretboard";

const keyExtractor = (item, index) => index;
const emptyTrack = { name: undefined, isBass: false };

class FretboardsContainer extends React.Component {
  state = {
    height: 0,
    width: 0
  };

  render() {
    return (
      <View
        style={{ width: "100%", aspectRatio: 4, backgroundColor: "#E6D9B9" }}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            horizontal
            pagingEnabled
            directionalLockEnabled
            removeClippedSubviews={false}
            initialNumToRender={1}
            keyExtractor={keyExtractor}
            data={this.props.tracks.toJS()}
            onLayout={this.adjustPageSize.bind(this)}
            onMomentumScrollEnd={this.props.onScrollEnd}
            ListEmptyComponent={() =>
              <Fretboard
                deviceWidth={this.props.deviceWidth}
                track={emptyTrack}
                style={{ width: this.state.width, height: this.state.height }}
              />}
            renderItem={({ item }) =>
              <Fretboard
                deviceWidth={this.props.deviceWidth}
                track={item}
                style={{ width: this.state.width, height: this.state.height }}
              />}
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

  adjustPageSize(e) {
    this.setState({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width
    });
  }
}

export default FretboardsContainer;
