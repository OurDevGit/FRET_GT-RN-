import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Dimensions from "Dimensions";
import * as actions from "../../redux/actions";
import { Popover, getPattern, allNotesPattern } from "./utils";
import { View } from "react-native";
import { getIsPhone } from "../../utils";
import { playerBackground } from "../../design";
import ChordsAndScalesTabletPresentation from "./tablet-presentation";
import ChordsAndScalesPhonePresentation from "./phone-presentation";
import { loadPatternNotes, clearMidi } from "../../midi-store";
import { setPatternRootOn, setPatternRootOff } from "../../time-store";
import {
  getAllCsCategories,
  getCsTypes,
  getCsKeys,
  getCsPositions
} from "../../models/Patterns";
import {
  startChordsAndScales,
  trackChordsAndScales,
  trackFretlightStatusTap,
  trackChordsAndScalesPattern
} from "../../metrics";

class ChordsAndScales extends Component {
  constructor(props) {
    super(props);
    this.categories;
    this.types;
    this.keys;
    this.positions;

    this.blinkSpeed = 50;
    this.blinkDuration = 0;
    this.rootNotesAreOn = true;
  }

  state = {
    resource: undefined,
    popover: undefined,
    popoverSelectedItem: undefined,
    popoverItems: [],
    popoverFrame: { top: 0, left: 0, width: 0, height: 0 },
    currentCategory: undefined,
    currentType: undefined,
    currentKey: undefined,
    currentPosition: undefined,
    chart: undefined,
    photo: undefined,
    isBlinking: false,
    blinkSpeed: 0.5
  };

