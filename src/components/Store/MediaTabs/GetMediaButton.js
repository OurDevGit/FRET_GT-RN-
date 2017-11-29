import React, { Component, PureComponent } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { GetMediaButtonMode } from "../../../models/Media";
import { subscribe, unsubscribe } from "../../../DownloadManager";
import { PrimaryBlue } from "../../../design";
import Svg, {
  G,
  Defs,
  Use,
  Rect,
  Text,
  TSpan,
  Path,
  Circle,
  Polygon
} from "react-native-svg";

export class GetMediaButton extends Component {
  state = {
    progress: null,
    mode: GetMediaButtonMode.Indeterminate
  };

  render() {
    // console.debug(`BtnGetMediaProgress render()`);
    const { mode, price } = this.props;
    const { progress } = this.state;
    return (
      <View>
        <MultiButton
          mode={progress === null ? mode : this.state.mode}
          progress={progress}
          price={price}
        />
      </View>
    );
  }

  componentWillMount() {
    subscribe(this.handleProgress);
  }

  componentWillUnmount() {
    unsubscribe(this.handleProgress);
  }

  handleProgress = (mediaId, progress) => {
    // console.debug(`${mediaId}: ${progress}`);

    if (mediaId === this.props.mediaId) {
      var mode = this.props.mode;
      if (progress < 0) {
        mode = GetMediaButtonMode.Indeterminate;
      } else if (progress < 1) {
        mode = GetMediaButtonMode.Downloading;
      } else if (progress >= 1) {
        console.debug("progress is done!");
        mode = GetMediaButtonMode.Play;
      }

      this.setState({
        progress: progress >= 1 ? null : progress,
        mode
      });
    }
  };
}

GetMediaButton.propTypes = {
  progress: PropTypes.number,
  mode: PropTypes.string,
  price: PropTypes.string,
  mediaId: PropTypes.string.isRequired
};

const BtnBuy = ({ priceText, topText, bottomText }) => (
  <Svg width="78" height="44">
    <Rect
      stroke="rgb(76, 142, 162)"
      strokeWidth="1"
      fill="none"
      x="1"
      y="9.88"
      width="76"
      height="26"
      rx="4"
    />
    <Text
      fill="rgb(76, 142, 162)"
      fontFamily="-apple-system, 'Helvetica Neue', Helvetica, sans-serif"
      fontSize="14"
      x="15.54"
      y="9.88"
      textAnchor="middle"
    >
      <TSpan x="39" y="27.88">
        {priceText}
      </TSpan>
    </Text>

    <Text
      fill="rgb(76, 142, 162)"
      fontFamily="-apple-system, 'Helvetica Neue', Helvetica, sans-serif"
      fontSize="10"
      x="30.14"
      y="11.77"
      textAnchor="middle"
    >
      <TSpan x="39" y="21.77">
        {topText}
      </TSpan>
    </Text>

    <Text
      fill="rgb(76, 142, 162)"
      fontFamily="-apple-system, 'Helvetica Neue', Helvetica, sans-serif"
      fontSize="10"
      x="21.51"
      y="22"
      textAnchor="middle"
    >
      <TSpan x="39" y="32">
        {bottomText}
      </TSpan>
    </Text>
  </Svg>
);

