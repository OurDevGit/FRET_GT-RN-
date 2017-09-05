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
  renderItem = ({ item }) => (
    <CategoryItem
      id={item.id}
      title={item.title}
      onPress={() => this.props.onChoose(item)}
    />
  );

  render() {
    const { subCategories, style } = this.props;

    return (
      <FlatList
        data={subCategories}
        renderItem={this.renderItem}
        keyExtractor={extractKey}
        style={style}
      />
    );
  }
}

export default SubCategories;
