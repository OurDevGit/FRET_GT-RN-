import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const extractKey = item => item.id;

class CategoryItem extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View
          style={{
            backgroundColor: "#ddd",
            width: 50,
            height: 50,
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

class Categories extends React.PureComponent {
  renderItem = ({ item }) =>
    <CategoryItem
      id={item.id}
      title={item.title}
      onPress={() => this.props.onChoose(item)}
    />;

  render() {
    const { categories, style } = this.props;

    return (
      <FlatList
        data={categories}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        style={{ width: style.width }}
      />
    );
  }
}

export default Categories;
