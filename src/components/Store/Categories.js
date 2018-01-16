import React from "react";
import PropTypes from "prop-types";
import { View, FlatList, TouchableHighlight, Text } from "react-native";
import { StoreLight, StoreDark, LibraryDark, LibraryLight } from "../../design";
import LargeButton from "./LargeButton";

const extractKey = item => item.id;

class Categories extends React.PureComponent {
  state = {
    buttonHeight: 90,
    topEnabled: false,
    bottomEnabled: true
  };

  render() {
    const { categories, style, isStore } = this.props;

    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "column",
            backgroundColor: isStore ? StoreLight : LibraryLight
          }}
          onPressOut={() => console.debug("out")}
        >
          <TouchableHighlight
            style={{ width: "100%", height: 20, backgroundColor: "#ff00ff" }}
            onPress={this.handleUp}
            activeOpacity={0.1}
            underlayColor="#00ff00"
            enabled={false}
          >
            <Text>---</Text>
          </TouchableHighlight>
          <FlatList
            scrollEnabled={true}
            data={categories}
            renderItem={this.renderItem}
            keyExtractor={extractKey}
            style={{
              ...style
            }}
            onLayout={this.handleLayout}
            onScroll={this.handleScroll}
            ref={r => (this.list = r)}
            onMomentumScrollEnd={this.handleMomentumEnd}
          />
          <TouchableHighlight
            style={{ width: "100%", height: 20, backgroundColor: "#ff00ff" }}
            onPress={this.handleDown}
          >
            <Text>---</Text>
          </TouchableHighlight>
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
    const buttonHeight = Math.min(availableHeight / 4, 120);

    this.setState({
      buttonHeight
    });
  };

  handleScroll = evt => {
    // console.debug(evt.nativeEvent);
    const scrollY = evt.nativeEvent.contentOffset.y;
    const bottom = scrollY + evt.nativeEvent.layoutMeasurement.height;
    const contentHeight = evt.nativeEvent.contentSize.height;

    if (scrollY === 0) {
      console.debug("top");
      this.setState({
        topEnabled: false,
        bottomEnabled: true
      });
    } else if (Math.round(bottom) === Math.round(contentHeight)) {
      console.debug("bottom");
      this.setState({
        topEnabled: true,
        bottomEnabled: false
      });
    } else {
      this.setState({
        topEnabled: true,
        bottomEnabled: true
      });
    }
  };

  handleMomentumEnd = evt => {
    const scrollY = evt.nativeEvent.contentOffset.y;
    const contentHeight = evt.nativeEvent.contentSize.height;
    const buttonCount = Math.round(contentHeight / this.state.buttonHeight);
    const progress = scrollY / contentHeight;
    const row = Math.round(progress * buttonCount);
    // console.debug({ scrollY, contentHeight, buttonCount, row });
    this.snapToRow(row, false);
  };

  handleTouchEnd = evt => {
    console.debug("touch end");
  };

  handleUp = () => {
    const index = Math.max(this.props.selectedIndex - 4, 0);
    this.snapToRow(index);
  };

  handleDown = () => {
    const index = Math.min(
      this.props.selectedIndex + 4,
      this.props.categories.length - 4
    );
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