  render() {
    const isPhone = getIsPhone();

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: playerBackground,
          margin: isPhone ? 0 : 4,
          padding: isPhone ? 0 : 2,
          borderRadius: isPhone ? 0 : 6
        }}
      >
        {isPhone ? (
          <ChordsAndScalesPhonePresentation
            resource={this.state.resource}
            popover={this.state.popover}
            popoverFrame={this.state.popoverFrame}
            popoverSelectedItem={this.state.popoverSelectedItem}
            popoverItems={this.state.popoverItems}
            currentCategory={this.state.currentCategory}
            currentType={this.state.currentType}
            currentKey={this.state.currentKey}
            currentPosition={this.state.currentPosition}
            categories={this.categories}
            types={this.types}
            keys={this.keys}
            positions={this.positions}
            chart={this.state.chart}
            photo={this.state.photo}
            isBlinking={this.state.isBlinking}
            blinkSpeed={this.state.blinkSpeed}
            connectedDevices={this.props.connectedDevices}
            onPresentResource={this.handlePresentResource}
            onDismissResource={this.handleDismissResource}
            onPresentPopover={this.handlePresentPopover}
            onDismissPopover={this.handleDismissPopover}
            onSelection={this.handleSelection}
            onPrevPosition={this.handlePrevPosition}
            onNextPosition={this.handleNextPosition}
            onToggleBlinkNotes={this.toggleBlinkNotes}
            onUpdateBlinkSpeed={this.updateBlinkSpeed}
            onToggleFretlightAdmin={this.toggleFretlightAdmin}
          />
        ) : (
          <ChordsAndScalesTabletPresentation
            resource={this.state.resource}
            popover={this.state.popover}
            popoverFrame={this.state.popoverFrame}
            popoverSelectedItem={this.state.popoverSelectedItem}
            popoverItems={this.state.popoverItems}
            currentCategory={this.state.currentCategory}
            currentType={this.state.currentType}
            currentKey={this.state.currentKey}
            currentPosition={this.state.currentPosition}
            categories={this.categories}
            types={this.types}
            keys={this.keys}
            positions={this.positions}
            chart={this.state.chart}
            photo={this.state.photo}
            isBlinking={this.state.isBlinking}
            blinkSpeed={this.state.blinkSpeed}
            connectedDevices={this.props.connectedDevices}
            onPresentResource={this.handlePresentResource}
            onDismissResource={this.handleDismissResource}
            onPresentPopover={this.handlePresentPopover}
            onDismissPopover={this.handleDismissPopover}
            onSelection={this.handleSelection}
            onPrevPosition={this.handlePrevPosition}
            onNextPosition={this.handleNextPosition}
            onToggleBlinkNotes={this.toggleBlinkNotes}
            onUpdateBlinkSpeed={this.updateBlinkSpeed}
            onToggleFretlightAdmin={this.toggleFretlightAdmin}
          />
        )}
      </View>
    );
  }

  componentDidMount = async () => {
    startChordsAndScales();
    let cats = await getAllCsCategories();
    this.categories = [...cats, "All Notes"];
  };

  componentWillUnmount = () => {
    trackChordsAndScales();
    clearInterval(this.blinkInterval);
  };

  componentDidUpdate = async (prevProps, prevState) => {
    const {
      currentCategory,
      currentType,
      currentKey,
      currentPosition
    } = this.state;

    if (
      prevState.currentCategory !== currentCategory ||
      prevState.currentType !== currentType ||
      prevState.currentKey !== currentKey ||
      prevState.currentPosition !== currentPosition
    ) {
      this.types = await getCsTypes(currentCategory);
      this.keys = await getCsKeys(currentCategory, currentType);
      this.positions = await getCsPositions(
        currentCategory,
        currentType,
        currentKey
      );

      // check to see if a selection should reset any subequent selections
      // (i.e., switch from Major to Minor, Key of A should stay)

      var newState = {};
      // check type, key, position
      if (currentType !== undefined && this.types.indexOf(currentType) == -1) {
        newState.currentType = undefined;
      }

      if (currentKey !== undefined && this.keys.indexOf(currentKey) == -1) {
        newState.currentKey = undefined;
      }

      if (
        currentPosition !== undefined &&
        this.positions.indexOf(currentPosition) == -1
      ) {
        newState.currentPosition = undefined;
      }

      if (Object.keys(newState).length > 0) {
        this.setState(newState);
      } else {
        this.updatePatternTrack();
      }
    }
  };

  handlePresentResource = resource => {
    this.setState({ resource });
  };

  handleDismissResource = () => {
    this.setState({ resource: undefined });
  };

  handlePresentPopover = (popover, frame) => {
    const isPhone = getIsPhone();
    var popoverItems = [];
    var popoverSelectedItem = undefined;
    let deviceHeight = Dimensions.get("window").height;
    var width = isPhone ? 120 : 180;
    var rowHeight = isPhone ? 41 : 45;

    switch (popover) {
      case Popover.Category:
        popoverItems = this.categories;
        popoverSelectedItem = this.state.currentCategory;
        width = isPhone ? 200 : 250;
        break;
      case Popover.Type:
        popoverItems = this.types;
        popoverSelectedItem = this.state.currentType;
        width = isPhone ? 270 : 360;
        break;
      case Popover.Key:
        popoverItems = this.keys;
        popoverSelectedItem = this.state.currentKey;
        break;
      case Popover.Position:
        popoverItems = this.positions;
        popoverSelectedItem = this.state.currentPosition;
        width = isPhone ? 200 : 250;
        break;
      default:
        break;
    }

    var minLeft = isPhone ? frame.x + 60 : frame.x + 110;
    var left = Math.max(frame.x + frame.width + 10, minLeft);

    if (popover === Popover.Position && isPhone) {
      left = frame.x - width - 10;
    }

    if (popoverItems !== undefined && popoverItems.length > 0) {
      let height = Math.min(
        popoverItems.length * rowHeight,
        deviceHeight * 0.8
      );
      let top = Math.min(frame.y, deviceHeight - height - 20);

      let popoverFrame = { top, left, width, height };
      this.setState({
        popover,
        popoverSelectedItem,
        popoverItems,
        popoverFrame
      });
    }
  };

  handleDismissPopover = () => {
    this.setState({
      popover: undefined,
      popoverFrame: { top: 0, left: 0, width: 0, height: 0 }
    });
  };

  handleSelection = async (item, popover) => {
    switch (popover) {
      case Popover.Category:
        if (item === "All Notes") {
          this.setState({ currentCategory: item, popover: undefined });
        } else {
          this.setState({ currentCategory: item, popover: undefined });
        }
        break;
      case Popover.Type:
        this.setState({ currentType: item, popover: undefined });
        break;
      case Popover.Key:
        this.setState({ currentKey: item, popover: undefined });
        break;
      case Popover.Position:
        this.setState({ currentPosition: item, popover: undefined });
        break;
      default:
        break;
    }
  };

  handlePrevPosition = () => {
    let index = this.positions.indexOf(this.state.currentPosition);
    var position = this.positions[0];

    if (index > -1) {
      position =
        index > 0
          ? (position = this.positions[index - 1])
          : (position = this.positions[this.positions.length - 1]);
    }

    this.setState({ currentPosition: position });
  };

  handleNextPosition = () => {
    let index = this.positions.indexOf(this.state.currentPosition);
    var position = this.positions[0];

    if (index > -1) {
      position =
        index < this.positions.length - 1
          ? (position = this.positions[index + 1])
          : (position = this.positions[0]);
    }

    this.setState({ currentPosition: position });
  };

  updatePatternTrack = async () => {
    // short circuit if we're just showing all notes
    if (this.state.currentCategory === "All Notes") {
      const { name, root, notes } = allNotesPattern();
      loadPatternNotes("chordsAndScales", name, root, notes);
      setPatternRootOn();
      return;
    }

    var chart, photo;
    let pattern = await getPattern(
      this.state.currentCategory,
      this.state.currentType,
      this.state.currentKey,
      this.state.currentPosition
    );

    if (pattern !== undefined) {
      trackChordsAndScalesPattern(pattern.patternId);

      // set photos
      if (pattern.chart !== undefined) {
        chart = `asset:/patterns/${pattern.chart}`;
      }

      if (pattern.photo !== undefined) {
        photo = `asset:/patterns/${pattern.photo}`;
      }

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

      loadPatternNotes("chordsAndScales", pattern.name, root, pattern.notes);
      setPatternRootOn();
    } else {
      clearMidi();
    }

    this.setState({ chart, photo });
  };

  toggleBlinkNotes = isBlinking => {
    if (isBlinking) {
      this.startBlinking();
    } else {
      this.stopBlinking();
    }

    this.setState({ isBlinking });
  };

  updateBlinkSpeed = percent => {
    this.stopBlinking();
    this.blinkSpeed = 30 + (1 - percent) * 40;

    if (this.state.isBlinking) {
      this.startBlinking();
    }
  };

  startBlinking = () => {
    this.blinkInterval = setInterval(this.updateBlinking, this.blinkSpeed);
    this.rootNotesAreOn = false;
    setPatternRootOff();
  };

  stopBlinking = () => {
    clearInterval(this.blinkInterval);
    setPatternRootOn();
  };

  updateBlinking = () => {
    this.blinkDuration += this.rootNotesAreOn ? 10 : 14;

    if (this.blinkDuration >= 100) {
      this.blinkDuration = 0;
      if (this.rootNotesAreOn) {
        setPatternRootOff();
      } else {
        setPatternRootOn();
      }

      this.rootNotesAreOn = !this.rootNotesAreOn;
    }
  };

  toggleFretlightAdmin = () => {
    this.props.onToggleFretlightAdmin(true);
    trackFretlightStatusTap();
  };
}

ChordsAndScales.propTypes = {
  currentNotation: PropTypes.string.isRequired,
  connectedDevices: PropTypes.number,
  clearMidiData: PropTypes.func.isRequired,
  onToggleFretlightAdmin: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    currentNotation: state.get("currentNotation"),
    connectedDevices: state.get("guitars").count()
  };
};

export default connect(mapStateToProps, actions)(ChordsAndScales);
