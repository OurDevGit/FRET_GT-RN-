import React, { PropTypes } from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
import AdContainer from "./AdContainer";
import MediaPlayer from "./MediaPlayer";
// import VideoPlayer from "./VideoPlayer";

const Root = ({ store }) => (
  <Provider store={store}>
    <View style={{ backgroundColor: "#333", flexGrow: 1 }}>

      <AdContainer />
      <MediaPlayer />
      {/*<VideoPlayer />*/}
    </View>
  </Provider>
);

Root.propTypes = {};

export default Root;
