import React, { Component } from "react";
import { View, Image } from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import AdPresentation from "./AdPresentation";

class AdContainer extends Component {
  render() {
    const { ad } = this.props;
    return (
      <Image
        style={{
          height: this.props.visibleTracks.count() > 3 ? 0 : 80,
          width: "100%",
          flexDirection: "row"
        }}
        source={require("../images/topiPhone.png")}
      >
        <View
          style={{
            position: "absolute",
            height: "100%",
            padding: 10
          }}
        >
          <Image
            style={{
              height: "100%",
              aspectRatio: 2.63
            }}
            resizeMode={"contain"}
            source={require("../images/logo-guitar-tunes.png")}
          />
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

const mapStateToProps = state => {
  return {
    ad: state.get("ad"),
    visibleTracks: state.get("visibleTracks")
  };
};

export default connect(mapStateToProps, actions)(AdContainer);
