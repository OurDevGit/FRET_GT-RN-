import React, { Component } from "react";
import { View, StatusBar, Button } from "react-native";
import { Provider } from "react-redux";
import AdContainer from "./AdContainer";
import Playback from "./Playback";
import FretboardsContainer from "./Fretboards";
import Library from "./Library";
import TrackSelector from "./TrackSelector";

import testSongs from "../testSongs";
import testVideos from "../testVideos";

import PaintCode from "./StyleKit/PaintCode.js";
import { BtnBuy } from "./StyleKit";

const testMedia = [...testVideos, ...testSongs];

class Root extends Component {
  state = {
    libIsOpen: false,
    song: null,
    video: null,
    showAd: true,
    layout: { width: 1, height: 1 }
  };

  render() {
    const { store } = this.props;
    const aspectRatio = this.state.layout.width / this.state.layout.height;
    const supportsMultipleFretboards =
      this.state.layout.width > 1 && aspectRatio < 1.6;

    return (
      <Provider store={store}>
        <View
          style={{ backgroundColor: "white", flexGrow: 1 }}
          onLayout={this.handleLayout}
        >
          <StatusBar hidden />

          {this.state.showAd &&
            <AdContainer onToggleLibrary={this.handleToggleLibrary} />}
          <Playback song={this.state.song} video={this.state.video} />
          <FretboardsContainer
            deviceWidth={this.state.layout.width}
            deviceHeight={this.state.layout.height}
            supportsMultipleFretboards={supportsMultipleFretboards}
          />
          <Library
            isOpen={this.state.libIsOpen}
            onSelect={this.handleSelectMedia}
            media={testMedia}
          />
          <View style={{ position: "absolute", left: 5, top: 5 }}>
            {!this.state.libIsOpen &&
              <Button title="Lib" onPress={this.handleToggleLibrary} />}
          </View>

          {supportsMultipleFretboards && <TrackSelector />}

          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white"
              // flex: 1
            }}
          >
            <BtnBuy text="$1.99" fontSize={12} width={50} height={25} />
            <PaintCode
              // drawBuyButton(Canvas canvas, Context context, String priceText, float fontSize, String topText, String bottomText)
              drawMethod="BuyButton"
              drawArgs={["priceText", "fontSize", "topText", "bottomText"]}
              priceText="$1.99"
              fontSize={12}
              topText=""
              bottomText=""
              style={{ width: 50, height: 25 }}
            />

            <PaintCode
              drawMethod="IndeterminateCircle"
              drawArgs={["angle"]}
              angle={3}
              style={{ height: 25, width: 25 }}
            />
            <PaintCode
              // drawBtnCloudDownload(Canvas canvas, RectF targetFrame, ResizingBehavior resizing) {
              drawMethod="BtnCloudDownload"
              drawArgs={["targetFrame", "resizing"]}
              targetFrame={{ left: 0, top: 0, right: 50, bottom: 50 }}
              resizing="ResizingBehavior.AspectFit"
              style={{ height: 25, width: 25 }}
            />
            <PaintCode
              // drawDownloadProgress(Canvas canvas, boolean isPressed, float redValue, float greenValue, float blueValue, PointF scrollSize, float progress)
              drawMethod="DownloadProgress"
              drawArgs={[
                "isPressed",
                "redValue",
                "greenValue",
                "blueValue",
                "scrollSize",
                "progress"
              ]}
              isPressed={false}
              redValue={0.5}
              blueValue={0.5}
              greenValue={1}
              scrollSize={{ x: 200, y: 10 }}
              progress={0.25}
              style={{ height: 25, width: 200 }}
            />
          </View>
        </View>
      </Provider>
    );
  }

  handleToggleLibrary = () => {
    this.setState({
      libIsOpen: !this.state.libIsOpen
    });
  };

  handleSelectMedia = mediaIndex => {
    const media = testMedia[mediaIndex];

    if (media.type === "song") {
      this.setState({
        libIsOpen: false,
        song: media,
        video: null,
        showAd: true
      });
    } else if (media.type === "video") {
      this.setState({
        libIsOpen: false,
        song: null,
        video: media,
        showAd: false
      });
    }
  };

  handleLayout = e => {
    this.setState({
      layout: { ...e.nativeEvent.layout }
    });
  };
}

export default Root;
