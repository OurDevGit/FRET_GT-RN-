import React, { PureComponent } from "react";
import { View, Text, TouchableOpacity, Image, Button } from "react-native";
import { BtnDetails, BtnBuy } from "../StyleKit";

class MediaItem extends PureComponent {
  render() {
    // console.debug(this.props);
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View
          style={{
            backgroundColor: "#fff",
            width: "100%",
            height: 51,
            borderBottomColor: "#d9d9d9",
            borderBottomWidth: 1,
            padding: 5,
            flexDirection: "row"
            // alignItems: "flex-end",
          }}
        >
          <Image
            source={{ uri: this.props.artworkURL }}
            style={{ width: 40, height: 40 }}
          />
          <View
            style={{ flexDirection: "column", marginLeft: 10, flexGrow: 1 }}
          >
            <Text style={{ fontSize: 12, width: "100%", color: "#4f4f4f" }}>
              {this.props.title}
            </Text>
            <Text style={{ fontSize: 10, width: "100%", color: "#8f8e94" }}>
              {this.props.subtitle}
            </Text>
          </View>
          <BtnDetails />
          <BtnBuy priceText="FREE" fontSize={14} topText="" bottomText="" />
        </View>
      </TouchableOpacity>
    );
  }
}

export default MediaItem;
