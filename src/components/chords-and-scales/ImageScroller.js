import React from "react";
import PropTypes from "prop-types";
import { View, StyleSheet, ViewPagerAndroid, Image } from "react-native";
import { PrimaryBlue } from "../../design";
import PageControl from "../Fretboards/PageControl";
import { getIsPhone } from "../../utils";

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
          ref={ref => {
            this.pager = ref;
          }}
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
          onColor={PrimaryBlue}
          size={22}
          ref={ref => (this.pageControl = ref)}
          currentPage={this.state.currentPage}
          onPage={this.handlePage}
        />
      </View>
    );
  }

  handleScroll = e => {
    const currentPage = e.nativeEvent.position;
    this.pageControl.setPage(currentPage);
    this.setState({ currentPage });
  };

  handlePage = currentPage => {
    this.pager.setPage(currentPage);
    this.pageControl.setPage(currentPage);
    this.setState({ currentPage });
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
    height: 22,
    marginTop: getIsPhone() ? 0 : 10
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
