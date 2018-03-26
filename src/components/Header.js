// @flow

import React, { PureComponent } from "react";
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Linking
} from "react-native";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import BannerAdPresentation from "./BannerAdPresentation";
import { getIsPhone } from "../utils";
import { trackAdTap } from "../metrics";
import logoImage from "../images/logo-guitar-tunes.png";
import logoGlow from "../images/logo-guitar-tunes-glow.png";
import topImage from "../images/topiPhone.png";
import { getMediaById } from "../redux/selectors";
import {
  BtnLibrary,
  BtnHome,
  BtnSettings,
  BtnChordsAndScales
} from "./StyleKit";

type Props = {
  isHome: boolean,
  isChordsAndScales: boolean,
  isFirstRun: boolean,
  currentMedia: {},
  ad: {
    get: string => void
  },
  guitars: {
    count: () => number // TODO: type as the actual Immutable type
  },
  visibleTracks: {
    count: () => number // TODO: type as the actual Immutable type
  },
  fetchAd: () => void,
  onHomePress: () => void,
  onToggleLibrary: () => void,
  onChordsAndScalesPress: () => void,
  onToggleSettings: () => void
};

class AdContainer extends PureComponent<Props> {
  render() {
    const { ad, guitars } = this.props;
    const isPhone = getIsPhone();
    const adURL = isPhone ? ad.get("phone") : ad.get("tablet");
    const aspectRatio = isPhone ? 7.26 : 6.64;

    const logo = guitars.count() > 0 ? logoGlow : logoImage;
    return (
      <ImageBackground
        style={
          this.props.visibleTracks.count() > 3
            ? styles.bgImageHidden
            : styles.bgImage
        }
        source={topImage}
      >
        <View style={styles.logoContainer}>
          <Image style={styles.logo} resizeMode={"contain"} source={logo} />
        </View>
        <View style={styles.ad}>
          <BannerAdPresentation
            onTap={this.handleTap}
            imageUrl={adURL}
            aspectRatio={aspectRatio}
            isFirstRun={this.props.isFirstRun}
            isHome={this.props.isHome}
            isChordsAndScales={this.props.isChordsAndScales}
            currentMedia={this.props.currentMedia}
          />
        </View>

        {/* 
        Buttons 
        */}

        <View style={styles.buttons}>
          <BtnHome
            isHome={this.props.isHome}
            onPress={this.props.onHomePress}
          />
          <BtnLibrary color={"#FFFFFF"} onPress={this.props.onToggleLibrary} />
          <BtnChordsAndScales
            onPress={this.props.onChordsAndScalesPress}
            isChordsAndScales={this.props.isChordsAndScales}
          />
          <BtnSettings
            onPress={this.props.onToggleSettings}
            style={{ marginLeft: -4 }}
          />
        </View>
      </ImageBackground>
    );
  }

  componentDidMount() {
    this.props.fetchAd();
  }

  handleTap = () => {
    const url = this.props.ad.get("link");
    const tracking = this.props.ad.get("tracking");
    if (typeof url === "string") {
      Linking.openURL(url).catch(err =>
        console.error("An error occurred", err)
      );
      trackAdTap(url, tracking);
    }
  };
}

const styles = StyleSheet.create({
  bgImage: {
    height: "17%",
    maxHeight: 80,
    width: "100%",
    flexDirection: "row",
    alignItems: "center"
  },
  bgImageHidden: {
    display: "none"
  },
  logoContainer: {
    height: "100%",
    padding: 10
  },
  logo: {
    height: "100%",
    aspectRatio: 2.63
  },
  ad: {
    flex: 1,
    height: "100%",
    justifyContent: "center"
  },
  buttons: {
    flexDirection: "row",
    paddingTop: 10
  },
  chordsAndScalesButton: { width: 44, height: 44, marginTop: -6 }
});

const mapStateToProps = state => {
  currentMedia = getMediaById(state, state.get("currentMedia"));
  if (currentMedia) {
    currentMedia = currentMedia.toJS();
  }

  return {
    ad: state.get("ad"),
    visibleTracks: state.get("visibleTracks"),
    guitars: state.get("guitars"),
    currentMedia
  };
};

export default connect(mapStateToProps, actions)(AdContainer);
