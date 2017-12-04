import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text as PlainText,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { BtnHeartSmart, BtnGetMediaProgress } from "../../StyleKit";
import MediaThumbnail from "./MediaThumbnail";
import { GetMediaButtonMode } from "../../../models/Media";
import Svg, { G, Circle, Text, TSpan } from "react-native-svg";
import GetMediaButton from "./GetMediaButton";

const BtnDetails = ({ onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <Svg height="44" width="44">
      <G id="btnDetails-group">
        <Circle
          id="btnDetails-oval"
          stroke="rgb(76, 142, 162)"
          stroke-width="1"
          stroke-miterlimit="10"
          fill="none"
          cx="22.4"
          cy="21.14"
          r="9.5"
        />

        <Text
          fill="rgb(76, 142, 162)"
          font-family="HelveticaNeue-Medium, 'Helvetica Neue', Helvetica, Arial, sans-serif"
          font-size="12"
          x="21"
          y="12"
          text-anchor="middle"
        >
          <TSpan x="21" y="25">
            i
          </TSpan>
        </Text>
      </G>
    </Svg>
  </TouchableOpacity>
);

BtnDetails.propTypes = {
  onPress: PropTypes.func.isRequired
};

class MediaItem extends PureComponent {
  state = {
    isShowingDetails: false
  };

  render() {
    // console.debug(`MediaItem render()`);
    // console.debug(`MediaItem render() ${this.props.title}: ${this.props.id}`);

    const hasPreview =
      (this.props.getMode === GetMediaButtonMode.Purchase ||
        this.props.getMode === GetMediaButtonMode.Indeterminate ||
        this.props.getMode === GetMediaButtonMode.ComingSoon) &&
      this.props.hasPreview;

    const mediaRow = (
      <View style={styles.row}>
        <MediaThumbnail
          thumbUri={this.props.artworkURL}
          mediaId={this.props.id}
          hasPreview={hasPreview}
          onPreviewPress={this.handlePreviewPress}
          isPreviewing={this.props.isPreviewing}
          previewProgress={this.props.previewProgress}
        />
        <View style={styles.titleContainer}>
          <PlainText style={styles.title}>{this.props.title}</PlainText>
          <PlainText style={styles.subtitle}>{this.props.subtitle}</PlainText>
        </View>

        <BtnDetails onPress={this.handleTapDetails} />

        <GetMediaButton
          mode={this.props.getMode}
          price={this.props.price}
          progress={this.props.progress}
          mediaId={this.props.id}
        />

        <BtnHeartSmart mediaId={this.props.id} />
      </View>
    );

    // only put it in a Touchable if it's not COMING SOON
    return this.props.price.toLowerCase().trim() !== "coming soon" ? (
      <TouchableOpacity onPress={this.handleTouch}>{mediaRow}</TouchableOpacity>
    ) : (
      mediaRow
    );
  }

  handleTapDetails = () => {
    this.props.onShowDetails(this.props.id);
  };

  handleTouch = () => {
    this.props.onPress(this.props.id);
  };

  handleFavePress = () => {
    console.debug("press heart");
    this.props.onFavePress(this.props.id);
  };

  handlePreviewPress = () => {
    this.props.onPreviewPress(this.props.id);
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

  titleContainer: {
    flexDirection: "column",
    marginLeft: 10,
    flexGrow: 1
  },
  title: { fontSize: 12, width: "100%", color: "#4f4f4f" },
  subtitle: { fontSize: 10, width: "100%", color: "#8f8e94" }
});

MediaItem.propTypes = {
  getMode: PropTypes.string,
  title: PropTypes.string,
  isPreviewing: PropTypes.bool.isRequired,
  previewProgress: PropTypes.number.isRequired,
  hasPreview: PropTypes.bool.isRequired,
  subtitle: PropTypes.string,
  details: PropTypes.string,
  id: PropTypes.string,
  artworkURL: PropTypes.string,
  price: PropTypes.string,
  progress: PropTypes.number,
  onPress: PropTypes.func.isRequired,
  onShowDetails: PropTypes.func.isRequired,
  onPreviewPress: PropTypes.func.isRequired
};

export default MediaItem;
