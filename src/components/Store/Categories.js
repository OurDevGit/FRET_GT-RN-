import React from "react";
import PropTypes from "prop-types";
import { View, FlatList, TouchableOpacity } from "react-native";
import { clamp } from "lodash";
import { StoreLight, StoreDark, LibraryDark, LibraryLight } from "../../design";
import LargeButton from "./LargeButton";
import { UpArrow, DownArrow } from "./PageArrows";

const defaultButtonHeight = 90;
const extractKey = item => item.id;

class Categories extends React.PureComponent {
  state = {
    buttonHeight: defaultButtonHeight,
    upEnabled: false,
    downEnabled: true,
    showPaginationButtons: false
  };

  render() {
    const { categories, isStore, selectedIndex } = this.props;

    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "column",
            backgroundColor: isStore ? StoreLight : LibraryLight
          }}
          onPressOut={() => console.debug("out")}
        >
          {this.state.showPaginationButtons && (
            <TouchableOpacity
              style={{
                width: "100%",
                height: 24,
                backgroundColor: isStore ? StoreDark : LibraryDark
              }}
              onPress={this.handleUp}
              activeOpacity={0.1}
            >
              <View>
                <UpArrow enabled={this.state.upEnabled} store={isStore} />
              </View>
            </TouchableOpacity>
          )}
          <FlatList
            scrollEnabled={true}
            data={categories}
            extraData={{ selectedIndex, isStore }}
            renderItem={this.renderItem}
            keyExtractor={extractKey}
            onLayout={this.handleLayout}
            onScroll={this.handleScroll}
            ref={r => (this.list = r)}
            onMomentumScrollEnd={this.handleMomentumEnd}
          />
          {this.state.showPaginationButtons && (
            <TouchableOpacity
              style={{
                width: "100%",
                height: 24,
                backgroundColor: isStore ? StoreDark : LibraryDark
              }}
              onPress={this.handleDown}
            >
              <View>
                <DownArrow enabled={this.state.downEnabled} store={isStore} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            backgroundColor: isStore ? StoreDark : LibraryDark,
            width: 1,
            height: "100%"
          }}
        />
      </View>
    );
  }

  renderItem = ({ item, index }) => {
    var title = item.title;
    if (
      this.props.isStore !== true &&
      item.libraryTitle !== undefined &&
      item.libraryTitle.trim() !== ""
    ) {
      title = item.libraryTitle;
    }

    return (
      <LargeButton
        id={item.id}
        title={title}
        iconURL={item.iconURL}
        isSelected={index === this.props.selectedIndex}
        onPress={() => this.props.onChoose(item, index)}
        color={this.props.isStore ? StoreDark : LibraryDark}
        height={this.state.buttonHeight}
      />
    );
  };

  handleLayout = evt => {
    const availableHeight = evt.nativeEvent.layout.height;
    var buttonHeight = Math.min(availableHeight / 4, 120);
    const defaultTotalHeight =
      this.props.categories.length * defaultButtonHeight;

    var showPaginationButtons = this.state.showPaginationButtons;

    if (defaultTotalHeight <= availableHeight) {
      buttonHeight = defaultButtonHeight;
      showPaginationButtons = false;
    } else {
      showPaginationButtons = true;
    }

    this.setState({
      buttonHeight,
      showPaginationButtons
    });
  };

  handleScroll = evt => {
    const scrollY = evt.nativeEvent.contentOffset.y;
    const bottom = scrollY + evt.nativeEvent.layoutMeasurement.height;
    const contentHeight = evt.nativeEvent.contentSize.height;

    if (scrollY === 0) {
      console.debug("top");
      this.setState({
        upEnabled: false,
        downEnabled: true
      });
    } else if (Math.round(bottom) === Math.round(contentHeight)) {
      this.setState({
        upEnabled: true,
        downEnabled: false
      });
    } else {
      this.setState({
        upEnabled: true,
        downEnabled: true
      });
    }
  };

  handleMomentumEnd = evt => {
    const scrollY = evt.nativeEvent.contentOffset.y;
    const contentHeight = evt.nativeEvent.contentSize.height;
    const buttonCount = Math.round(contentHeight / this.state.buttonHeight);
    const progress = scrollY / contentHeight;
    const row = Math.round(progress * buttonCount);
    const index = clamp(row, 0, this.props.categories.length - 1);
    this.snapToRow(index);
    // console.debug({ scrollY, contentHeight, buttonCount, row });
  };

  handleTouchEnd = () => {
    console.debug("touch end");
  };

  handleUp = () => {
    if (this.state.upEnabled !== true) {
      return;
    }

    const { selectedIndex, categories } = this.props;
    const index = clamp(selectedIndex - 4, 0, categories.length - 1);
    this.snapToRow(index);
  };

  handleDown = () => {
    if (this.state.downEnabled !== true) {
      return;
    }

    const { selectedIndex, categories } = this.props;
    const index = clamp(selectedIndex + 4, 0, categories.length - 4);
    this.snapToRow(index);
  };

  snapToRow = (index, doSelect = true) => {
    const item = this.props.categories[index];
    this.list.scrollToIndex({ animated: true, index });

    if (doSelect === true) {
      this.props.onChoose(item, index);
    }
  };
}

Categories.propTypes = {
  categories: PropTypes.array,
  isStore: PropTypes.bool.isRequired,
  onChoose: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number
};

export default Categories;
