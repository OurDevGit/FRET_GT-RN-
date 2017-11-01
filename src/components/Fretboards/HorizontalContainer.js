import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, FlatList } from "react-native";
import Fretboard from "./Fretboard";
import PageControl from "./PageControl";

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
      paddingBottom: this.props.isVideo ? 15 : 20,
      paddingHorizontal: "1%"
    };

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
            onLayout={this.handleLayout.bind(this)}
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
                scrollIndex={-1}
                boardWidth={this.state.width}
                style={boardStyle}
              />
            )}
            renderItem={({ item, index }) => (
              <Fretboard
                isPhone={this.props.isPhone}
                isHidingLabels={this.props.isVideo && this.props.isPhone}
                leftHandState={this.props.leftHandState}
                currentNotation={this.props.currentNotation}
                track={item}
                showSmart={item.name !== "" && !this.props.isVideo}
                isSmart={false}
                trackIndex={index}
                scrollIndex={this.props.currentPage}
                boardWidth={this.state.width}
                style={boardStyle}
              />
            )}
          />
        </View>

        <PageControl
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 7
          }}
          indicatorStyle={{
            marginLeft: 5,
            marginRight: 5,
            width: 8,
            height: 8,
            borderRadius: 5
          }}
          count={this.props.tracks.count()}
          currentPage={this.props.currentPage}
          offColor="gray"
          onColor="white"
          onPage={this.handlePage.bind(this)}
        />
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.currentPage !== nextProps.currentPage ||
      this.props.currentNotation !== nextProps.currentNotation ||
      !this.props.tracks.equals(nextProps.tracks) ||
      nextProps.tracks.count() === 0 ||
      this.state.height !== nextState.height ||
      this.state.width !== nextState.width
    );
  }

  handleLayout(e) {
    this.setState({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width
    });
  }

  handlePage(page) {
    this.props.onPage(page);
    this.flatList.scrollToIndex({ animated: true, index: page });
  }
}

HorizontalContainer.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  isVideo: PropTypes.bool.isRequired,
  leftHandState: PropTypes.bool.isRequired,
  currentNotation: PropTypes.string.isRequired,
  deviceWidth: PropTypes.number.isRequired,
  tracks: PropTypes.object.isRequired,
  currentPage: PropTypes.number.isRequired,
  onScrollEnd: PropTypes.func.isRequired,
  onPage: PropTypes.func.isRequired
};

export default HorizontalContainer;
