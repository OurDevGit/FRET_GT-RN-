import React from "react";
import { connect } from "react-redux";
import { FlatList } from "react-native";

import * as actions from "../../redux/actions";
import Fretboard from "./Fretboard";

const keyExtractor = (item, index) => index

class FretboardsContainer extends React.Component {
  state = {
    height: 0,
    width: 0,
    selectedIndex: 0,
  };

  render() {
    return (
      <FlatList 
        style={{ top: 20, left: 0, marginRight: 8, marginLeft: 8, flex: 1, backgroundColor: "#E6D9B9"}}
        horizontal
        pagingEnabled
        directionalLockEnabled
        removeClippedSubviews={false}
        keyExtractor={keyExtractor}
        data={ this.props.tracks.toJS() }
        onLayout={this.adjustPageSize.bind(this)}
        ListEmptyComponent={() => (
          <Fretboard style={{ width: this.state.width, height: this.state.height }} />
        )}
        renderItem={({ item }) => (
          <Fretboard track={item} style={{ width: this.state.width, height: this.state.height }} />
        )}
      >
      </FlatList>
    );
  }

  adjustPageSize(e) {
    this.setState({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  }
}

const mapStateToProps = (state, props) => {
  return {
    tracks: state.get("guitarTracks")
  };
};

export default connect(mapStateToProps, actions)(FretboardsContainer);


