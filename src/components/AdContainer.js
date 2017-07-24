import React, { Component } from "react";
import { Image, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import AdPresentation from "./AdPresentation";

class AdContainer extends Component {
  render() {
    const { ad } = this.props;
    return (
      <Image style={styles.banner} source={require("../images/topiPhone.png")}>
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
  banner: {
    height: 70,
    width: "100%",
    flexDirection: "row"
  }
});

const mapStateToProps = (state, ownProps) => {
  return {
    ad: state.get("ad")
  };
};

export default connect(mapStateToProps, actions)(AdContainer);
