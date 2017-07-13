import React, { Component } from "react";
import { Image, StyleSheet, Button, Text, View } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import AdPresentation from "./AdPresentation";

class Ad extends Component {
  render() {
    const { ad } = this.props;
    console.log(ad.get("phone"));
    return (
      <Image style={styles.banner} source={require("../images/topiPhone.png")}>
        <AdPresentation onTap={this.handleTap} imageUrl={ad.get("phone")} />
        <Button title="Lib" onPress={this.props.onToggleLibrary} />
      </Image>
    );
  }

  componentDidMount() {
    this.props.fetchAd();
  }

  handleTap = () => {};
}

Ad.propTypes = {
  ad: PropTypes.object.isRequired,
  onToggleLibrary: PropTypes.func.isRequired
};

const styles = StyleSheet.create({
  banner: {
    height: 70,
    width: "100%",
    flexDirection: "row"
  },
  libButton: {
    right: 0,
    top: 10,
    margin: 10,
    padding: 10
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    ad: state.get("ad")
  };
};

export default connect(mapStateToProps, actions)(Ad);
