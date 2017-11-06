import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { BtnDetails, BtnHeartSmart, BtnGetMediaProgress } from "../StyleKit";
import MediaDetails from "./MediaDetails";
import { GetMediaButtonMode } from "../../models/Media";

class MediaItem extends PureComponent {
  state = {
    isShowingDetails: false
  };

  render() {
    // console.debug("MediaItem render()");
    const hasFiles = this.props.getMode === GetMediaButtonMode.Play;

    return (
      <TouchableOpacity onPress={this.handleTouch}>
        <View style={styles.row}>
          <Image
            source={{ uri: this.props.artworkURL }}
            resizeMode="contain"
            style={styles.thumb}
          />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Text style={styles.subtitle}>{this.props.subtitle}</Text>
          </View>

          <BtnDetails onPress={this.handleTapDetails} />

          <BtnGetMediaProgress
            mode={this.props.getMode}
            price={this.props.price}
            progress={this.props.progress}
            mediaId={this.props.id}
          />

          <BtnHeartSmart mediaId={this.props.id} />
        </View>
      </TouchableOpacity>
    );
  }

  handleTapDetails = () => {
    this.props.onShowDetails(this.props.id);
  };

  handleTouch = () => {
    this.props.onPress(this.props.item);
  };

  handleFavePress = () => {
    console.debug("press heart");
    this.props.onFavePress(this.props.id);
  };
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
  },
  thumb: { width: 40, height: 40 },
  titleContainer: {
    flexDirection: "column",
    marginLeft: 10,
    flexGrow: 1
  },
  title: { fontSize: 12, width: "100%", color: "#4f4f4f" },
  subtitle: { fontSize: 10, width: "100%", color: "#8f8e94" }
});

MediaItem.propTypes = {
  item: PropTypes.object,
  getMode: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  details: PropTypes.string,
  id: PropTypes.string,
  artworkURL: PropTypes.string,
  price: PropTypes.string,
  progress: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  onShowDetails: PropTypes.func.isRequired
};

export default MediaItem;
