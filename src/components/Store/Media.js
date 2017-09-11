import React from "react";
import { View, TextInput, TouchableOpacity, Text, Button } from "react-native";

import { PrimaryGold } from "../../design";
import TabbedMedia from "./TabbedMedia";

const CloseButton = ({ title }) => (
  <TouchableOpacity onPress={() => console.log("touch")}>
    <View style={{ padding: 8, margin: 8 }}>
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
            flexDirection: "row"
          }}
        >
          <TextInput
            style={{
              //height: 30,
              flexGrow: 1
            }}
            onChangeText={searchText => this.setState({ searchText })}
            value={this.state.searchText}
          />
          <CloseButton title="Close" />
        </View>

        <TabbedMedia
          media={this.props.media || []}
          onChoose={this.props.onChoose}
        />
      </View>
    );
  }
}

export default Media;
