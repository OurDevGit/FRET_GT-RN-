import React, { PureComponent } from "react";
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Linking
} from "react-native";
import Dimensions from "Dimensions";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import AdPresentation from "./AdPresentation";
import { getIsPhone } from "../utils";

class AdContainer extends PureComponent {
  render() {
    const { ad, guitars } = this.props;
    const isPhone = getIsPhone();
    const adURL = isPhone ? ad.get("phone") : ad.get("tablet");
    const aspectRatio = isPhone ? 7.26 : 6.64;

    const logo =
      guitars.count() > 0
        ? require("../images/logo-guitar-tunes-glow.png")
        : require("../images/logo-guitar-tunes.png");
    return (
      <ImageBackground
        style={
          this.props.visibleTracks.count() > 3
            ? styles.bgImageHidden
            : styles.bgImage
        }
        source={require("../images/topiPhone.png")}
      >
        <View style={styles.logoContainer}>
          <Image style={styles.logo} resizeMode={"contain"} source={logo} />
        </View>
        <AdPresentation
          onTap={this.handleTap}
          imageUrl={adURL}
          aspectRatio={aspectRatio}
        />
      </ImageBackground>
    );
  }

  componentDidMount() {
    this.props.fetchAd();
  }

  handleTap = () => {
    const url = this.props.ad.get("link");
    Linking.openURL(url).catch(err => console.error("An error occurred", err));
  };
}

AdContainer.propTypes = {
  ad: PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  bgImage: {
    height: "17%",
    maxHeight: 80,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  bgImageHidden: {
    display: "none"
  },
  logoContainer: {
    position: "absolute",
    height: "100%",
    padding: 10
  },
  logo: {
    height: "100%",
    aspectRatio: 2.63
  }
});

const mapStateToProps = state => {
  return {
    ad: state.get("ad"),
    visibleTracks: state.get("visibleTracks"),
    guitars: state.get("guitars")
  };
};

export default connect(mapStateToProps, actions)(AdContainer);
