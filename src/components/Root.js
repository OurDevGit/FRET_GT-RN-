import React, { Component } from "react";
import PropTypes from "prop-types";
import { Alert, View, AppState, PermissionsAndroid } from "react-native";
import { Provider, connect } from "react-redux";
import Dimensions from "Dimensions";
import AdContainer from "./AdContainer";
import Playback from "./Playback";
import Home from "./Home";
import FretboardsContainer from "./Fretboards";
import TrackSelector from "./TrackSelector";
import FretlightAdmin from "./FretlightAdmin";
import Settings from "./Settings";
import ChordsAndScales from "./chords-and-scales";
import JamBar from "./jam-bar";
import GuitarController from "./GuitarController";
import CountdownTimer from "./CountdownTimer";
import UserForm from "./user-form";
import Store from "./Store";
import {
  BtnLibrary,
  BtnHome,
  BtnSettings,
  BtnChordsAndScales
} from "./StyleKit";
import {
  setTabIndex,
  setCategoryIndex,
  setSubCategoryIndex,
  setOpenSectionIndex,
  setSearch
} from "../models/Store";
import { getUserBirthdate, getUserLevel } from "../models/User";
import { getMediaForPlay } from "../redux/selectors";
import * as actions from "../redux/actions";
import { getIsPhone } from "../utils";
import { loadJamBarData } from "./jam-bar/utils";
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
  Playback: 1,
  ChordsAndScales: 2
};

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      song: null,
      video: null,
      showAd: true,
      showFretboards: true,
      isShowingStore: false,
      isShowingSettings: false,
      isShowingCountdownTimer: false,
      isShowingUserForm: false,
      priorSection: null,
      currentSection: Sections.Home,
      storeDetailMediaId: "",
      appState: AppState.currentState,
      homePage: "index",
      userBirthdate: undefined,
      userExperienceLevel: undefined
    };
  }

  render() {
    // console.debug(`Root render()`);
    const { store, visibleTracks } = this.props;
    const deviceWidth = Dimensions.get("window").width;
    const deviceHeight = Dimensions.get("window").height;
    const aspectRatio = deviceWidth / deviceHeight;

    var availableFretboardCount = 1;
    if (aspectRatio < 1.6) {
      availableFretboardCount = 4;
    }

    const isHome = this.state.currentSection === Sections.Home;
    const isVideo = this.state.video !== null;
    const trackCount = visibleTracks !== undefined ? visibleTracks.count() : 0;
    const showLibraryButton =
      this.state.showAd &&
      trackCount < 4 &&
      (!this.props.isShowingJamBar || !getIsPhone());
    const shouldShowFretboards =
      ((this.state.song !== null || this.state.video !== null) &&
        this.state.currentSection === Sections.Playback) ||
      this.state.currentSection === Sections.ChordsAndScales;
    const isPhone = getIsPhone();
    const shouldShowAd =
      (!this.props.isShowingJamBar || !getIsPhone()) && this.state.showAd;
    this.Home = undefined;

    return (
      <Provider store={store}>
        <View style={{ backgroundColor: "white", flexGrow: 1 }}>
          <GuitarController />

          {shouldShowAd && <AdContainer />}

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
              isShowingAd={shouldShowAd}
            />
          )}

          {this.state.currentSection === Sections.ChordsAndScales && (
            <ChordsAndScales
              onToggleFretlightAdmin={this.handleToggleFretlightAdmin}
            />
          )}

          {this.props.isShowingJamBar && <JamBar />}

          {shouldShowFretboards && (
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
              userLevel={this.state.userExperienceLevel}
              homePage={this.state.homePage}
              onChoose={this.handleHomeChoose}
              onDetails={this.handleHomeDetails}
              onUpdateLevel={this.handleHomeUserLevelUpdate}
              onChordsAndScales={this.handleChordsAndScalesPress}
              onPageLoad={this.handleHomePageLoad}
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
                  <BtnHome isHome={isHome} onPress={this.handleHomePress} />
                  <BtnLibrary
                    color={"#FFFFFF"}
                    onPress={this.handleToggleLibrary}
                  />
                  <BtnChordsAndScales
                    style={{ flex: 1, width: 44, height: 44, marginLeft: -6 }}
                    onPress={this.handleChordsAndScalesPress}
                    isChordsAndScales={
                      this.state.currentSection === Sections.ChordsAndScales
                    }
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

          {this.props.bleMenuIsActive && (
            <FretlightAdmin
              isPhone={isPhone}
              onToggleFretlightAdmin={this.handleToggleFretlightAdmin}
            />
          )}

          {this.state.isShowingSettings && (
            <Settings
              savedBirthdate={this.state.userBirthdate}
              onPresentUserForm={this.handlePresentUserForm}
              onClose={this.handleToggleSettings}
            />
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

          {this.state.isShowingUserForm && (
            <UserForm
              ref={ref => (this.Home = ref)}
              savedBirthdate={this.state.userBirthdate}
              savedExperienceLevel={this.state.userExperienceLevel}
              onClose={this.handleDismissUserForm}
            />
          )}
        </View>
      </Provider>
    );
  }

  async componentWillMount() {
    this.props.requestBootstrap();
    loadJamBarData();

    let userBirthdate = await getUserBirthdate();
    let userExperienceLevel = await getUserLevel();
    let isShowingUserForm =
      userBirthdate === undefined || userExperienceLevel === undefined;

    this.setState({ userBirthdate, userExperienceLevel, isShowingUserForm });
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
          var showAd = true;
          const currentSection = Sections.Playback;
          const isPhone = getIsPhone();

          if (
            this.props.mediaForPlay.isSong === true ||
            (this.props.mediaForPlay.isLesson === true &&
              this.props.mediaForPlay.isVideo !== true) ||
            this.props.mediaForPlay.isJamAlong === true
          ) {
            song = this.props.mediaForPlay;
          } else if (this.props.mediaForPlay.isVideo === true) {
            video = this.props.mediaForPlay;
            showAd = !isPhone;
          }

          const newState = {
            isShowingStore: false,
            showFretboards: true,
            song,
            video,
            showAd,
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
      this.props.setAppClosing(false);
      startAppSession();
    }

    if (
      this.state.appState === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      this.props.setAppClosing(true);
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

  handlePresentUserForm = () => {
    this.props.presentModal();
    this.setState({ isShowingUserForm: true });
  };

  handleDismissUserForm = (
    userBirthdate,
    userExperienceLevel,
    shouldLoadFirstRun
  ) => {
    this.props.dismissModal();
    this.setState({
      isShowingUserForm: false,
      isShowingSettings: false,
      currentSection: Sections.Home,
      homePage: shouldLoadFirstRun ? "firstRun" : "index",
      userBirthdate,
      userExperienceLevel
    });
  };

  handleHomePress = () => {
    if (this.state.currentSection !== Sections.Home) {
      this.props.setJamBar(false);
      startHomeView();

      this.setState({
        isShowingStore: false,
        isShowingSettings: false,
        currentSection: Sections.Home,
        priorSection: this.state.currentSection
      });
    } else if (this.state.homePage !== "index") {
      this.setState({ homePage: "index" });
    }
  };

  handleHomeUserLevelUpdate = userExperienceLevel => {
    this.setState({ userExperienceLevel, homePage: "index" });
  };

  handleHomePageLoad = page => {
    const homePage = page.includes("index.html") ? "index" : "firstRun";
    this.setState({ homePage });
  };

  handleChordsAndScalesPress = () => {
    this.props.setChordsAndScales();

    const { visibleTracks, guitars, updateGuitarSetting } = this.props;
    const isShowingCS = this.state.currentSection === Sections.ChordsAndScales;
    const firstTrack = visibleTracks[0] || {};
    var trackName = isShowingCS ? firstTrack.name : "chordsAndScales";

    if (trackName !== undefined) {
      guitars.forEach(guitar => {
        updateGuitarSetting(guitar.set("track", trackName));
      });
    }

    this.setState({
      isShowingStore: false,
      isShowingSettings: false,
      currentSection: Sections.ChordsAndScales
    });
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

    const { song, video, currentSection } = this.state;
    if (
      (song !== null || video !== null) &&
      (currentSection === Sections.ChordsAndScales ||
        currentSection === Sections.Home)
    ) {
      this.setState({
        isShowingStore: true,
        currentSection: Sections.Playback
      });
    } else {
      this.setState({
        isShowingStore: true
      });
    }
  };

  handleClearMedia = () => {
    this.setState({
      song: null,
      video: null,
      showAd: true,
      priorSection: null,
      currentSection: Sections.Home,
      isShowingCountdownTimer: false
    });
  };

  handleHomeChoose = mediaId => {
    this.props.chooseMedia(mediaId);
  };

  handleHomeDetails = async params => {
    // Go to the Store tab and the All Content Category
    // console.debug(params);

    await setTabIndex(0);
    await setCategoryIndex(Number(params.category || 0));
    await setSubCategoryIndex(Number(params.subcategory || 0));
    await setSearch(params.search ? decodeURIComponent(params.search) : "");
    await setOpenSectionIndex(Number(params.group));

    this.setState({
      isShowingStore: true,
      storeDetailMediaId: params.media_detail
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

  handleToggleFretlightAdmin = async bool => {
    if (bool == true) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            title: "Location Access for Bluetooth",
            message:
              "Guitar Tunes needs permission to use Location so we can connect to your Fretlight. Android includes Bluetooth in that service."
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.props.toggleBLEMenu(true);
        } else {
          Alert.alert(
            "Permission Denied",
            "You will be able to enjoy the rest of the app without Location permitted. You can change permission the next time you want to connect with your Fretlight"
          );
        }
      } catch (err) {
        Alert.alert(
          "Permission Error",
          "There was an error checking permission for this service. Please try again later."
        );
      }
    } else {
      this.props.toggleBLEMenu(false);
    }
  };

  handleCountdownTimer = bool => {
    if (!bool || this.props.countdownTimerState) {
      this.setState({ isShowingCountdownTimer: bool });
    }
  };
}

Root.propTypes = {
  visibleTracks: PropTypes.object,
  guitars: PropTypes.object,
  store: PropTypes.object,
  currentMedia: PropTypes.string,
  mediaForPlay: PropTypes.object,
  isShowingJamBar: PropTypes.bool.isRequired,
  bleMenuIsActive: PropTypes.bool.isRequired,
  countdownTimerState: PropTypes.bool.isRequired,
  chooseMedia: PropTypes.func.isRequired,
  requestBootstrap: PropTypes.func.isRequired,
  presentModal: PropTypes.func.isRequired,
  dismissModal: PropTypes.func.isRequired,
  setAppClosing: PropTypes.func.isRequired,
  setChordsAndScales: PropTypes.func.isRequired,
  setJamBar: PropTypes.func.isRequired,
  updateGuitarSetting: PropTypes.func.isRequired,
  toggleBLEMenu: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const currentMedia = state.get("currentMedia");
  const mediaForPlay = getMediaForPlay(state, currentMedia).toJS();
  return {
    currentMedia,
    mediaForPlay,
    visibleTracks: state.get("visibleTracks"),
    countdownTimerState: state.get("countdownTimerState"),
    isShowingJamBar: state.get("isShowingJamBar"),
    guitars: state.get("guitars"),
    bleMenuIsActive: state.get("bleMenuIsActive")
  };
};

export default connect(mapStateToProps, actions)(Root);
