import React from "react";
import {
  Modal,
  View,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet
} from "react-native";
import PropTypes from "prop-types";

class EmailSignupModal extends React.Component {
  state = {
    inputText: ""
  };

  render() {
    const { onCancel } = this.props;

    return (
      <Modal animationType="fade" transparent={true} onRequestClose={onCancel}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={-100}
        >
          <View style={styles.container} onPress={onCancel}>
            <View style={styles.content}>
              <Text style={styles.heading}>Register for Updates</Text>

              <Text style={styles.label}>
                Enter your email address to stay up to date on Guitar Tunes
              </Text>

              <TextInput
                style={styles.input}
                autoFocus={true}
                placeholder={"Email"}
                onChangeText={this.handleTextInput}
                onSubmitEditing={this.handleComplete}
              />

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={{ flex: -1 }} onPress={onCancel}>
                  <Text style={styles.buttonCancel}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ flex: -1, marginLeft: 50 }}
                  onPress={this.handleComplete}
                >
                  <Text style={styles.buttonOK}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

  handleTextInput = text => {
    this.setState({ inputText: text });
  };

  handleComplete = () => {
    const email = this.state.inputText;

    if (email === "") {
      Alert.alert("Invalid email", "Please enter a valid email address");
    } else {
      if (this.validate(email)) {
        this.props.onComplete(email);
      } else {
        Alert.alert("Invalid email", "Please enter a valid email address");
      }
    }
  };

  validate = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(1,1,1,0.5)",
    width: "100%",
    height: "100%"
  },
  content: {
    width: 440,
    height: 260,
    backgroundColor: "#eeeeee",
    padding: 15
  },
  heading: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    width: "100%",
    borderBottomColor: "lightgray",
    borderBottomWidth: 1,
    textAlignVertical: "center"
  },
  label: {
    flex: 1,
    fontSize: 18,
    textAlignVertical: "center"
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontWeight: "400",
    textAlignVertical: "bottom",
    backgroundColor: "#efefef"
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  buttonCancel: {
    fontSize: 19,
    fontWeight: "600",
    textAlign: "right"
  },
  buttonOK: {
    fontSize: 19,
    fontWeight: "400",
    textAlign: "right"
  }
});

EmailSignupModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onComplete: PropTypes.func
};

export default EmailSignupModal;
