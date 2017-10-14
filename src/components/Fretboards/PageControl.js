import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  }
});

const pages = (count, currentPage, style, offColor, onColor, onPage) => {
  var arr = [];
  for (var i = 0; i < count; i++) {
    const backgroundColor = i === currentPage ? onColor : offColor;
    arr.push(
      <TouchableWithoutFeedback key={i} onPress={onPage.bind(this, i)}>
        <View style={{ ...style, backgroundColor }} />
      </TouchableWithoutFeedback>
    );
  }

  return arr;
};

const PageControl = ({
  style,
  indicatorStyle,
  count,
  currentPage,
  onColor,
  offColor,
  onPage
}) => {
  return (
    <View style={[styles.container, style]}>
      {count > 0 &&
        pages(count, currentPage, indicatorStyle, offColor, onColor, onPage)}
    </View>
  );
};

PageControl.propTypes = {
  style: PropTypes.object.isRequired,
  indicatorStyle: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onColor: PropTypes.string.isRequired,
  offColor: PropTypes.string.isRequired,
  onPage: PropTypes.func.isRequired
};

export default PageControl;
