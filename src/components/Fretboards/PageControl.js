import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

class PageControl extends React.PureComponent {
  state = {
    currentPage: 0,
    opacity: 1
  };

  render() {
    const { style, count } = this.props;
    return (
      <View style={[styles.container, style, { opacity: this.state.opacity }]}>
        {count > 0 && this.getPages()}
      </View>
    );
  }

  getPages = () => {
    const {
      indicatorStyle,
      count,
      onColor,
      offColor,
      onPage,
      size
    } = this.props;
    const { currentPage } = this.state;
    var arr = [];
    for (var i = 0; i < count; i++) {
      const backgroundColor = i === currentPage ? onColor : offColor;
      const index = i;
      arr.push(
        <TouchableWithoutFeedback key={i} onPress={() => onPage(index)}>
          <View style={[styles.button, { width: size }]}>
            <View style={[indicatorStyle, { backgroundColor }]} />
          </View>
        </TouchableWithoutFeedback>
      );
    }

    return arr;
  };

  setPage = currentPage => {
    this.setState({ currentPage });
  };

  setJamBar = bool => {
    this.setState({ currentPage: 0, opacity: bool ? 0 : 1 });
  };
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  button: {
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent"
  }
});

PageControl.propTypes = {
  style: PropTypes.oneOfType([PropTypes.number, PropTypes.object]).isRequired,
  indicatorStyle: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
    .isRequired,
  count: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  onColor: PropTypes.string.isRequired,
  offColor: PropTypes.string.isRequired,
  onPage: PropTypes.func.isRequired
};

export default PageControl;
