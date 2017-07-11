import React from "react";
import { connect } from "react-redux";
import { View, FlatList } from "react-native";
import Fretboard from "./Fretboard";

const keyExtractor = (item, index) => index

class FretboardsContainer extends React.Component {
  state = {
    height: 0,
    width: 0,
  };
  
  render() {
    return (
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
          ListEmptyComponent={() => (
            <Fretboard style={{ width: this.state.width, height: this.state.height }}/>
          )}
          renderItem={({ item }) => (
            <Fretboard track={item} style={{ width: this.state.width, height: this.state.height }} />
          )}
        >
        </FlatList>
      </View>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !this.props.tracks.equals(nextProps.tracks) || nextProps.tracks.count() === 0;
  }
  
  adjustPageSize(e) {
    this.setState({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  }
}

export default FretboardsContainer;