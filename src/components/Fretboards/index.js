import React from "react";
import { connect } from "react-redux";
import { View, FlatList } from "react-native";

import * as actions from "../../redux/actions";
import Fretboard from "./Fretboard";
import EmptyFretboard from "./EmptyFretboard";

const keyExtractor = (item, index) => index

class FretboardsContainer extends React.Component {
  state = {
    height: 0,
    width: 0,
    selectedIndex: 0,
  };
  
  render() {
    
    return (
      <View style={{ flex: 1, marginVertical: 10, backgroundColor: "#E6D9B9"}}>
        {(this.props.tracks.length === 0) ? 
        <EmptyFretboard />
        :
        <FlatList 
          horizontal
          pagingEnabled
          directionalLockEnabled
          removeClippedSubviews={false}
          initialNumToRender={1}
          keyExtractor={keyExtractor}
          data={ this.props.tracks }
          onLayout={this.adjustPageSize.bind(this)}
          onMomentumScrollEnd={this.onScrollEnd.bind(this)}
          ListEmptyComponent={() => (
            <EmptyFretboard />
          )}
          renderItem={({ item }) => (
            <Fretboard track={item} style={{ width: this.state.width, height: this.state.height }} />
          )}
        >
        </FlatList>
        }

      </View>
    );
  }
  
  adjustPageSize(e) {
    this.setState({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  }

  onScrollEnd(e) {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;

    // Divide the horizontal offset by the width of the view to see which page is visible
    let boardIndex = Math.floor(contentOffset.x / viewSize.width);
    console.log('scrolled to fretboard ', boardIndex);
  }
}

const mapStateToProps = (state, props) => {
  return {
    tracks: state.get("guitarTracks").toJS()
  };
};

export default connect(mapStateToProps, actions)(FretboardsContainer);


