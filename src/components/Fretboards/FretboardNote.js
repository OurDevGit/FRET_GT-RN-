import React from "react";
import PropTypes from "prop-types";
import { View, Text } from "react-native";

class FretboardNote extends React.Component {
  state = {
    isVisible: false
  };

  render() {
    const { styles, notation, boardWidth, fretHeight } = this.props;
    const heightStyle = { height: fretHeight / 6 - 2 };
    const sizeStyle = { fontSize: fretHeight / 6 / 2 };

    return (
      <View style={styles.noteContainer}>
        {this.state.isVisible && (
          <View style={[styles.noteView, heightStyle]}>
            <Text style={[styles.noteText, sizeStyle]} numberOfLines={1}>
              {notation}
            </Text>
          </View>
        )}
      </View>
    );
  }

  show = () => {
    if (!this.state.isVisible) {
      this.setState({ isVisible: true });
    }
  };

  hide = () => {
    if (this.state.isVisible) {
      this.setState({ isVisible: false });
    }
  };
}

FretboardNote.propTypes = {
  styles: PropTypes.object.isRequired,
  notation: PropTypes.string.isRequired,
  boardWidth: PropTypes.number.isRequired,
  fretHeight: PropTypes.number.isRequired
};

export default FretboardNote;
