import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import LargeButton from "./LargeButton";
import { StoreDark, StoreLight, LibraryDark, LibraryLight } from "../../design";

class SubCategories extends React.PureComponent {
  render() {
    const { subCategories, style, isStore } = this.props;

    return (
      <View style={{ flexDirection: "row" }}>
        <FlatList
          data={subCategories}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          style={{
            ...style,
            display: subCategories.length === 0 ? "none" : "flex",
            backgroundColor: isStore ? StoreLight : LibraryLight
          }}
        />
        <View
          style={{
            backgroundColor: isStore ? StoreDark : LibraryDark,
            width: 1,
            display: subCategories.length === 0 ? "none" : "flex",
            height: "100%"
          }}
        />
      </View>
    );
  }

  renderItem = ({ item, index }) => (
    <LargeButton
      id={item.id}
      title={item.title}
      iconURL={item.iconURL}
      isSelected={index === this.props.selectedIndex}
      onPress={() => this.props.onChoose(item, index)}
      color={this.props.isStore ? StoreDark : LibraryDark}
    />
  );
}

export default SubCategories;
