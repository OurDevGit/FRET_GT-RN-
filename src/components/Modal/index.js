import React, { Component } from "react";
import { Modal, View } from "react-native";
import PropTypes from "prop-types";
import SaveLoop from "./SaveLoop";

class ModalController extends Component {
  state = {
    textInput: ""
  };

  render() {
    return (
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={this.props.isVisible}
        onRequestClose={() => {
          this.props.onDismiss();
        }}
      >
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          }}
        >
          {this.props.loopToSave &&
            <SaveLoop
              onTextChange={this.handleTextChange}
              onCancel={this.handleCancel}
              onSave={this.handleLoopSave}
            />}
        </View>
      </Modal>
    );
  }

  handleCancel = () => {
    this.props.onDismiss();
    this.setState({ textInput: "" });
  };

  handleTextChange = text => {
    console.log(text);
    this.setState({ textInput: text });
  };

  handleLoopSave = () => {
    this.props.onSave(this.state.textInput);
    this.props.onDismiss();
    this.setState({ textInput: "" });
  };
}

ModalController.propTypes = {
  isVisible: PropTypes.bool,
  loopToSave: PropTypes.object,
  onSave: PropTypes.func,
  onDismiss: PropTypes.func
};

export default ModalController;
