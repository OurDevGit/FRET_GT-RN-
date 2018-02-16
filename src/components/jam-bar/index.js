import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../../redux/actions";
import { getPattern } from "../chords-and-scales/utils";
import { Table, getJamBarData } from "./utils";
import { loadPatternNotes } from "../../midi-store";
import { startJamBar, trackJamBar, trackJamBarPattern } from "../../metrics";
import {
  subscribeToTimeUpdates,
  unsubscribeToTimeUpdates,
  getCurrentTime
} from "../../time-store";
import JamBarPresentation from "./presentation";

const scales = "Scales";

class JamBar extends React.Component {
  constructor(props) {
    super(props);
    this.types = [];
    this.keys = [];
    this.positions = [];
    this.currentTime = 0;
    this.userIsSelecting = false;
    this.isMounted_ = false;
  }

  state = {
    currentType: undefined,
    currentKey: undefined,
    currentPosition: "All"
  };

  render() {
    return (
      <JamBarPresentation
        currentType={this.state.currentType}
        currentKey={this.state.currentKey}
        currentPosition={this.state.currentPosition}
        types={this.types}
        keys={this.keys}
        positions={this.positions}
        onSelection={this.handleSelection}
        onPreset={this.handlePreset}
      />
    );
  }

  componentWillMount = () => {
    const { types, keys, positions } = getJamBarData();
    this.types = types;
    this.keys = keys;
    this.positions = positions;
  };

  componentDidMount = async () => {
    startJamBar();
    this.isMounted_ = true;
    subscribeToTimeUpdates(this.handleTimeUpdate);
    this.currentTime = getCurrentTime();
    requestAnimationFrame(this.handleAnimationFrame);
  };

  componentWillUnmount = () => {
    trackJamBar();
    this.isMounted_ = false;
    unsubscribeToTimeUpdates(this.handleTimeUpdate);
  };

  handleTimeUpdate = time => {
    this.currentTime = time;
  };

  handleAnimationFrame = async () => {
    if (this.isMounted_ !== true || this.userIsSelecting === true) {
      return;
    }

    var currentPattern;
    const patterns = this.props.jamBarTrack.get("patterns");
    const filtered = patterns.filter(
      pattern => pattern.get("begin") <= this.currentTime
    );

    if (filtered.count() > 0) {
      currentPattern = filtered.last();
    } else if (patterns.count() > 0) {
      currentPattern = patterns.first();
    }

    if (currentPattern !== undefined) {
      let currentType = currentPattern.get("type");
      let currentKey = currentPattern.get("key");
      let currentPosition = "All";

      if (
        this.userIsSelecting === false &&
        (currentType !== this.state.currentType ||
          currentKey !== this.state.currentKey ||
          currentPosition !== this.state.currentPosition)
      ) {
        this.setState({ currentType, currentKey, currentPosition });
      }
    }

    if (this.isMounted_ === true) {
      requestAnimationFrame(this.handleAnimationFrame);
    }
  };

  componentDidUpdate = async () => {
    this.updatePatternTrack();
  };

  handleSelection = async (item, table) => {
    this.userIsSelecting = true;
    switch (table) {
      case Table.Type:
        this.setState({ currentType: item });
        break;
      case Table.Key:
        this.setState({ currentKey: item });
        break;
      case Table.Position:
        this.setState({ currentPosition: item });
        break;
      default:
        break;
    }
  };

  updatePatternTrack = async () => {
    const { currentType, currentKey, currentPosition } = this.state;
    let pattern = await getPattern(
      scales,
      currentType,
      currentKey,
      currentPosition
    );

    if (pattern !== undefined) {
      trackJamBarPattern(pattern.patternId);

      let rootKey = pattern.root.split("/");
      var root;
      if (rootKey.length > 1) {
        if (this.props.currentNotation === "Sharps") {
          root = rootKey[0];
        } else {
          root = rootKey[1];
        }
      } else {
        root = rootKey[0];
      }
      loadPatternNotes("jamBar", pattern.name, root, pattern.notes);
    }
  };

  handlePreset = () => {
    this.userIsSelecting = false;
    requestAnimationFrame(this.handleAnimationFrame);
  };
}

JamBar.propTypes = {
  jamBarTrack: PropTypes.object.isRequired,
  currentNotation: PropTypes.string.isRequired,
  clearMidiData: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    jamBarTrack: state.get("jamBarTrack"),
    currentNotation: state.get("currentNotation")
  };
};

export default connect(mapStateToProps, actions)(JamBar);
