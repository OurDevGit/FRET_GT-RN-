import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { View, TextInput, TouchableOpacity, Text, Button } from "react-native";

import { toJS } from "immutable";
import Fuse from "fuse.js";
import _ from "lodash";

import { selectMedia } from "../../redux/selectors";
import { PrimaryGold } from "../../design";
import { FlatButton } from "../Material";
import TabbedMedia from "./TabbedMedia";

const fuseOptions = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ["title", "artist"]
};

class Media extends React.PureComponent {
  state = {
    searchText: "",
    searchResults: null
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
          <Text>{this.props.media.length}</Text>
          <FlatButton
            title="Close"
            style={{ color: PrimaryGold }}
            onPress={() => null}
          />
        </View>

        <TabbedMedia
          media={this.state.searchResults || this.props.media || []}
          onChoose={this.props.onChoose}
          onIsStoreChange={this.props.onIsStoreChange}
        />
      </View>
    );
  }

  componentWillReceiveProps(nextProps) {
    // console.log("Media next props");
    // console.log(nextProps.media.length);
    // console.log(nextProps.media[0].data.length);

    const allMedia = _.flatMap(nextProps.media, m => _.toArray(m.data));
    // console.debug(allMedia[0]);
    this.fuse = new Fuse(allMedia, fuseOptions); // "list" is the item array
  }

  handleChangeText = text => {
    if (this.fuse) {
      const result = this.fuse.search(text);

      console.debug(text);
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
  category: PropTypes.object,
  subCategory: PropTypes.object,
  group: PropTypes.object
};

export default connect(mapStateToProps)(Media);
