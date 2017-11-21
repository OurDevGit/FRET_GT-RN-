import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, TextInput, Text } from "react-native";

import * as actions from "../../redux/actions";
import { PrimaryGold } from "../../design";
import { FlatButton } from "../Material";
import TabbedMedia from "./MediaTabs/TabbedMedia";
import MediaDetails from "./MediaDetails";
import FacebookIcon from "./social_icons/Facebook";
import TwitterIcon from "./social_icons/Twitter";

class Media extends React.PureComponent {
  state = {
    searchText: "",
    mediaCount: 0,
    detailMediaId: ""
  };

  render() {
    // console.debug(`Media render()`);
    return (
      <View style={this.props.style}>
        <View
          style={{
            width: "100%",
            height: 44,
            backgroundColor: "#fafafa",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <TextInput
            disableFullscreenUI={true}
            returnKeyType="search"
            placeholder="Search"
            placeholderTextColor="lightgray"
            inlineImageLeft="search_icon"
            style={{
              flexGrow: 1,
              marginRight: 8
            }}
            onChangeText={this.handleChangeText}
            value={this.state.searchText}
          />
          <Text>{this.state.mediaCount}</Text>
          <FacebookIcon />
          <TwitterIcon />
          <FlatButton
            title="Close"
            style={{ color: PrimaryGold }}
            onPress={this.props.onClose}
          />
        </View>
        <TabbedMedia
          category={this.props.category}
          subCategory={this.props.subCategory}
          group={this.props.group}
          searchText={this.state.searchText}
          onChoose={this.props.onChoose}
          onIsStoreChange={this.props.onIsStoreChange}
          onFavePress={this.handleFavePress}
          // TODO: take this out and move it down the component chain
          isNavigableSubCategory={this.props.isNavigableSubCategory}
          onShowDetails={this.handleShowDetails}
          onMediaCount={this.handleMediaCount}
        />
        <MediaDetails
          isVisible={this.state.detailMediaId !== ""}
          mediaId={this.state.detailMediaId}
          onClose={() => this.setState({ detailMediaId: "" })}
          onArchiveFiles={() => {
            this.handleArchiveFiles(this.state.detailMediaId);
            this.setState({ detailMediaId: "" });
          }}
        />
      </View>
    );
  }

  componentWillMount() {
    this.setState({
      detailMediaId: this.props.detailMediaId
    });
  }

  handleChangeText = text => {
    this.setState({ searchText: text });
  };

  handleShowDetails = detailMediaId => {
    this.setState({
      detailMediaId: detailMediaId
    });
  };

  handleMediaCount = mediaCount => {
    this.setState({ mediaCount });
  };

  handleArchiveFiles = mediaId => {
    this.props.deleteMedia(mediaId);
  };

  handleFavePress = mediaId => {
    this.props.toggleFavorite(mediaId);
  };
}

Media.propTypes = {
  isNavigableSubCategory: PropTypes.bool.isRequired,
  detailMediaId: PropTypes.string,
  media: PropTypes.object,
  category: PropTypes.object,
  subCategory: PropTypes.object,
  group: PropTypes.object,
  style: PropTypes.number.isRequired,
  toggleFavorite: PropTypes.func.isRequired, // action creator
  deleteMedia: PropTypes.func.isRequired, // action creator
  onChoose: PropTypes.func.isRequired,
  onIsStoreChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default connect(null, actions)(Media);
