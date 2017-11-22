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
  state = {
    searchResults: null,
    navigableOpenSection: null,
    previewMediaId: null,
    previewProgress: 0
  };

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
              ? this.props.isNavigableSubCategory !== true
              : false
          }
          sections={sections}
          renderSectionHeader={this.renderTableHeader}
          renderItem={this.renderItem}
          style={styles.list}
          keyExtractor={extractItemKey}
          getItemLayout={getItemLayout}
          initialNumToRender={1}
        />
      </View>
    );
  }

  componentWillMount() {
    if (this.props.searchText.length > 1) {
      this.doSearch(this.props.searchText, this.props.media);
    } else {
      this.setMediaCount(this.props.media);
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

  componentWillReceiveProps(nextProps) {
    // console.log("PureTab will receive props");
    // console.log(nextProps);

    // do search
    if (
      this.props.searchText !== nextProps.searchText &&
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
    if (
      nextProps.isNavigableSubCategory === true &&
      this.props.isNavigableSubCategory === false
    ) {
      this.setState({ navigableOpenSection: "_ALLCLOSED" });
    }

    // changing FROM navigable sub categories
    if (
      nextProps.isNavigableSubCategory === false &&
      this.props.isNavigableSubCategory === true
    ) {
      this.setState({ navigableOpenSection: null });
    }
  }

  componentDidUpdate(prevProps, prevState) {
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
    // console.debug(`render item ${index}`);
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
      if (
        this.state.searchResults === null
          ? this.props.isNavigableSubCategory
          : false
      ) {
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
    console.debug("new search");

    const media = immMedia.toJS();
    const allMedia = flatMap(media, m => toArray(m.data));

    console.debug(searchText);
    console.debug(allMedia);

    const fuse = new Fuse(allMedia, fuseOptions);
    if (fuse) {
      const result = fuse.search(searchText);
      const searchResults = [{ data: result }];

      console.debug(searchResults);

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
    var media = isFunction(sections.toJS) ? sections.toJS() : sections;

    if (this.props.isNavigableSubCategory === true) {
      media = media.filter(m => m.title === this.state.navigableOpenSection);
    }

    const mediaCount = media.reduce((prev, curr) => {
      return prev + curr.data.length;
    }, 0);

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
    const previewProgress = progress.currentTime / progress.duration;
    if (
      previewProgress === this.state.previewProgress &&
      previewProgress > 0.9
    ) {
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
  isNavigableSubCategory: PropTypes.bool.isRequired,
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
