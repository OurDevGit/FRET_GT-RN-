import React, { Component } from "react";
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableHighlight
} from "react-native";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Fuse from "fuse.js";
import { flatMap, toArray, isFunction } from "lodash";

import { selectMedia } from "../../../redux/selectors";
import { filterMedia, getItemLayout, extractItemKey } from "./lib";
import MediaItem from "./MediaItem";
import Music from "../../Playback/Music";
import { BtnExpand } from "../../StyleKit";

import { getUIState, setOpenSectionIndex } from "../../../models/Store";

const fuseOptions = {
  shouldSort: true,
  threshold: 0.3,
  maxPatternLength: 20,
  minMatchCharLength: 1,
  keys: ["title", "artist"]
};

const idLess = { id: null };

const HiddenTableHeader = () => <View style={styles.hiddenHeader} />;

const RegularTableHeader = ({ section }) => (
  <View style={styles.regularHeader}>
    <Text>{section.title}</Text>
  </View>
);

RegularTableHeader.propTypes = {
  section: PropTypes.object.isRequired
};

const NavigableHeader = ({ section, onPress, isExpanded }) => (
  <TouchableHighlight onPress={onPress}>
    <View style={styles.navigableHeader}>
      <Text style={{ color: isExpanded ? "gray" : "black" }}>
        {section.title}
      </Text>
      <View style={{ height: 15, width: 23 }}>
        <BtnExpand isExpanded={isExpanded} />
      </View>
    </View>
  </TouchableHighlight>
);

NavigableHeader.propTypes = {
  section: PropTypes.object.isRequired,
  onPress: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired
};

class PureTab extends Component {
  constructor(props) {
    super(props);

    const navigableOpenSection = props.isExpandable ? "_ALLCLOSED" : null;

    this.state = {
      searchResults: null,
      navigableOpenSection,
      previewMediaId: null,
      previewProgress: 0
    };
  }

  render() {
    const sections =
      this.state.searchResults ||
      filterMedia(
        this.props.media.toJS(),
        this.props.tabIndex,
        this.state.navigableOpenSection
      ) ||
      [];

    return (
      <View>
        {this.state.previewMediaId && (
          <Music
            rate={1}
            isPlaying={true}
            isSeeking={false}
            song={{ mediaID: this.state.previewMediaId }}
            onProgress={this.handlePreviewProgress}
            onPlayEnd={this.handlePreviewEnd}
            onData={this.handlePreviewData}
            isPreview={true}
          />
        )}
        <SectionList
          stickySectionHeadersEnabled={
            this.state.searchResults === null
              ? this.props.isExpandable !== true
              : false
          }
          sections={sections}
          renderSectionHeader={this.renderTableHeader}
          renderItem={this.renderItem}
          style={styles.list}
          keyExtractor={extractItemKey}
          getItemLayout={getItemLayout}
          initialNumToRender={10}
        />
      </View>
    );
  }

