import React, {Component} from "react";
import { connect } from "react-redux";
import { View, Text } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { Set } from 'immutable'

import { notesForTrackAtFret } from '../../selectors'
import { subscribeToTimeUpdates } from "../../time-store";

import FretboardNote from "./FretboardNote";
import FretMarkers from "./FretboardMarkers";

class FretboardFret extends Component {

  state = {
    note0Visible: false,
    note1Visible: false,
    note2Visible: false,
    note3Visible: false,
    note4Visible: false,
    note5Visible: false
  }
  
  render() {
    const { style, fret, track, isBass } = this.props
    // console.log("rendering", track, fret)
    return (
      <View style={{ ...style, flex: 1 }}>
        <Text style={{ width: "100%", height: 12, fontSize: 10, marginBottom: 4, textAlign: "center", backgroundColor: "#E6D9B9" }} >{this.fretName(fret)}</Text>
        <View style={{ flex: 1, backgroundColor: "black"}}>
          {fret === 0 &&
            <LinearGradient 
              colors={["#f2b172", "#f0b072", "#c29b74", "#8d7b68", "#4f4c48"]} 
              start={{ x: 0.1, y: 0.0 }}
              end={{ x: 0.9, y: 0.0 }}
              style={{ position: "absolute", width: "100%", height: "100%" }} 
            />}
          
          <View style={{ position: "absolute", right: 0, width: 4, height: "100%", backgroundColor: '#CCCCCC' }} />
          <FretMarkers fretIndex={fret}/>

          <View style={{ width: "100%", height: "100%", paddingVertical: 3, justifyContent: "space-between", alignItems: "center", marginLeft: -3 }} >
            {this.noteViews(fret, track, isBass)}
          </View>
        </View>
        
      </View>)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.note0Visible !== this.state.note0Visible ||
      nextState.note1Visible !== this.state.note1Visible ||
      nextState.note2Visible !== this.state.note2Visible ||
      nextState.note3Visible !== this.state.note3Visible ||
      nextState.note4Visible !== this.state.note4Visible ||
      nextState.note5Visible !== this.state.note5Visible
  }

  fretName(index) {
    return index === 0 ? "Nut" : index
  }

  noteViews(fretIndex,  track, isBass) {
    var views = []

    views.push(<FretboardNote key={0} fret={fretIndex} string={0} isVisible={this.state.note0Visible} />)
    views.push(<FretboardNote key={1} fret={fretIndex} string={1} isVisible={this.state.note1Visible} />)
    views.push(<FretboardNote key={2} fret={fretIndex} string={2} isVisible={this.state.note2Visible} />)
    views.push(<FretboardNote key={3} fret={fretIndex} string={3} isVisible={this.state.note3Visible} />)
    views.push(<FretboardNote key={4} fret={fretIndex} string={4} isVisible={this.state.note4Visible} />)
    views.push(<FretboardNote key={5} fret={fretIndex} string={5} isVisible={this.state.note5Visible} />)

    return views
  }

  matchingNotes(notesSet, time) {
    if (notesSet !== undefined) {
      const matching = notesSet.filter(note => {
        return note.get("begin") <= time && note.get("end") > time
      })
      return matching.count() > 0
    } else {
      return false
    }
  }

  updateTimeSubscription() {
    subscribeToTimeUpdates((payload) => {
      const {time, progress, duration} = payload

      this.setState({
        note0Visible: this.matchingNotes(this.props.notes.get(0), time),
        note1Visible: this.matchingNotes(this.props.notes.get(1), time),
        note2Visible: this.matchingNotes(this.props.notes.get(2), time),
        note3Visible: this.matchingNotes(this.props.notes.get(3), time),
        note4Visible: this.matchingNotes(this.props.notes.get(4), time),
        note5Visible: this.matchingNotes(this.props.notes.get(5), time)
      })
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
}

const mapStateToProps = (state, props) => {
  return {
    notes: notesForTrackAtFret(state, props)
  };
};

export default connect(mapStateToProps, undefined)(FretboardFret);
