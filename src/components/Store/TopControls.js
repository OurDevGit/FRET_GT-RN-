import React, { Component } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import PropTypes from "prop-types";

import { PrimaryGold } from "../../design";
import { FlatButton } from "../Material";
import FacebookIcon from "./social_icons/Facebook";
import TwitterIcon from "./social_icons/Twitter";
import X from "./X";

class TopControls extends Component {
  state = {
    searchText: ""
  };

  render() {
    return (
      <View
        style={{
          height: 44,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#fafafa"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexShrink: 1,
            marginRight: 8,
            borderBottomColor: "black",
            borderBottomWidth: 1
          }}
        >
          <TextInput
            disableFullscreenUI={true}
            blurOnSubmit={true}
            clearButtonMode="always"
            returnKeyType="search"
            placeholder="Search"
            placeholderTextColor="lightgray"
            inlineImageLeft="search_icon"
            style={{
              flexGrow: 1
            }}
            onChangeText={this.handleChangeText}
            value={this.state.searchText}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity
            onPress={this.handleClear}
            style={{
              width: 40,
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X />
          </TouchableOpacity>
        </View>
        <Text>{this.state.mediaCount}</Text>
        <FacebookIcon />
        <TwitterIcon />
        <FlatButton
          title="Close"
          style={{ color: PrimaryGold }}
          onPress={this.props.onClose}
        />
      </View>
    );
  }

  handleChangeText = text => {
    this.setState({
      searchText: text
    });

    this.props.onSearch(text);
  };

  handleClear = () => {
    this.handleChangeText("");
  };
}

TopControls.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TopControls;
