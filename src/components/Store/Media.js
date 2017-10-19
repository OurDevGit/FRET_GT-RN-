import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, TextInput, Text } from "react-native";
import Fuse from "fuse.js";

import _ from "lodash";

import * as actions from "../../redux/actions";
import { selectMedia } from "../../redux/selectors";
import { PrimaryGold } from "../../design";
import { FlatButton } from "../Material";
import TabbedMedia from "./TabbedMedia";
import FacebookIcon from "./social_icons/Facebook";
import TwitterIcon from "./social_icons/Twitter";

const fuseOptions = {
  shouldSort: true,
  threshold: 0.3,
  maxPatternLength: 20,
  minMatchCharLength: 1,
  keys: ["title", "artist"]
};

class Media extends React.PureComponent {
  state = {
    searchText: "",
    searchResults: null,
    mediaCount: 0
  };

  render() {
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
          media={this.state.searchResults || this.props.media || []}
          onChoose={this.props.onChoose}
          onIsStoreChange={this.props.onIsStoreChange}
          onArchiveFiles={this.handleArchiveFiles}
          onFavePress={this.handleFavePress}
          isNavigableSubCategory={this.props.isNavigableSubCategory}
        />
      </View>
    );
  }

  componentWillReceiveProps(nextProps) {
    // console.log("Media next props");
    // console.log(nextProps.media.length);
    // console.log(nextProps.media[0].data.length);

    const allMedia = _.flatMap(nextProps.media, m => _.toArray(m.data));
    this.setState({
      mediaCount: allMedia.length
    });
    this.fuse = new Fuse(allMedia, fuseOptions); // "list" is the item array
  }

  handleChangeText = text => {
    if (this.fuse && text.length > 1) {
      const result = this.fuse.search(text);

      // console.debug(text);
      // console.debug({ searchResult: result.length });

      this.setState({
        searchResults: [{ data: result }]
      });
    } else {
      this.setState({
        searchResults: null
      });
    }

    this.setState({ searchText: text });
  };

  handleArchiveFiles = media => {
    this.props.deleteMedia(media);
  };

  handleFavePress = mediaId => {
    this.props.toggleFavorite(mediaId);
  };
}

const mapStateToProps = (state, ownProps) => {
  const media = selectMedia(
    state,
    ownProps.category,
    ownProps.subCategory,
    ownProps.group
  ).toJS();

  return { media };
};

Media.propTypes = {
  isNavigableSubCategory: PropTypes.bool.isRequired,
  media: PropTypes.array,
  style: PropTypes.object,
  category: PropTypes.object,
  subCategory: PropTypes.object,
  group: PropTypes.object,
  toggleFavorite: PropTypes.func.isRequired, // action creator
  deleteMedia: PropTypes.func.isRequired, // action creator
  onChoose: PropTypes.func.isRequired,
  onIsStoreChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default connect(mapStateToProps, actions)(Media);
