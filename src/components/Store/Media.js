import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View } from "react-native";

import * as actions from "../../redux/actions";
import TabbedMedia from "./MediaTabs/TabbedMedia";
import MediaDetails from "./MediaDetails";
import TopControls from "./TopControls";

import { getUIState, setSearch } from "../../models/Store";

class Media extends React.PureComponent {
  state = {
    searchText: "",
    mediaCount: 0,
    detailMediaId: ""
  };

  render() {
    return (
      <View
        style={{
          flexDirection: "column",
          height: "100%",
          backgroundColor: "#f5f5f5"
        }}
      >
        <TopControls
          onSearch={this.handleChangeText}
          onClose={this.props.onClose}
          mediaCount={this.state.mediaCount}
        />
        <View
          style={{
            flex: 1
          }}
        >
          <TabbedMedia
            category={this.props.category}
            subCategory={this.props.subCategory}
            group={this.props.group}
            searchText={this.state.searchText}
            onChoose={this.props.onChoose}
            onIsStoreChange={this.props.onIsStoreChange}
            onFavePress={this.handleFavePress}
            // TODO: take this out and move it down the component branch
            isExpandable={this.props.isExpandable}
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
      </View>
    );
  }

  async componentWillMount() {
    const { search } = await getUIState();

    this.setState({
      detailMediaId: this.props.detailMediaId,
      searchText: search
    });
  }

  handleChangeText = async text => {
    this.setState({ searchText: text });
    await setSearch(text);
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

  handleClear = () => {
    this.setState({
      searchText: ""
    });
  };
}

Media.propTypes = {
  isExpandable: PropTypes.bool.isRequired,
  detailMediaId: PropTypes.string,
  media: PropTypes.object,
  category: PropTypes.object,
  subCategory: PropTypes.object,
  group: PropTypes.object,
  toggleFavorite: PropTypes.func.isRequired, // action creator
  deleteMedia: PropTypes.func.isRequired, // action creator
  onChoose: PropTypes.func.isRequired,
  onIsStoreChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default connect(null, actions)(Media);
