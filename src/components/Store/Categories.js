import React from "react";
import { View, FlatList } from "react-native";
import { StoreLight, StoreDark, LibraryDark, LibraryLight } from "../../design";
import LargeButton from "./LargeButton";

const extractKey = item => item.id;

class Categories extends React.PureComponent {
  render() {
    const { categories, style, isStore } = this.props;
    return (
      <View style={{ flexDirection: "row" }}>
        <FlatList
          data={categories}
          renderItem={this.renderItem}
          keyExtractor={extractKey}
          style={{
            ...style,
            backgroundColor: isStore ? StoreLight : LibraryLight
          }}
        />
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
    // console.debug({ index });
    return (
      <LargeButton
        id={item.id}
        title={item.title}
        iconURL={item.iconURL}
        isSelected={index === this.props.selectedIndex}
        onPress={() => this.props.onChoose(item, index)}
        color={this.props.isStore ? StoreDark : LibraryDark}
      />
    );
  };
}

export default Categories;
