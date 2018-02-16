import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Dimensions from "Dimensions";
import * as actions from "../../redux/actions";
import { Popover, getBirthdates, getExperienceLevels } from "./utils";
import { Modal } from "react-native";
import { getIsPhone } from "../../utils";
import Presentation from "./presentation";
import { recordBirthYear, recordExperienceLevel } from "../../metrics";

class UserForm extends Component {
  state = {
    birthdate: undefined,
    experienceLevel: undefined,
    popover: undefined,
    popoverFrame: undefined,
    popoverSelectedItem: undefined,
    popoverItems: undefined
  };

  render() {
    const { isVisible, onDismissPopover } = this.props;
    return (
      <Modal
        transparent={true}
        visible={isVisible}
        onRequestClose={onDismissPopover}
      >
        <Presentation
          isPhone={getIsPhone()}
          birthdate={this.state.birthdate}
          experienceLevel={this.state.experienceLevel}
          popover={this.state.popover}
          popoverFrame={this.state.popoverFrame}
          popoverSelectedItem={this.state.popoverSelectedItem}
          popoverItems={this.state.popoverItems}
          onPresentPopover={this.handlePresentPopover}
          onDismissPopover={this.handleDismissPopover}
          onSelection={this.handleSelection}
          onSubmit={this.handleSubmission}
        />
      </Modal>
    );
  }

  handlePresentPopover = (popover, frame) => {
    const isPhone = getIsPhone();
    var popoverItems = [];
    var popoverSelectedItem = undefined;
    let deviceHeight = Dimensions.get("window").height;
    var width = isPhone ? 120 : 180;
    var rowHeight = isPhone ? 41 : 45;

    switch (popover) {
      case Popover.Birthdate:
        popoverItems = getBirthdates();
        popoverSelectedItem = this.state.birthdate;
        break;
      case Popover.ExperienceLevel:
        popoverItems = getExperienceLevels();
        popoverSelectedItem = this.state.experienceLevel;
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

  handleSelection = (item, popover) => {
    switch (popover) {
      case Popover.Birthdate:
        this.setState({ birthdate: item, popover: undefined });
        break;
      case Popover.ExperienceLevel:
        this.setState({ experienceLevel: item, popover: undefined });
        break;
      default:
        break;
    }
  };

  handleSubmission = () => {
    const { birthdate, experienceLevel } = this.state;
    recordBirthYear(birthdate);
    recordExperienceLevel(experienceLevel);

    // save to state/persistence
  };
}

UserForm.propTypes = {
  savedBirthdate: PropTypes.number.isRequired,
  savedExperienceLevel: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onDismissPopover: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    savedBirthdate: state.get("userBirthdate"),
    savedExperienceLevel: state.get("userExperienceLevel")
  };
};

export default connect(mapStateToProps, actions)(UserForm);
