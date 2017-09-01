import React from "react";
import { View, Alert } from "react-native";
import PropTypes from "prop-types";
import { Map } from "immutable";

import PlaybackPrimary from "./PlaybackPrimary";
import PlaybackTimeline from "./PlaybackTimeline";
import PlaybackSecondary from "./PlaybackSecondary";
import PlaybackCompact from "./Compact";
import PlaybackTimelineCompact from "./Compact/Timeline";
import SaveLoopModal from "./SaveLoopModal";
import MyLoopsModal from "./MyLoopsModal";
import FretlightModal from "./FretlightModal";

import Music from "./Music";
import Midi from "./Midi";
import { playerBackground } from "../../design";

import { loadMidi, clearMidi } from "../../selectors";
import { realmify, guid } from "../../realm";

class Song extends React.Component {
  state = {
    isVideo: false,
    isPlaying: false,
    mediaDuration: 0,
    playbackProgress: 0.0,
    playbackSeconds: 0.0,
    musicRate: 1,
    playbackRate: 1,
    seek: -1,
    saveLoopModalText: "",
    saveLoopModalIsVisible: false,
    myLoopsSourceFrame: { x: 0, y: 0, width: 0, height: 0 },
    myLoopsModalIsVisible: false,
    myLoopsModalIsEditing: false,
    fretlightModalIsVisible: false
  };

