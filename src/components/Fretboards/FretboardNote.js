import React from "react";
import PropTypes from "prop-types";
import { View, Text, StyleSheet } from "react-native";

const styles = StyleSheet.create({
  noteContainer: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 1
  },
  noteView: {
    flex: -1,
    aspectRatio: 1,
    backgroundColor: "#17A3E3",
    borderRadius: 1000,
    alignItems: "center"
  },
  noteText: {
    height: "100%",
    textAlignVertical: "center"
  }
});

const makeHeightStyle = fretHeight => {
  return [styles.noteView, { height: fretHeight / 6 - 2 }];
};

const makeSizeStyle = fretHeight => {
  return [styles.noteText, { fontSize: fretHeight / 6 / 2 }];
};

class FretboardNote extends React.Component {
  isVisible_ = false;

  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      heightStyle: makeHeightStyle(props.fretHeight),
      sizeStyle: makeSizeStyle(props.fretHeight)
    };
  }

  render() {
    const { notation } = this.props;

    return (
      <View
        style={styles.noteContainer}
        opacity={0}
        ref={ref => (this.fretView = ref)}
      >
        <View style={this.state.heightStyle}>
          <Text style={this.state.sizeStyle} numberOfLines={1}>
            {notation}
          </Text>
        </View>
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
        heightStyle: makeHeightStyle(nextProps.fretHeight),
        sizeStyle: makeSizeStyle(nextProps.fretHeight)
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
