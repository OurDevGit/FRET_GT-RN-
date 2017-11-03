import React, { PureComponent } from "react";
import { View, Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import AdPresentation from "./AdPresentation";

class AdContainer extends PureComponent {
  render() {
    const { ad, guitars } = this.props;
    const logo =
      guitars.count() > 0
        ? require("../images/logo-guitar-tunes-glow.png")
        : require("../images/logo-guitar-tunes.png");
    return (
      <Image
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
        <AdPresentation onTap={this.handleTap} imageUrl={ad.get("phone")} />
      </Image>
    );
  }

  componentDidMount() {
    this.props.fetchAd();
  }

  handleTap = () => {};
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
