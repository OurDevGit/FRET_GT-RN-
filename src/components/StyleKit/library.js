import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { gtPcSizeable, ResizingBehavior } from "./lib";
import {
  BuyButton_priceText_fontSize_topText_bottomText,
  BtnCloudDownload_targetFrame_resizing,
  BtnCloudDownload,
  CircularProgress_targetFrame_resizing_angle,
  IndeterminateCircle_angle,
  BtnExpand_rotation
} from "./styleKitComponents";
import { GetMediaButtonMode } from "../../models/Media";
import { PrimaryBlue } from "../../design";
import { subscribe, remove } from "../../DownloadManager";

const BtnBuy = props => {
  return (
    <BuyButton_priceText_fontSize_topText_bottomText
      {...props}
      style={{ width: 78 }}
    />
  );
};

export const BtnDownload = props => {
  const Comp = gtPcSizeable(BtnCloudDownload_targetFrame_resizing);
  return <Comp {...props} resizing={ResizingBehavior.AspectFit} />;
};

export const BtnDownloading = props => {
  const angle = props.progress * 360;

  const Comp = gtPcSizeable(CircularProgress_targetFrame_resizing_angle);
  return (
    <Comp {...props} angle={angle} resizing={ResizingBehavior.AspectFit} />
  );
};

class IndetermindateProgress extends React.Component {
  _isMounted = false; //https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html

  state = {
    angle: 0
  };

  render() {
    return <IndeterminateCircle_angle angle={this.state.angle} />;
  }

  componentDidMount() {
    this._isMounted = true;
    requestAnimationFrame(this.handleAnimationFrame);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleAnimationFrame = time => {
    if (this._isMounted === false) {
      return;
    }

    const diff = time - this.lastTime;
    this.lastTime = time;
    if (!isNaN(diff)) {
      this.setState({
        angle: this.state.angle - diff / 20
      });
    }
    requestAnimationFrame(this.handleAnimationFrame);
  };
}

const BtnGetMedia = ({ mode, price = "ERR", progress, ...rest }) => {
  // hard-returning the download button for debugging right now...
  // return (
  //   <BtnCloudDownload
  //     style={{ backgroundColor: "#dfd", height: 44, width: 44 }}
  //   />
  // );

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
    case GetMediaButtonMode.Indetermindate:
      // return <IndeterminateCircle_angle angle={0} />;
      return <IndetermindateProgress />;
    default:
      break;
  }
};

export const BtnExpand = props => {
  const Comp = BtnExpand_rotation;
  return (
    <Comp
      {...props}
      rotation={props.isExpanded === true ? 180 : 0}
      style={{ width: 23, height: 15 }}
    />
  );
};

export class BtnGetMediaProgress extends Component {
  state = {
    progress: null,
    mode: GetMediaButtonMode.Indetermindate
  };
  render() {
    const { mode, price, progress, ...rest } = this.props;
    return (
      <View>
        <BtnGetMedia
          mode={this.state.progress === null ? mode : this.state.mode}
          price={price}
          progress={this.state.progress}
          {...rest}
        />
      </View>
    );
  }

  componentWillMount() {
    subscribe(this.handleProgress);
  }

  componentWillUnmount() {
    remove(this.handleProgress);
  }

  handleProgress = (mediaId, progress) => {
    // console.debug({ mediaId, progress });

    if (mediaId === this.props.mediaId) {
      // console.debug(`progress: ${progress}`);
      var mode = this.props.mode;
      if (progress < 0) {
        mode = GetMediaButtonMode.Indetermindate;
      } else if (progress < 1) {
        mode = GetMediaButtonMode.Downloading;
      } else if (progress >= 1) {
        mode = GetMediaButtonMode.Play;
      }

      this.setState({
        progress,
        mode
      });
    }
  };
}

BtnGetMediaProgress.propTypes = {
  progress: PropTypes.number,
  mode: PropTypes.string,
  price: PropTypes.string
};
