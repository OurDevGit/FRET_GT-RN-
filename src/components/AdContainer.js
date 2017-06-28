import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import * as actions from "../redux/actions";
import AdPresentation from "./AdPresentation";

class Ad extends Component {
  render() {
    return (
      <AdPresentation
        onTap={this.handleTap}
        imageUrl={this.props.ad.get("phone")}
      />
    );
  }

  componentDidMount() {
    this.props.fetchAd();
  }

  handleTap = () => {};
}

Ad.propTypes = {
  ad: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
  return {
    ad: state.get("ad")
  };
};

export default connect(mapStateToProps, actions)(Ad);
