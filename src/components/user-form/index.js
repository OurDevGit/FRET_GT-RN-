import React, { Component } from "react";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import { Popover, getBirthdates, getExperienceLevels } from "./utils";
import { Modal, Alert } from "react-native";
import { getIsPhone } from "../../utils";
import Presentation from "./presentation";
import {
  setUserBirthdate,
  setUserLevel,
  getUserLevel
} from "../../models/User";
import { recordBirthYear, recordExperienceLevel } from "../../metrics";

const birthdates = getBirthdates();
const levels = getExperienceLevels();

class UserForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      birthdate: undefined,
      experienceLevel: undefined,
      popover: undefined,
      popoverFrame: { top: 0, left: 0, width: 0, height: 0 },
      popoverSelectedItem: undefined,
      popoverItems: []
    };
  }

  render() {
    return (
      <Modal
        ref={ref => (this.UserFormModal = ref)}
        animationType={"slide"}
        onRequestClose={this.props.onClose}
      >
        <Presentation
          ref={ref => (this.UserFormPresentation = ref)}
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
          onScrollView={this.handleScrollView}
        />
      </Modal>
    );
  }

  componentWillMount = async () => {
    let birthdate = this.props.savedBirthdate;
    let experienceLevel = this.props.savedExperienceLevel;
    this.setState({ birthdate, experienceLevel });
  };

  componentDidUpdate = prevProps => {
    if (
      prevProps.savedBirthdate !== this.props.savedBirthdate ||
      prevProps.savedExperienceLevel !== this.props.savedExperienceLevel
    ) {
      let birthdate = this.props.savedBirthdate;
      let experienceLevel = this.props.savedExperienceLevel;
      this.setState({ birthdate, experienceLevel });
    }
  };

  handlePresentPopover = (popover, frame) => {
    const isPhone = getIsPhone();
    var popoverItems = [];
    var popoverSelectedItem = undefined;
    let deviceHeight = Dimensions.get("window").height;
    var width = isPhone ? 140 : 180;
    var rowHeight = isPhone ? 41 : 45;

    switch (popover) {
      case Popover.Birthdate:
        popoverItems = birthdates;
        popoverSelectedItem = this.state.birthdate;
        break;
      case Popover.ExperienceLevel:
        popoverItems = levels;
        popoverSelectedItem = this.state.experienceLevel;
        break;
      default:
        break;
    }

    var minLeft = isPhone ? frame.x + 60 : frame.x + 110;
    var left = Math.max(frame.x + frame.width + 10, minLeft);

    if (popover === Popover.ExperienceLevel) {
      left = frame.x - width - 10;
    }

    if (popoverItems !== undefined && popoverItems.length > 0) {
      let height = Math.min(
        popoverItems.length * rowHeight,
        deviceHeight * 0.8
      );
      let top =
        popover === Popover.Birthdate
          ? deviceHeight * 0.1
          : Math.min(frame.y, deviceHeight - height - 20);

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
        if (this.state.experienceLevel !== undefined) {
          this.ScrollView.scrollToEnd();
        }

        this.setState({ birthdate: item, popover: undefined });
        break;
      case Popover.ExperienceLevel:
        if (this.state.birthdate !== undefined) {
          this.ScrollView.scrollToEnd();
        }
        this.setState({ experienceLevel: item, popover: undefined });
        break;
      default:
        break;
    }
  };

  handleScrollView = ref => {
    this.ScrollView = ref;
  };

  handleSubmission = async () => {
    const { birthdate, experienceLevel } = this.state;
    if (birthdate !== undefined && experienceLevel !== undefined) {
      const savedLevel = await getUserLevel();
      const shouldLoadFirstRun = savedLevel === undefined;
      setUserBirthdate(birthdate);
      setUserLevel(experienceLevel);

      recordBirthYear(parseInt(birthdate));
      recordExperienceLevel(experienceLevel);
      this.props.onClose(birthdate, experienceLevel, shouldLoadFirstRun);
    } else {
      Alert.alert(
        "Incomplete Form",
        "Please complete the form to get started with Guitar Tunes!"
      );
    }
  };
}

UserForm.propTypes = {
  savedBirthdate: PropTypes.string,
  savedExperienceLevel: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default UserForm;
