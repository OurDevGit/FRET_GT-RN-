import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, AppState } from "react-native";
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
import CountdownTimer from "./CountdownTimer";
import Store from "./Store";
import { BtnLibrary, BtnHome, BtnSettings } from "./StyleKit";
import {
  setTabIndex,
  setCategoryIndex,
  setSubCategoryIndex
} from "../models/Store";
import { getMediaForPlay } from "../redux/selectors";
import * as actions from "../redux/actions";
import { getIsPhone } from "../utils";
import {
  registerSuperProperties,
  startAppSession,
  stopAppSession,
  startHomeView,
  trackHomeView,
  startMedia
} from "../metrics";

const Sections = {
  Home: 0,
  Playback: 1
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
    isShowingCountdownTimer: false,
    currentSection: Sections.Home,
    homeTrigger: null,
    storeDetailMediaId: "",
    appState: AppState.currentState
  };

  render() {
    console.debug(`Root render()`);
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
    const isPhone = getIsPhone();

    return (
      <Provider store={store}>
        <View style={{ backgroundColor: "white", flexGrow: 1 }}>
          <GuitarController />

          {this.state.showAd && <AdContainer />}

          {this.state.currentSection === Sections.Playback && (
            <Playback
              song={this.state.song}
              video={this.state.video}
              visibleTracks={this.props.visibleTracks}
              countdownTimerState={this.props.countdownTimerState}
              onToggleLibrary={this.handleToggleLibrary}
              onToggleAd={this.handleToggleAd}
              onToggleFretboards={this.handleToggleFretboards}
              onClearMedia={this.handleClearMedia}
              onToggleFretlightAdmin={this.handleToggleFretlightAdmin}
              onCountdownTimer={this.handleCountdownTimer}
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
              ref={ref => (this.Home = ref)}
              onChoose={this.handleHomeChoose}
              onDetails={this.handleHomeDetails}
              reloadTrigger={this.state.homeTrigger}
            />
          )}

          {showLibraryButton && (
            <View
              style={{
                position: "absolute",
                right: isPhone ? -4 : 20,
                top: "3%",
                flexDirection: "row"
              }}
            >
              {!this.state.isShowingStore && (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-end"
                  }}
                >
                  <BtnHome onPress={this.handleHomePress} />
                  <BtnLibrary
                    color={"#FFFFFF"}
                    onPress={this.handleToggleLibrary}
                  />
                  <BtnSettings onPress={this.handleToggleSettings} />
                </View>
              )}
            </View>
          )}

          {availableFretboardCount > 1 &&
            this.state.currentSection === Sections.Playback &&
            this.state.showFretboards && (
              <TrackSelector max={availableFretboardCount} />
            )}

          {this.state.isShowingFretlightAdmin && (
            <FretlightAdmin
              isPhone={isPhone}
              onToggleFretlightAdmin={this.handleToggleFretlightAdmin}
            />
          )}

          {this.state.isShowingSettings && (
            <Settings onClose={this.handleToggleSettings} />
          )}

          {this.state.isShowingCountdownTimer && (
            <CountdownTimer onComplete={this.handleCountdownTimer} />
          )}

          {this.state.isShowingStore && (
            <Store
              onClose={this.handleCloseStore}
              detailMediaId={this.state.storeDetailMediaId}
            />
          )}
        </View>
      </Provider>
    );
  }

  async componentWillMount() {
    this.props.requestBootstrap();
  }

  componentDidMount() {
    startAppSession();
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  async componentDidUpdate(prevProps) {
    // hide the store when selecting new Current Media
    if (this.props.currentMedia !== null) {
      if (prevProps.currentMedia !== this.props.currentMedia) {
        if (this.props.mediaForPlay.id !== undefined) {
          var song = null;
          var video = null;
          const currentSection = Sections.Playback;

          if (
            this.props.mediaForPlay.isSong === true ||
            this.props.mediaForPlay.isJamAlong === true
          ) {
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

          const { mediaID, title, artist } = this.props.mediaForPlay;
          registerSuperProperties(mediaID, title, artist);
          startMedia(mediaID);
          this.props.dismissModal();
        }
      }
    }

    if (
      this.state.currentSection === Sections.Home &&
      !this.state.isShowingStore &&
      !this.state.isShowingSettings
    ) {
      startHomeView();
    } else {
      trackHomeView();
    }
  }

  handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      startAppSession();
    }

    if (
      this.state.appState === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      stopAppSession();
    }

    this.setState({ appState: nextAppState });
  };

  handleCloseStore = () => {
    this.props.dismissModal();
    this.setState({
      isShowingStore: false,
      storeDetailMediaId: ""
    });
  };

  handleHomePress = () => {
    this.setState({
      isShowingStore: false,
      isShowingSettings: false,
      currentSection: Sections.Home,
      homeTrigger: Math.random()
    });

    if (this.Home) {
      this.Home.forceUpdate();
    }
    startHomeView();
  };

  handleToggleSettings = () => {
    if (this.state.isShowingSettings) {
      this.props.dismissModal();
    } else {
      this.props.presentModal();
    }

    this.setState({
      isShowingStore: false,
      isShowingSettings: !this.state.isShowingSettings
    });
  };

  handleToggleLibrary = () => {
    this.props.presentModal();
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

  handleHomeDetails = async params => {
    await setTabIndex(0);
    const categoryIndex = await setCategoryIndex(Number(params.category || 0));
    const subCategoryIndex = await setSubCategoryIndex(
      Number(params.subcategory || 0)
    );

    this.setState({
      isShowingStore: true,
      storeDetailMediaId: params.media_detail,
      categoryIndex,
      subCategoryIndex
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

  handleCountdownTimer = bool => {
    if (!bool || this.props.countdownTimerState) {
      this.setState({ isShowingCountdownTimer: bool });
    }
  };
}

Root.propTypes = {
  visibleTracks: PropTypes.object,
  store: PropTypes.object,
  currentMedia: PropTypes.string,
  mediaForPlay: PropTypes.object,
  countdownTimerState: PropTypes.bool.isRequired,
  chooseMedia: PropTypes.func.isRequired,
  requestBootstrap: PropTypes.func.isRequired,
  presentModal: PropTypes.func.isRequired,
  dismissModal: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const currentMedia = state.get("currentMedia");
  const mediaForPlay = getMediaForPlay(state, currentMedia).toJS();
  return {
    currentMedia,
    mediaForPlay,
    visibleTracks: state.get("visibleTracks"),
    countdownTimerState: state.get("countdownTimerState")
  };
};

export default connect(mapStateToProps, actions)(Root);
