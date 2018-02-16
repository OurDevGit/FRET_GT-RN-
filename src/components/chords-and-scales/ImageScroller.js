import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, ViewPagerAndroid, Image } from "react-native";
import PageControl from "../Fretboards/PageControl";

class ImageScroller extends React.Component {
  state = {
    currentPage: 0
  };

  render() {
    const { chart, photo } = this.props;
    return (
      <View style={styles.column}>
        <ViewPagerAndroid
          style={styles.scroller}
          initialPage={0}
          onPageSelected={this.handleScroll}
        >
          <View style={styles.page} key="1">
            <Image
              style={styles.image}
              source={{ uri: chart }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.page} key="2">
            <Image
              style={styles.image}
              source={{ uri: photo }}
              resizeMode="contain"
            />
          </View>
        </ViewPagerAndroid>
        <PageControl
          style={styles.pageControl}
          indicatorStyle={styles.pageControlIndicator}
          count={2}
          offColor="gray"
          onColor="white"
          currentPage={this.state.currentPage}
          onPage={() => {}}
        />
      </View>
    );
  }

  handleScroll = e => {
    this.setState({ currentPage: e.nativeEvent.position });
  };
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    alignItems: "center"
  },
  scroller: {
    flex: 1,
    aspectRatio: 0.72
  },
  image: {
    aspectRatio: 0.72,
    height: "100%"
  },
  pageControl: {
    width: "100%",
    height: 20
  },
  pageControlIndicator: {
    marginLeft: 5,
    marginRight: 5,
    width: 8,
    height: 8,
    borderRadius: 5
  }
});

ImageScroller.propTypes = {
  chart: PropTypes.string,
  photo: PropTypes.string
};

export default ImageScroller;
