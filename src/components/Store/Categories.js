import React from "react";
import { FlatList } from "react-native";
import { StoreLight, StoreDark, BorderColor } from "../../design";
import LargeButton from "./LargeButton";

const extractKey = item => item.id;

class Categories extends React.PureComponent {
  renderItem = ({ item, index }) => {
    // console.debug({ index });
    return (
      <LargeButton
        id={item.id}
        title={item.title}
        iconURL={item.iconURL}
        isSelected={index === this.props.selectedIndex}
        onPress={() => this.props.onChoose(item, index)}
        color={StoreDark}
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
        style={{ ...style, backgroundColor: StoreLight }}
      />
    );
  }
}

export default Categories;