  render() {
    const mediaTitle =
      this.props.song !== undefined ? this.props.song.name : "";
    const mediaId = this.props.song !== undefined ? this.props.song.midi : "";
    const isCompact = this.props.height < 150;
    const savedLoops = this.props.loops === undefined ? [] : this.props.loops;
    // console.log("currentLoop", this.props.currentLoop.toJS());

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: playerBackground,
          margin: isCompact ? 0 : 4,
          padding: isCompact ? 0 : 2,
          borderRadius: isCompact ? 0 : 6
        }}
      >
        <Music
          seek={this.state.seek}
          rate={this.state.musicRate}
          isPlaying={this.state.isPlaying}
          song={this.props.song}
          onProgress={this.handleMusicProgress}
          onData={this.handleMusicData}
        />
        <Midi
          midi={this.props.song.midi}
          onData={this.props.updateMidiData}
          clearMidiData={this.props.clearMidiData}
          clearMidi={clearMidi}
          loadMidi={loadMidi}
        />

        {isCompact
          ? <View style={{ flex: 1 }}>
              <PlaybackCompact
                title={mediaTitle}
                trackCount={this.props.trackCount}
                isPlaying={this.state.isPlaying}
                rate={this.state.playbackRate}
                loopIsEnabled={this.props.loopIsEnabled}
                onToggleLibrary={this.props.onToggleLibrary}
                onPreviousPress={this.handlePreviousPress}
                onBackPress={this.handleBackPress}
                onPlayPausePress={this.handlePlayPausePress}
                onForwardPress={this.handleForwardPress}
                onNextPress={this.handleNextPress}
                onLoopEnable={this.handleLoopEnable}
                onSelectTempo={this.handleSelectTempo}
                onDisplayMyLoops={this.handleDisplayMyLoopsModal}
              />
              <PlaybackTimelineCompact
                progress={this.state.playbackProgress}
                duration={this.state.mediaDuration}
                markers={this.props.markers}
                currentLoop={this.props.currentLoop}
                loopIsEnabled={this.props.loopIsEnabled}
                onScrub={this.handleScrub}
                onMarkerPress={this.handleMarkerPress}
                onMarkerLongPress={this.handleMarkerLongPress}
              />
            </View>
          : <View style={{ flex: 1 }}>
              <PlaybackPrimary
                mediaId={mediaId}
                title={mediaTitle}
                isPlaying={this.state.isPlaying}
                onPreviousPress={this.handlePreviousPress}
                onBackPress={this.handleBackPress}
                onPlayPausePress={this.handlePlayPausePress}
                onForwardPress={this.handleForwardPress}
                onNextPress={this.handleNextPress}
              />
              <PlaybackTimeline
                progress={this.state.playbackProgress}
                duration={this.state.mediaDuration}
                markers={this.props.markers}
                currentLoop={this.props.currentLoop}
                loopIsEnabled={this.props.loopIsEnabled}
                onScrub={this.handleScrub}
                onMarkerPress={this.handleMarkerPress}
                onMarkerLongPress={this.handleMarkerLongPress}
                onLoopEnable={this.handleLoopEnable}
              />
              <PlaybackSecondary
                mediaId={mediaId}
                tempo={this.state.playbackRate}
                loopIsEnabled={this.props.loopIsEnabled}
                currentLoop={this.props.currentLoop}
                connectedDevices={this.props.connectedDevices}
                onSelectTempo={this.handleSelectTempo}
                onLoopEnable={this.handleLoopEnable}
                onLoopBegin={this.handleLoopBegin}
                onLoopEnd={this.handleLoopEnd}
                onSetCurrentLoop={this.props.setCurrentLoop}
                onDisplaySaveLoopModal={this.handleDisplaySaveLoopModal}
                onDisplayMyLoops={this.handleDisplayMyLoopsModal}
                onDisplayInfo={this.handleDisplayInfoAlert}
                onDisplayFretlightStatus={this.handleDisplayFretlightModal}
              />
            </View>}

        <SaveLoopModal
          isVisible={this.state.saveLoopModalIsVisible}
          existingName={this.props.currentLoop.get("name")}
          onTextChange={this.handleSaveLoopTextInput}
          onCancel={this.handleSaveLoopCancel}
          onSave={this.handleSaveLoopSave}
        />

        <MyLoopsModal
          isVisible={this.state.myLoopsModalIsVisible}
          isEditing={this.state.myLoopsModalIsEditing}
          loops={savedLoops}
          currentLoop={this.props.currentLoop.toJS()}
          sourceFrame={this.state.myLoopsSourceFrame}
          onToggleEditing={this.toggleMyLoopsEditing}
          onCancel={this.handleMyLoopsCancel}
          onDelete={this.handleMyLoopsDelete}
          onClear={this.handleMyLoopsClear}
          onSelect={this.handleMyLoopsSelect}
        />

        <FretlightModal
          isVisible={this.state.fretlightModalIsVisible}
          connectedDevices={this.props.connectedDevices}
          onDismiss={this.handleDismissFretlightModal}
        />
      </View>
    );
  }

  handleMusicData = data => {
    this.setState({
      mediaDuration: data.duration,
      isPlaying: false
    });
  };

  handleMusicProgress = (musicSeconds, duration) => {
    const { loopIsEnabled, currentLoop, updateTime } = this.props;
    const { playbackProgress, seconds } = this.state;
    const progress = musicSeconds / duration;
    if (progress != playbackProgress || musicSeconds !== seconds) {
      const loop = currentLoop.toJS() || { begin: -1, end: duration };

      if (loopIsEnabled && musicSeconds >= loop.end && loop.begin > -1) {
        this.setState({
          seek: loop.begin
        });
      } else {
        this.setState({
          playbackProgress: progress,
          playbackSeconds: musicSeconds,
          seek: -1
        });

        updateTime(musicSeconds);
      }
    }
  };

  // PLAYBACK METHODS
  handlePreviousPress = () => {
    const { markers } = this.props;
    const seconds = this.state.playbackSeconds;

    if (markers.count() === 0 || markers.first().time > seconds) {
      this.setState({
        seek: 0
      });
    } else {
      for (let marker of markers.reverse()) {
        if (marker.time + 1 < seconds) {
          this.setState({
            seek: marker.time
          });
          break;
        }
      }
    }
  };

  handleBackPress = () => {
    this.setState({
      seek: this.state.playbackSeconds - 5
    });
  };

  handlePlayPausePress = () => {
    this.setState({
      isPlaying: !this.state.isPlaying,
      musicRate: this.state.playbackRate
    });
  };

  handleForwardPress = () => {
    this.setState({
      seek: this.state.playbackSeconds + 30
    });
  };

  handleNextPress = marker => {
    const { markers } = this.props;
    const seconds = this.state.playbackSeconds;

    if (markers.count() === 0 || markers.last().time < seconds) {
      this.setState({
        seek: 0
      });
    } else {
      for (let marker of markers) {
        if (marker.time > seconds) {
          this.setState({
            seek: marker.time
          });
          break;
        }
      }
    }
  };

  // TIMELINE METHODS

  handleMarkerPress = time => {
    this.props.clearCurrentLoop();
    this.setState({
      seek: time
    });
  };

  handleMarkerLongPress = (begin, end) => {
    const loop = Map({ begin, end });
    this.props.setCurrentLoop(loop);
    this.setState({
      seek: begin
    });
  };

  handleScrub = progress => {
    this.setState({
      seek: progress * this.state.mediaDuration
    });
  };

  // TEMPO METHODS

  handleSelectTempo = tempo => {
    this.setState({ playbackRate: tempo });
  };

  // LOOP METHODS

  handleLoopEnable = () => {
    this.props.enableLoop(!this.props.loopIsEnabled);
  };

  handleLoopBegin = () => {
    const begin = this.state.playbackSeconds;
    const end = this.props.currentLoop.get("end") || this.props.duration;

    var loop = this.props.currentLoop.set("begin", begin);
    loop = begin > end ? loop.delete("end") : loop;

    this.props.setCurrentLoop(loop);
  };

  handleLoopEnd = () => {
    const begin = this.props.currentLoop.get("begin") || this.props.duration;
    const end = this.state.playbackSeconds;

    var loop = this.props.currentLoop.set("end", end);
    loop = begin > end ? loop.set("begin", 0) : loop;

    this.props.setCurrentLoop(loop);
  };

  // SAVE LOOP

  handleDisplaySaveLoopModal = () => {
    const begin = this.props.currentLoop.get("begin");
    const end = this.props.currentLoop.get("end");
    if (begin === undefined && end == undefined) {
      Alert.alert(
        "Loop Times",
        "Please set a begin and end time for your loop"
      );
    } else {
      this.setState({ saveLoopModalIsVisible: true });
    }
  };

  handleSaveLoopTextInput = text => {
    this.setState({ saveLoopModalText: text });
  };

  handleSaveLoopCancel = () => {
    this.setState({ saveLoopModalIsVisible: false });
  };

  handleSaveLoopSave = () => {
    const name = this.state.saveLoopModalText;

    if (name === "") {
      Alert.alert("Loop Name", "Please enter a name with at least 1 character");
    } else {
      const loop = this.props.currentLoop
        .set("name", name)
        .set("mediaId", this.props.song.midi);
      this.props.setCurrentLoop(loop);
      this.props.createLoop(loop.toJS());
      this.setState({ saveLoopModalIsVisible: false });
    }
  };

  // MY LOOPS

  handleDisplayMyLoopsModal = frame => {
    if (this.props.loops.length === 0) {
      Alert.alert(
        "No Loops",
        "You currently have no saved loops for this media"
      );
    } else {
      this.setState({ myLoopsModalIsVisible: true, myLoopsSourceFrame: frame });
    }
  };

  toggleMyLoopsEditing = () => {
    const bool = !this.state.myLoopsModalIsEditing;
    this.setState({ myLoopsModalIsEditing: bool });
  };

  handleMyLoopsCancel = () => {
    this.setState({ myLoopsModalIsVisible: false });
  };

  handleMyLoopsDelete = loop => {
    if (loop === this.props.currentLoop) {
      this.props.clearCurrentLoop();
    }

    this.props.deleteLoop(loop);
  };

  handleMyLoopsClear = () => {
    this.props.clearCurrentLoop();
    this.setState({ myLoopsModalIsVisible: false });
  };

  handleMyLoopsSelect = loop => {
    this.props.setCurrentLoop(Map(loop));
    this.setState({ myLoopsModalIsVisible: false });
  };

  // INFO

  handleDisplayInfoAlert = () => {
    console.log("INFO");
    Alert.alert(
      "UNLEASH THE REAL POWER OF GUITAR TUNES!",
      "The Fretlight Guitar lights fingering positions right on the neck of a real guitar. Everything you see in Guitar Tunes will light in real-time right under your fingers!"
    );
  };

  handleDisplayFretlightModal = frame => {
    this.setState({ fretlightModalIsVisible: true });
  };

  handleDismissFretlightModal = () => {
    this.setState({ fretlightModalIsVisible: false });
  };
}

Song.propTypes = {
  song: PropTypes.object,
  height: PropTypes.number,
  clearCurrentLoop: PropTypes.func,
  updateMidiData: PropTypes.func,
  clearMidiData: PropTypes.func,
  loopIsEnabled: PropTypes.bool
};

const mapQueriesToProps = (realm, ownProps) => ({
  loops: realm.objects("Loop").filtered("mediaId == $0", ownProps.song.midi)
});

const mapMutationsToProps = ({ create, destroy }) => ({
  createLoop: loop => {
    var obj = { ...loop, id: guid() };
    create("Loop", obj);
  },
  updateLoop: loop => {
    create("Loop", loop, true);
  },
  deleteLoop: loop => {
    destroy(loop);
  }
});

export default realmify(mapQueriesToProps, mapMutationsToProps)(Song);
