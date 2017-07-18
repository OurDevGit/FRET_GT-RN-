import React, { Component } from "react";
import PropTypes from 'prop-types';
import { View, Dimensions, Text } from "react-native";

import { PrimaryBlue } from "../../design"

import Playhead from "./Playhead";
import PlaybackCounter from "./PlaybackCounter";
import PlaybackMarkers from "./PlaybackMarkers";

class PlaybackTimeline extends Component {
  state = {
    layout: { width: 1 },
    containerLayout: { width: 1 }
  };

  render() {
    return (
      <View 
        style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "flex-start", marginHorizontal: 10, marginTop: 8 }}
        onLayout={this.handleContainerLayout}
      >
        <PlaybackMarkers 
          left={this.state.layout.x}
          width={this.state.containerLayout.width}
          height={this.state.containerLayout.height - this.state.layout.height}
          duration={this.props.duration}
          markers={this.props.markers.toJS()}
          onMarkerPress={this.props.onMarkerPress}
        />
        <PlaybackCounter type="elapsed" duration={this.props.duration} />
        <View style={{ flex: 1, height: 18 }} onLayout={this.handleLayout} >
          <View
            style={{
              position: "absolute",
              height: 1,
              width: "100%",
              backgroundColor: PrimaryBlue,
              top: 10,
              marginTop: -0.5
            }}
          />
          <Playhead
            duration={this.props.duration}
            onScrub={this.props.onScrub}
            width={this.state.layout.width - 18}
          />
        </View>
        <PlaybackCounter type="remaining" duration={this.props.duration} />
      </View>
    );
  }

  handleContainerLayout = e => {
    this.setState({
      containerLayout: { ...e.nativeEvent.layout }
    });
  };

  handleLayout = e => {
    this.setState({
      layout: { ...e.nativeEvent.layout }
    });
  };
}

PlaybackTimeline.propTypes = {
  onScrub: PropTypes.func
};

export default PlaybackTimeline;
