import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import { Provider, connect } from "react-redux";
import Dimensions from "Dimensions";
import AdContainer from "./AdContainer";
import Playback from "./Playback";
import Home from "./Home";
import FretboardsContainer from "./Fretboards";
import TrackSelector from "./TrackSelector";
import FretlightAdmin from "./FretlightAdmin";
import Settings from "./Settings";
import GuitarController from "./GuitarController";
import Store from "./Store";
import { BtnLibrary, BtnHome, BtnSettings } from "./StyleKit";
import { getMediaForPlay } from "../redux/selectors";
import * as actions from "../redux/actions";

import { getStore, getProductDetails } from "../models/Store";
import { loadPurchased } from "../models/Purchases";

const Sections = {
  Home: 0,
  Library: 1,
  Playback: 2
};

class Root extends Component {
  state = {
    song: null,
    video: null,
    showAd: true,
    showFretboards: true,
    isShowingStore: false,
    isShowingSettings: false,
    isShowingFretlightAdmin: false,
    currentSection: Sections.Home,
    storeDetailMediaId: ""
  };

  render() {
    const { store, visibleTracks } = this.props;
    const deviceWidth = Dimensions.get("window").width;
    const deviceHeight = Dimensions.get("window").height;
    const aspectRatio = deviceWidth / deviceHeight;

    var availableFretboardCount = 1;
    if (aspectRatio < 1.6) {
      availableFretboardCount = 4;
    }

    const isVideo = this.state.video !== null;
    const trackCount = visibleTracks !== undefined ? visibleTracks.count() : 0;
    const showLibraryButton = this.state.showAd && trackCount < 4;
    const isPhone = Dimensions.get("window").height < 500;

    return (
      <Provider store={store}>
        <View style={{ backgroundColor: "white", flexGrow: 1 }}>
          <GuitarController />
          {this.state.isShowingStore && (
            <Store
              onClose={this.handleCloseStore}
              detailMediaId={this.state.storeDetailMediaId}
            />
          )}
          {this.state.showAd && <AdContainer />}

          {this.state.currentSection === Sections.Playback && (
            <Playback
              song={this.state.song}
              video={this.state.video}
              visibleTracks={this.props.visibleTracks}
              onToggleLibrary={this.handleToggleLibrary}
              onToggleAd={this.handleToggleAd}
              onToggleFretboards={this.handleToggleFretboards}
              onClearMedia={this.handleClearMedia}
              onToggleFretlightAdmin={this.handleToggleFretlightAdmin}
            />
          )}
          {(this.state.song !== null || this.state.video !== null) &&
            this.state.currentSection === Sections.Playback && (
              <FretboardsContainer
                isVideo={isVideo}
                isVisible={this.state.showFretboards}
                deviceWidth={deviceWidth}
                deviceHeight={deviceHeight}
                availableFretboardCount={availableFretboardCount}
              />
            )}

          {this.state.currentSection === Sections.Home && (
            <Home
              onChoose={this.handleHomeChoose}
              onDetails={this.handleHomeDetails}
            />
          )}

          {showLibraryButton && (
            <View
              style={{
                position: "absolute",
                right: 30,
                top: 5,
                flexDirection: "row"
              }}
            >
              <BtnHome onPress={this.handleHomePress} />
              {!this.state.isShowingStore && (
                <BtnLibrary
                  color={"#FFFFFF"}
                  onPress={this.handleToggleLibrary}
                />
              )}
              {/* <BtnSettings onPress={this.handleToggleSettings} /> */}
            </View>
          )}

          {availableFretboardCount > 1 &&
            this.state.currentSection === Sections.Playback &&
            this.state.showFretboards && (
              <TrackSelector max={availableFretboardCount} />
            )}

          {this.state.isShowingSettings && (
            <Settings onClose={this.handleToggleSettings} />
          )}
        </View>
      </Provider>
    );
  }

  async componentWillMount() {
    // load the Store data from storage
    const storeObjects = await getStore();
    const productDetails = await getProductDetails();
    const purchases = await loadPurchased();

    this.props.setPurchasedMedia(purchases);
    this.props.storeLoaded(storeObjects);
    this.props.productDetailsLoaded(productDetails);
  }

  async componentDidUpdate(prevProps) {
    // hide the store when selecting new Current Media
    if (this.props.currentMedia !== null) {
      if (prevProps.currentMedia !== this.props.currentMedia) {
        if (this.props.mediaForPlay.id !== undefined) {
          var song = null;
          var video = null;
          const currentSection = Sections.Playback;

          if (this.props.mediaForPlay.isSong === true) {
            song = this.props.mediaForPlay;
          } else if (this.props.mediaForPlay.isVideo === true) {
            video = this.props.mediaForPlay;
          }

          const newState = {
            isShowingStore: false,
            song,
            video,
            currentSection
          };
          this.setState(newState);
        }
      }
    }
  }

  handleCloseStore = () => {
    this.setState({
      isShowingStore: false,
      storeDetailMediaId: ""
    });
  };

  handleHomePress = () => {
    this.setState({
      isShowingStore: false,
      isShowingSettings: false,
      currentSection: Sections.Home
    });
  };

  handleToggleSettings = () => {
    this.setState({
      isShowingStore: false,
      isShowingSettings: !this.state.isShowingSettings
    });
  };

  handleToggleLibrary = () => {
    console.debug("toggle lib press");
    this.setState({
      isShowingStore: true
    });
  };

  handleClearMedia = () => {
    this.setState({
      song: null,
      video: null,
      showAd: true
    });
  };

  handleHomeChoose = mediaId => {
    console.debug("buy media");
    this.props.chooseMedia(mediaId);
  };

  handleHomeDetails = mediaId => {
    this.setState({
      isShowingStore: true,
      storeDetailMediaId: mediaId
    });
  };

  handleToggleAd = bool => {
    this.setState({ showAd: bool });
  };

  handleToggleFretboards = bool => {
    if (bool === undefined) {
      this.setState({ showFretboards: !this.state.showFretboards });
    } else {
      this.setState({ showFretboards: bool });
    }
  };

  handleToggleFretlightAdmin = bool => {
    this.setState({ isShowingFretlightAdmin: bool });
  };
}

Root.propTypes = {
  visibleTracks: PropTypes.object,
  store: PropTypes.object,
  currentMedia: PropTypes.string,
  mediaForPlay: PropTypes.object
};

const mapStateToProps = state => {
  const currentMedia = state.get("currentMedia");
  const mediaForPlay = getMediaForPlay(state, currentMedia).toJS();
  return {
    currentMedia,
    mediaForPlay,
    visibleTracks: state.get("visibleTracks")
  };
};

export default connect(mapStateToProps, actions)(Root);
