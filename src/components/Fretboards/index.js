import React from "react";
import { connect } from "react-redux";
import { FlatList } from "react-native";

import * as actions from "../../redux/actions";
import Fretboard from "./Fretboard";

const keyExtractor = (item, index) => index

class FretboardsContainer extends React.Component {
  render() {
    return (
      <FlatList 
        style={{ top: 23, left: 0, marginRight: 8, marginLeft: 8, flex: 1}}
        horizontal={true}
        keyExtractor={keyExtractor}
        data={ this.props.tracks.toJS() }
        ListEmptyComponent={() => (
          <Fretboard />
        )}
        renderItem={({ item }) => (
          <Fretboard track={item} />
        )}
      >
      </FlatList>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    tracks: state.get("guitarTracks")
  };
};

export default connect(mapStateToProps, actions)(FretboardsContainer);
