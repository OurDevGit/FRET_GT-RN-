import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const extractKey = item => item.id;

class CategoryItem extends React.PureComponent {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View
          style={{
            backgroundColor: "#dae3ed",
            height: 88,
            borderBottomColor: "#ccc",
            borderBottomWidth: 1,
            alignItems: "flex-end",
            flexDirection: "row"
          }}
        >
          <Text
            style={{
              fontSize: 14,
              width: "100%",
              textAlign: "center",
              color: "black"
            }}
          >
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

class Categories extends React.PureComponent {
  renderItem = ({ item }) => (
    <CategoryItem
      id={item.id}
      title={item.title}
      onPress={() => this.props.onChoose(item)}
    />
  );

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