const BtnDownload = () => (
  <Svg width="44" height="44">
    <G id="btnCloudDownload-cloud">
      <Path
        id="btnCloudDownload-bezier2"
        stroke="none"
        fill="rgb(158, 136, 68)"
        d="M 19.49,26.9 C 19.49,26.7 19.32,26.53 19.11,26.53 L 13.46,26.53 C 12.21,26.53 11.2,25.51 11.2,24.27 11.2,23.02 12.21,22.01 13.46,22.01 13.67,22.01 13.84,21.84 13.84,21.63 13.84,21.42 13.67,21.25 13.46,21.25 11.8,21.25 10.45,22.61 10.45,24.27 10.45,25.93 11.8,27.28 13.46,27.28 L 19.11,27.28 C 19.32,27.28 19.49,27.11 19.49,26.9 Z M 19.49,26.9"
      />
      <Path
        id="btnCloudDownload-bezier3"
        stroke="rgb(158, 136, 68)"
        stroke-width="0.5"
        stroke-miterlimit="10"
        fill="none"
        d="M 19.49,26.9 C 19.49,26.7 19.32,26.53 19.11,26.53 L 13.46,26.53 C 12.21,26.53 11.2,25.51 11.2,24.27 11.2,23.02 12.21,22.01 13.46,22.01 13.67,22.01 13.84,21.84 13.84,21.63 13.84,21.42 13.67,21.25 13.46,21.25 11.8,21.25 10.45,22.61 10.45,24.27 10.45,25.93 11.8,27.28 13.46,27.28 L 19.11,27.28 C 19.32,27.28 19.49,27.11 19.49,26.9 Z M 19.49,26.9"
      />
      <Path
        id="btnCloudDownload-bezier4"
        stroke="none"
        fill="rgb(158, 136, 68)"
        d="M 19.1,15.41 C 19.28,15.52 19.51,15.48 19.63,15.31 20.61,13.84 22.25,12.97 24.01,12.97 26.92,12.97 29.28,15.33 29.28,18.24 29.28,18.72 29.22,19.19 29.09,19.65 29.04,19.85 29.15,20.05 29.35,20.11 29.39,20.12 29.42,20.12 29.45,20.12 29.62,20.12 29.77,20.01 29.82,19.85 29.96,19.33 30.03,18.79 30.03,18.24 30.03,14.92 27.33,12.21 24.01,12.21 22,12.21 20.12,13.21 19,14.89 18.88,15.06 18.93,15.29 19.1,15.41 Z M 19.1,15.41"
      />
      <Path
        id="btnCloudDownload-bezier5"
        stroke="rgb(158, 136, 68)"
        stroke-width="0.5"
        stroke-miterlimit="10"
        fill="none"
        d="M 19.33,15.75 C 19.5,15.86 19.74,15.82 19.85,15.65 20.84,14.18 22.47,13.31 24.23,13.31 27.14,13.31 29.51,15.67 29.51,18.58 29.51,19.06 29.44,19.53 29.32,19.99 29.26,20.19 29.38,20.39 29.58,20.45 29.61,20.46 29.65,20.46 29.68,20.46 29.85,20.46 30,20.35 30.04,20.19 30.19,19.67 30.26,19.13 30.26,18.58 30.26,15.26 27.56,12.55 24.23,12.55 22.22,12.55 20.35,13.55 19.23,15.23 19.11,15.4 19.16,15.63 19.33,15.75 Z M 19.33,15.75"
      />
      <Path
        id="btnCloudDownload-bezier6"
        stroke="none"
        fill="rgb(158, 136, 68)"
        d="M 12.4,20.88 C 12.42,20.88 12.44,20.88 12.47,20.87 12.67,20.84 12.81,20.64 12.77,20.44 12.73,20.21 12.71,19.98 12.71,19.75 12.71,17.67 14.4,15.98 16.47,15.98 17.51,15.98 18.48,16.4 19.2,17.15 19.34,17.3 19.58,17.31 19.73,17.16 19.88,17.02 19.89,16.78 19.75,16.63 18.88,15.73 17.72,15.23 16.47,15.23 13.98,15.23 11.95,17.26 11.95,19.75 11.95,20.02 11.98,20.3 12.03,20.57 12.06,20.75 12.22,20.88 12.4,20.88 Z M 12.4,20.88"
      />
      <Path
        id="btnCloudDownload-bezier7"
        stroke="rgb(158, 136, 68)"
        stroke-width="0.5"
        stroke-miterlimit="10"
        fill="none"
        d="M 12.4,20.88 C 12.42,20.88 12.44,20.88 12.47,20.87 12.67,20.84 12.81,20.64 12.77,20.44 12.73,20.21 12.71,19.98 12.71,19.75 12.71,17.67 14.4,15.98 16.47,15.98 17.51,15.98 18.48,16.4 19.2,17.15 19.34,17.3 19.58,17.31 19.73,17.16 19.88,17.02 19.89,16.78 19.75,16.63 18.88,15.73 17.72,15.23 16.47,15.23 13.98,15.23 11.95,17.26 11.95,19.75 11.95,20.02 11.98,20.3 12.03,20.57 12.06,20.75 12.22,20.88 12.4,20.88 Z M 12.4,20.88"
      />
      <Path
        id="btnCloudDownload-bezier8"
        stroke="none"
        fill="rgb(158, 136, 68)"
        d="M 31.13,19.07 C 30.96,18.95 30.73,18.99 30.61,19.16 30.49,19.33 30.53,19.56 30.7,19.68 31.7,20.39 32.29,21.54 32.29,22.76 32.29,24.84 30.6,26.53 28.53,26.53 L 23.63,26.53 C 23.42,26.53 23.25,26.7 23.25,26.9 23.25,27.11 23.42,27.28 23.63,27.28 L 28.53,27.28 C 31.02,27.28 33.05,25.25 33.05,22.76 33.05,21.29 32.33,19.91 31.13,19.07 Z M 31.13,19.07"
      />
      <Path
        id="btnCloudDownload-bezier9"
        stroke="rgb(158, 136, 68)"
        stroke-width="0.5"
        stroke-miterlimit="10"
        fill="none"
        d="M 31.13,19.07 C 30.96,18.95 30.73,18.99 30.61,19.16 30.49,19.33 30.53,19.56 30.7,19.68 31.7,20.39 32.29,21.54 32.29,22.76 32.29,24.84 30.6,26.53 28.53,26.53 L 23.63,26.53 C 23.42,26.53 23.25,26.7 23.25,26.9 23.25,27.11 23.42,27.28 23.63,27.28 L 28.53,27.28 C 31.02,27.28 33.05,25.25 33.05,22.76 33.05,21.29 32.33,19.91 31.13,19.07 Z M 31.13,19.07"
      />
      <Path
        id="btnCloudDownload-bezier10"
        stroke="none"
        fill="rgb(158, 136, 68)"
        d="M 24.87,30.4 L 21.75,33.53 21.75,20.88 C 21.75,20.67 21.58,20.5 21.37,20.5 21.16,20.5 20.99,20.67 20.99,20.88 L 20.99,33.53 17.87,30.4 C 17.72,30.26 17.48,30.26 17.34,30.4 17.19,30.55 17.19,30.79 17.34,30.94 L 21.1,34.7 C 21.14,34.74 21.18,34.76 21.23,34.78 21.27,34.8 21.32,34.81 21.37,34.81 21.42,34.81 21.47,34.8 21.51,34.78 21.56,34.76 21.6,34.74 21.64,34.7 L 25.4,30.94 C 25.55,30.79 25.55,30.55 25.4,30.4 25.26,30.26 25.02,30.26 24.87,30.4 Z M 24.87,30.4"
      />
      <Path
        id="btnCloudDownload-bezier11"
        stroke="rgb(158, 136, 68)"
        stroke-width="0.5"
        stroke-miterlimit="10"
        fill="rgb(158, 136, 68)"
        d="M 24.87,30.4 L 21.75,33.53 21.75,20.88 C 21.75,20.67 21.58,20.5 21.37,20.5 21.16,20.5 20.99,20.67 20.99,20.88 L 20.99,33.53 17.87,30.4 C 17.72,30.26 17.48,30.26 17.34,30.4 17.19,30.55 17.19,30.79 17.34,30.94 L 21.1,34.7 C 21.14,34.74 21.18,34.76 21.23,34.78 21.27,34.8 21.32,34.81 21.37,34.81 21.42,34.81 21.47,34.8 21.51,34.78 21.56,34.76 21.6,34.74 21.64,34.7 L 25.4,30.94 C 25.55,30.79 25.55,30.55 25.4,30.4 25.26,30.26 25.02,30.26 24.87,30.4 Z M 24.87,30.4"
      />
    </G>
  </Svg>
);

