import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { PreviewProgress } from "../../StyleKit";

import Svg, { Circle, Path } from "react-native-svg";

// https://guitar-tunes-media-data.s3.amazonaws.com/\(mediaId)/preview.m4a

const PreviewPlay = () => (
  <Svg height="44" width="44">
    <Circle
      id="previewPlay-oval"
      stroke="none"
      fill="rgb(76, 142, 162)"
      fill-opacity="0.7"
      cx="22.4"
      cy="21.14"
      r="12.5"
    />
    <Path
      id="previewPlay-play"
      fill-rule="evenodd"
      stroke="none"
      fill="rgb(255, 255, 255)"
      d="M 18.84,26.37 L 18.84,15.28 28.9,20.82 18.84,26.37 Z M 18.84,26.37"
    />
  </Svg>
);

class MediaThumbnail extends PureComponent {
  render() {
    return this.props.hasPreview ? (
      <View>
        {this.props.isPreviewing !== true ? (
          <Image
            source={{ uri: this.props.thumbUri }}
            resizeMode="contain"
            style={styles.thumb}
          />
        ) : (
          <View style={styles.thumb} />
        )}
        <View style={styles.preview}>
          <TouchableOpacity onPress={this.props.onPreviewPress}>
            {this.props.isPreviewing ? (
              <PreviewProgress progress={this.props.previewProgress} />
            ) : (
              <PreviewPlay />
            )}
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <Image
        source={{ uri: this.props.thumbUri }}
        resizeMode="contain"
        style={styles.thumb}
      />
    );
  }
}

const styles = StyleSheet.create({
  thumb: { width: 40, height: 40 },
  preview: { position: "absolute", left: -3, top: 0 }
});

MediaThumbnail.propTypes = {
  thumbUri: PropTypes.string.isRequired,
  mediaId: PropTypes.string.isRequired,
  hasPreview: PropTypes.bool.isRequired,
  onPreviewPress: PropTypes.func,
  previewProgress: PropTypes.number.isRequired,
  isPreviewing: PropTypes.bool.isRequired
};

export default MediaThumbnail;
