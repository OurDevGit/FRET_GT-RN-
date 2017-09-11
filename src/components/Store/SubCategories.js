import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import LargeButton from "./LargeButton";

class CategoryItem extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View
          style={{
            backgroundColor: "#ddd",
            // width: 50,
            // height: 50,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            alignItems: "flex-end",
            flexDirection: "row"
          }}
        >
          <Text style={{ fontSize: 10, width: "100%", textAlign: "center" }}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class SubCategories extends React.PureComponent {
  renderItem = ({ item, index }) => (
    <LargeButton
      id={item.id}
      title={item.title}
      iconURL={item.iconURL}
      isSelected={index === this.props.selectedIndex}
      onPress={() => this.props.onChoose(item, index)}
    />
  );

  render() {
    const { subCategories, style } = this.props;

    return (
      <FlatList
        data={subCategories}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        style={{
          ...style,
          width: subCategories.length === 0 ? 0 : style.width
        }}
      />
    );
  }
}

export default SubCategories;
