import React, { PureComponent } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
  Modal
} from "react-native";
import { BtnDetails, BtnHeart, BtnGetMedia } from "../StyleKit";
import MediaDetails from "./MediaDetails";

class MediaItem extends PureComponent {
  state = {
    isShowingDetails: false
  };
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
          <MediaDetails
            isVisible={this.state.isShowingDetails}
            artworkURL={this.props.artworkURL}
            title={this.props.title}
            subtitle={this.props.subtitle}
            onClose={() => this.setState({ isShowingDetails: false })}
          />
          <BtnDetails
            onPress={() => {
              console.debug("info!");
              this.setState({ isShowingDetails: true });
            }}
          />
          <BtnGetMedia
            mode={this.props.getMode}
            price={this.props.price}
            progress={this.props.progress}
          />
          <BtnHeart mediaId={this.props.id} />
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
