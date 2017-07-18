import React, { Component } from "react";
import { Text } from "react-native";
import { subscribeToTimeUpdates } from "../../time-store";

class PlaybackCounter extends Component {
  state = {
    time: "00:00"
  }

  render() {
    return <Text style={{ width: 40, height: 20, marginHorizontal: 15, textAlign: "center" }}>{this.state.time}</Text>
  }

  updateTimeSubscription() {
    subscribeToTimeUpdates((payload) => {
      const {time, progress, duration} = payload

      if (this.props.type === "elapsed") {
        this.setState({ time: this.formattedTime(time)})
      } else {
        var t = duration - time
        this.setState({ time: "-" + this.formattedTime(t)})
      }
    })
  }

  componentDidMount() {
    this.updateTimeSubscription()
  }

  componentWillReceiveProps(newProps) {
    if (newProps.duration !== this.props.duration) {
      this.updateTimeSubscription()
    }
  }

  formattedTime = time => {
    if (time === undefined) return "00:00"
    var minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;

    var seconds = Math.floor(time - minutes * 60);
    if (seconds < 10) seconds = "0" + seconds;

    return minutes + ":" + seconds;
  }
}

export default PlaybackCounter;
