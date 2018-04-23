// @flow

import React, { PureComponent, SyntheticEvent } from "react";
import { View, StyleSheet } from "react-native";
import firebase from "react-native-firebase";
const AdRequest = firebase.admob.AdRequest;

type Props = {
  isFirstRun: boolean,
  isHome: boolean,
  isChordsAndScales: boolean,
  isBluetooth: boolean,
  currentMedia: {
    isSong: boolean,
    isVideo: boolean,
    isJamAlong: boolean,
    isLesson: boolean
  }
};

type State = {
  bannerSize?: string
};

const getUnitId = props => {
  // console.debug("getting unit id for props:");
  // console.debug(props);

  var unitId = "ca-app-pub-7411519305767770/9269815470";

  if (props.isBluetooth) {
    unitId = "ca-app-pub-7411519305767770/6017854220";
  } else if (props.isFirstRun) {
    unitId = "ca-app-pub-7411519305767770/2440010797";
  } else if (props.isChordsAndScales) {
    unitId = "ca-app-pub-7411519305767770/5522142153";
  } else if (props.isHome) {
    unitId = "ca-app-pub-7411519305767770/9269815470";
  } else if (props.currentMedia) {
    if (props.currentMedia.isSong) {
      unitId = "ca-app-pub-7411519305767770/5826282536";
    } else if (props.currentMedia.isVideo) {
      unitId = "ca-app-pub-7411519305767770/4321629179";
    } else if (props.currentMedia.isJamAlong) {
      unitId = "ca-app-pub-7411519305767770/8643129516";
    } else if (props.currentMedia.isLesson) {
      unitId = "ca-app-pub-7411519305767770/8259986135";
    }
  }

  // console.debug(`unit id: ${unitId}`);

  return unitId;
};

class BannerAdPresentation extends PureComponent<Props, State> {
  state = {
    bannerSize: undefined
  };

  render() {
    const request = new AdRequest();
    console.debug(this.state.bannerSize);

    return (
      <View style={styles.container} onLayout={this.handleLayout}>
        {this.state.bannerSize && (
          <firebase.admob.Banner
            unitId={getUnitId(this.props)}
            request={request.build()}
            onAdLoaded={() => console.debug("ad loaded")}
            onAdOpened={() => console.debug("ad opened")}
            // onAdFailedToLoad={err => Alert.alert("Ad Error", err.message)}
            size={this.state.bannerSize}
          />
        )}
      </View>
    );
  }

  handleLayout = (e: SyntheticEvent) => {
    var bannerSize = "LEADERBOARD";

    const { width, height } = e.nativeEvent.layout;

    if (width < 728 || height < 90) {
      bannerSize = "FULL_BANNER";
    }

    if (width < 468 || height < 60) {
      bannerSize = "BANNER";
    }

    this.setState({
      bannerSize
    });
  };
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%"
  }
});

export default BannerAdPresentation;
