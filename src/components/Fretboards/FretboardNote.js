import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet } from "react-native";
import NoteSvg from "./NoteSvg";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 1
  }
});

const getNoteSize = fretHeight => {
  return fretHeight / 6 - 2;
};

class FretboardNote extends React.Component {
  isVisible_ = false;

  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      noteSize: getNoteSize(props.fretHeight)
    };
  }

  render() {
    const { notation } = this.props;

    return (
      <View
        style={styles.container}
        opacity={0}
        ref={ref => (this.fretView = ref)}
      >
        <NoteSvg
          notation={notation}
          size={this.state.noteSize}
          backgroundColor="#17A3E3"
          outlineColor="#17A3E3"
          textColor="#000000"
        />
      </View>
    );
  }

  show = () => {
    if (this.isVisible_ !== true) {
      this.fretView.setNativeProps({ opacity: 1 });
      this.isVisible_ = true;
    }
  };

  hide = () => {
    if (this.isVisible_ !== false) {
      this.fretView.setNativeProps({ opacity: 0 });
      this.isVisible_ = false;
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.fretHeight !== this.props.fretHeight) {
      this.setState({
        noteSize: getNoteSize(nextProps.fretHeight)
      });
    }
  }
}

FretboardNote.propTypes = {
  notation: PropTypes.string.isRequired,
  boardWidth: PropTypes.number.isRequired,
  fretHeight: PropTypes.number.isRequired
};

export default FretboardNote;
