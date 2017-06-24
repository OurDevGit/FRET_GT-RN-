import React from "react";
import { connect } from "react-redux";
import { FlatList } from "react-native";

import * as actions from "../redux/actions";
import Fretboard from "./Fretboard";

class FretboardsContainer extends React.Component {
  state = {
    data: []
  };
  
  render() {
    return (
      <FlatList 
        style={{ top: 23, left: 0, marginRight: 8, marginLeft: 8, flex: 1 }}
        horizontal={true}
        data={ this.props.tracks } renderItem={({ item }) => (
          <Fretboard track={item} />
        )}
      >
      </FlatList>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    tracks
  };
};

export default connect(mapStateToProps, actions)(FretboardsContainer);
