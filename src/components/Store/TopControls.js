// @flow

import React, { Component } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

import { PrimaryGold } from "../../design";
import { FlatButton } from "../Material";
import FacebookIcon from "./social_icons/Facebook";
import TwitterIcon from "./social_icons/Twitter";
import X from "./X";

type Props = {
  onSearch: string => void,
  onClose: () => void,
  mediaCount: number
};

type State = {
  searchText: string
};

class TopControls extends Component<Props, State> {
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
        <Text>{this.props.mediaCount}</Text>
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

  handleChangeText = (text: string) => {
    this.setState({
      searchText: text
    });

    this.props.onSearch(text);
  };

  handleClear = () => {
    this.handleChangeText("");
  };
}

export default TopControls;