const BtnDownloading = ({ progress }) => {
  // We show progress by changing the stroke dash on the Circle. See:
  // https://jakearchibald.com/2013/animated-line-drawing-svg/

  return (
    <Svg width="44" height="44">
      <Defs>
        <G id="progress">
          <G>
            <Circle
              r="11"
              fill="none"
              stroke="rgb(76, 142, 162)"
              strokeWidth="1"
            />
            <Circle
              r="10"
              fill="none"
              stroke="rgb(76, 142, 162)"
              strokeDasharray={60}
              strokeDashoffset={60 - progress * 60}
              strokeWidth="3"
            />
            <Rect
              width="8"
              height="8"
              x="-4"
              y="-4"
              fill="rgb(76, 142, 162)"
              stroke="none"
            />
          </G>
        </G>
      </Defs>
      <Use href="#progress" x="22" y="21" rotation="-90" />
    </Svg>
  );
};

BtnDownloading.propTypes = {
  progress: PropTypes.number
};

class IndetermindateProgress extends PureComponent {
  isMounted_ = false;

  state = {
    rotation: 0
  };

  render() {
    return (
      <Svg width="44" height="44" backgroundColor="purple">
        <Defs>
          <G id="circley">
            <G>
              <Circle fill="none" stroke="#4C8EA2" cx="11" cy="11" r="11" />
              <Polygon id="Triangle" fill="#FFFFFF" points="11 11 15 23 7 23" />
            </G>
          </G>
        </Defs>
        <Use
          href="#circley"
          rotation={this.state.rotation}
          origin="11, 11"
          y="10"
          x="11"
        />
      </Svg>
    );
  }

  componentDidMount() {
    this.isMounted_ = true;
    this.raf = requestAnimationFrame(this.handleRAF);
  }

  handleRAF = () => {
    if (this.isMounted_ === true) {
      this.setState({
        rotation: this.state.rotation + 1
      });

      requestAnimationFrame(this.handleRAF);
    }
  };

  componentWillUnmount() {
    this.isMounted_ = false;
  }
}

const MultiButton = ({ mode, progress, price = "ERR" }) => {
  switch (mode) {
    case GetMediaButtonMode.Play:
      return <View />;
    case GetMediaButtonMode.Purchase:
      return (
        <BtnBuy
          priceText={price}
          fontSize={14}
          topText=""
          bottomText=""
          style={{ backgroundColor: "green" }}
        />
      );
    case GetMediaButtonMode.ComingSoon:
      return (
        <BtnBuy priceText="" fontSize={14} topText="COMING" bottomText="SOON" />
      );
    case GetMediaButtonMode.Download:
      return (
        <BtnDownload style={{ width: 50, height: 50 }} color={PrimaryBlue} />
      );
    case GetMediaButtonMode.Downloading:
      return <BtnDownloading progress={progress} />;
    case GetMediaButtonMode.Indeterminate:
      return <IndetermindateProgress />;
    default:
      break;
  }
};

MultiButton.propTypes = {
  mode: PropTypes.string,
  price: PropTypes.string,
  progress: PropTypes.number
};

export default GetMediaButton;
