import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet
} from "react-native";
import { BtnDetails, BtnBuy } from "../StyleKit";

class MediaItem extends PureComponent {
  render() {
    // console.debug(this.props);
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={styles.row}>
          <Image source={{ uri: this.props.artworkURL }} style={styles.thumb} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.subtitle}>{this.props.subtitle}</Text>
          </View>
          <BtnDetails />
          <BtnBuy
            priceText={this.props.price}
            fontSize={14}
            topText=""
            bottomText=""
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: "#fff",
    width: "100%",
    height: 51,
    borderBottomColor: "#d9d9d9",
    borderBottomWidth: 1,
    padding: 5,
    flexDirection: "row"
    // alignItems: "flex-end",
  },
  thumb: { width: 40, height: 40 },
  titleContainer: { flexDirection: "column", marginLeft: 10, flexGrow: 1 },
  title: { fontSize: 12, width: "100%", color: "#4f4f4f" },
  subtitle: { fontSize: 10, width: "100%", color: "#8f8e94" }
});

export default MediaItem;
