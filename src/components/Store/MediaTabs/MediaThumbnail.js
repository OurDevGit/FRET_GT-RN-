import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { PreviewPlay, PreviewProgress } from "../../StyleKit";

// https://guitar-tunes-media-data.s3.amazonaws.com/\(mediaId)/preview.m4a

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
