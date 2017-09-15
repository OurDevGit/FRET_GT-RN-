import React from "react";
import { View, TextInput, TouchableOpacity, Text, Button } from "react-native";

import { PrimaryGold } from "../../design";
import { FlatButton } from "../Material";
import TabbedMedia from "./TabbedMedia";

const CloseButton = ({ title }) => (
  <TouchableOpacity onPress={() => console.log("touch")}>
    <View style={{ padding: 8, marginRight: 8 }}>
      <Text style={{ color: PrimaryGold }}>{title.toUpperCase()}</Text>
    </View>
  </TouchableOpacity>
);

class Media extends React.PureComponent {
  state = {
    searchText: ""
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
            style={{
              flexGrow: 1,
              marginRight: 8
            }}
            onChangeText={searchText => this.setState({ searchText })}
            value={this.state.searchText}
          />
          <Text>{this.props.media.length}</Text>
          <FlatButton title="Close" style={{ color: PrimaryGold }} />
        </View>

        <TabbedMedia
          media={this.props.media || []}
          onChoose={this.props.onChoose}
          onIsStoreChange={this.props.onIsStoreChange}
        />
      </View>
    );
  }
}

export default Media;
