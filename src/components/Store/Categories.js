import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import {
  CategorySelectedColor,
  CategoryUnselectedColor,
  BorderColor
} from "../../design";

const extractKey = item => item.id;

const CategoryItem = ({ isSelected, iconURL, title, onPress }) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={{
        backgroundColor: isSelected
          ? CategorySelectedColor
          : CategoryUnselectedColor,
        height: 88,
        borderBottomColor: BorderColor,
        borderBottomWidth: 1
      }}
    >
      <View
        style={{
          flex: 1,
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image source={{ uri: iconURL }} style={{ height: 30, width: 30 }} />
      </View>
      <Text
        style={{
          fontSize: 14,
          width: "100%",
          textAlign: "center",
          color: isSelected ? "white" : "black"
        }}
      >
        {title}
      </Text>
    </View>
  </TouchableOpacity>
);

class Categories extends React.PureComponent {
  renderItem = ({ item, index }) => {
    // console.debug({ rest });
    return (
      <CategoryItem
        id={item.id}
        title={item.title}
        iconURL={item.iconURL}
        isSelected={index === this.props.selectedIndex}
        onPress={() => this.props.onChoose(item, index)}
      />
    );
  };

  render() {
    const { categories, style } = this.props;
    return (
      <FlatList
        data={categories}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        style={style}
      />
    );
  }
}

export default Categories;