  async componentDidMount() {
    if (this.props.searchText.length > 1) {
      this.doSearch(this.props.searchText, this.props.media);
    } else {
      this.setMediaCount(this.props.media);
    }

    const { openSectionIndex } = await getUIState();
    const { media } = this.props;

    console.debug({ openSectionIndex });

    if (!isNaN(openSectionIndex)) {
      console.debug(`open section index is a number ${openSectionIndex}`);
      if (media) {
        if (media.get(openSectionIndex)) {
          const sectionTitle = media.get(openSectionIndex).get("title");

          if (sectionTitle) {
            this.setState({
              navigableOpenSection: sectionTitle
            });

            await setOpenSectionIndex(null);
          }
        }
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const thisCat = this.props.category || idLess;
    const nextCat = nextProps.category || idLess;
    const thisSubCat = this.props.subCategory || idLess;
    const nextSubCat = nextProps.subCategory || idLess;
    const thisGroup = this.props.group || idLess;
    const nextGroup = nextProps.group || idLess;

    // search
    if (this.props.searchText !== nextProps.searchText) {
      return true;
    }

    // media
    if (nextProps.media !== this.props.media) {
      return true;
    }

    // navigation
    if (
      thisCat.id !== nextCat.id ||
      thisSubCat.id !== nextSubCat.id ||
      thisGroup.id !== nextGroup.id ||
      this.state.navigableOpenSection !== nextState.navigableOpenSection
    ) {
      return true;
    }

    // media preview
    if (
      nextState.previewMediaId !== this.state.previewMediaId ||
      nextState.previewProgress !== this.state.previewProgress
    ) {
      return true;
    }

    // nothing important changed
    return false;
  }

  async componentWillReceiveProps(nextProps) {
    // console.log("PureTab will receive props");
    // console.log(nextProps);

    // do search
    if (
      (this.props.searchText !== nextProps.searchText ||
        this.props.media !== nextProps.media) &&
      nextProps.searchText.length > 1
    ) {
      this.doSearch(nextProps.searchText, nextProps.media);
    } else {
      this.setMediaCount(nextProps.media);
    }

    // when clearing out the search (hitting backspace), make sure to clear out search results
    if (
      nextProps.searchText !== this.props.searchText &&
      nextProps.searchText.length < 2
    ) {
      this.setState({
        searchResults: null
      });
      this.setMediaCount(nextProps.media);
    }

    // changing TO navigable sub categories
    if (nextProps.isExpandable === true && this.props.isExpandable === false) {
      // if UIState has an "open section index", we need to open that up
      // otherwise, set _ALLCLOSED
      const { openSectionIndex } = await getUIState();
      let didSetOpenSection = false;

      console.debug({ openSectionIndex });

      if (!isNaN(openSectionIndex)) {
        console.debug(`open section index is a number ${openSectionIndex}`);
        if (nextProps.media) {
          if (nextProps.media.get(openSectionIndex)) {
            const sectionTitle = nextProps.media
              .get(openSectionIndex)
              .get("title");

            if (sectionTitle) {
              this.setState({
                navigableOpenSection: sectionTitle
              });

              await setOpenSectionIndex(null);
              didSetOpenSection = true;
            }
          }
        }
      }

      if (didSetOpenSection === false) {
        this.setState({ navigableOpenSection: "_ALLCLOSED" });
      }
    }

    // changing FROM navigable sub categories
    if (nextProps.isExpandable === false && this.props.isExpandable === true) {
      this.setState({ navigableOpenSection: null });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    // opening/closing sections
    if (prevState.navigableOpenSection !== this.state.navigableOpenSection) {
      if (this.state.searchResults !== null) {
        this.setMediaCount(this.state.searchResults);
      } else {
        this.setMediaCount(this.props.media);
      }
    }
  }

  renderItem = ({ item, index }) => {
    // console.debug(`render item`);
    // console.debug(`render item ${item.title}: ${item.mediaID}`);
    // console.debug(item);

    return (
      <MediaItem
        id={item.mediaID}
        title={item.title}
        hasPreview={
          this.props.isStore &&
          item.previewDuration !== undefined &&
          item.previewDuration !== null
        }
        isPreviewing={
          this.props.isStore && this.state.previewMediaId === item.mediaID
        }
        previewProgress={
          this.props.isStore === true
            ? this.state.previewMediaId === item.mediaID
              ? this.state.previewProgress
              : 0
            : 0
        }
        subtitle={item.artist}
        details={item.details}
        artworkURL={item.artworkURL}
        price={item.productDetails.priceText}
        getMode={item.getMode}
        progress={item.downloadProgress}
        onShowDetails={this.props.onShowDetails}
        onPress={this.props.onChooseMedia}
        onFavePress={this.props.onFavePress}
        onPreviewPress={this.handlePreviewPress}
      />
    );
  };

  renderTableHeader = ({ section }) => {
    // console.debug(`renderTableHeader()`);
    if (section.title === undefined) {
      return <HiddenTableHeader />;
    } else {
      if (this.state.searchResults === null ? this.props.isExpandable : false) {
        return (
          <NavigableHeader
            section={section}
            isExpanded={this.state.navigableOpenSection === section.title}
            onPress={() => {
              if (section.title === this.state.navigableOpenSection) {
                this.setState({ navigableOpenSection: "_ALLCLOSED" });
              } else {
                this.setState({
                  navigableOpenSection: section.title
                });
              }
            }}
          />
        );
      } else {
        return <RegularTableHeader section={section} />;
      }
    }
  };

  doSearch = (searchText, immMedia) => {
    // console.debug("new search");

    const media = immMedia.toJS();
    const allMedia = flatMap(media, m => toArray(m.data));

    // console.debug(`Searching for ${searchText} in ${allMedia.length} Medias`);

    const fuse = new Fuse(allMedia, fuseOptions);
    if (fuse) {
      // console.debug("has Fuse");
      const result = fuse.search(searchText);
      const searchResults = [{ data: result }];

      // console.debug(searchResults);

      this.setState({
        searchResults
      });

      this.setMediaCount(searchResults);
    } else {
      this.setState({
        searchResults: null
      });

      this.setMediaCount(this.props.media);
    }
  };

  setMediaCount = sections => {
    if (sections === null || sections === undefined) {
      this.props.onMediaCount(0);
      return;
    }

    var mediaCount = 0;

    if (
      this.state.navigableOpenSection === null ||
      this.state.navigableOpenSection === "_ALLCLOSED"
    ) {
      // total up all media in all sections
      var media = isFunction(sections.toJS) ? sections.toJS() : sections;

      mediaCount = media.reduce((prev, curr) => {
        return prev + curr.data.length;
      }, 0);
    } else {
      // get the total for just the open section
      try {
        const openSections = sections.filter(s => {
          if (s === undefined) {
            return false;
          } else {
            s.get("title") === this.state.navigableOpenSection;
          }
        });

        if (openSections.has(0)) {
          mediaCount =
            openSections
              .get(0)
              .get("data")
              .count() || 0;
        }
      } catch (err) {
        // We are seeing an error here in Sentry that doesn't make a lot of sense, so we're logging some details here and rethrowing

        //https://sentry.io/big-swing/guitartunesrn/issues/436529141/events/12486954204/

        console.error(err);
        console.log(JSON.stringify(sections));

        throw err;
      }
    }

    this.props.onMediaCount(mediaCount);
  };

  handlePreviewPress = mediaId => {
    if (mediaId === this.state.previewMediaId) {
      this.setState({
        previewMediaId: null,
        previewProgress: 0
      });
    } else {
      this.setState({
        previewMediaId: mediaId,
        previewProgress: 0
      });
    }
  };

  handlePreviewProgress = progress => {
    // console.debug(progress);

    const previewProgress = Math.max(
      progress.currentTime / progress.duration,
      0
    );
    if (
      previewProgress === this.state.previewProgress &&
      previewProgress > 0.99
    ) {
      console.debug("resetting preview");
      this.setState({
        previewMediaId: null,
        previewProgress: 0
      });
    } else {
      this.setState({
        previewProgress
      });
    }
  };

  handlePreviewEnd = () => {
    this.setState({
      previewMediaId: null,
      previewProgress: 0
    });
  };

  handlePreviewData = () => {};
}

PureTab.propTypes = {
  media: PropTypes.object,
  isExpandable: PropTypes.bool.isRequired,
  onShowDetails: PropTypes.func.isRequired,
  onFavePress: PropTypes.func.isRequired,
  onChooseMedia: PropTypes.func.isRequired,
  onMediaCount: PropTypes.func.isRequired,
  isStore: PropTypes.bool.isRequired,
  category: PropTypes.object,
  subCategory: PropTypes.object,
  group: PropTypes.object,
  searchText: PropTypes.string,
  tabIndex: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  list: {},
  regularHeader: {
    padding: 8,
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
    display: "flex"
  },
  hiddenHeader: {
    display: "none"
  },
  navigableHeader: {
    backgroundColor: "white",
    width: "100%",
    height: 51,
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "#d9d9d9",
    borderBottomWidth: 1,
    padding: 5,
    flexDirection: "row"
  }
});

const mapStateToProps = (state, ownProps) => {
  // console.debug("mapping state to props in PureTab");

  const media = selectMedia(
    state,
    ownProps.category,
    ownProps.subCategory,
    ownProps.group,
    ownProps.isStore
  );

  return { media };
};

export default connect(mapStateToProps)(PureTab);
