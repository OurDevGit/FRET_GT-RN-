import React from "react";
import { View, Text, Button } from "react-native";
import { v4 as uuid } from "uuid";

import realm, { realmify } from "../realm";

// Enable this to wipe Realm
// realm.write(() => {
//   realm.deleteAll();
// });

const mapQueriesToProps = realm => {
  return {
    categories: realm.objects("Category")
  };
};

const mapMutationsToProps = ({ create }) => {
  return {
    createCategory: title => {
      create("Category", { id: uuid(), title });
    }
  };
};

const Tester = ({ categories, createCategory, name }) =>
  <View>
    <Button
      onPress={() => {
        createCategory("some name");
      }}
      title="Make New Category"
    />
    <Text>
      {JSON.stringify(categories.length)} {name}
    </Text>
  </View>;
const TestText = realmify(mapQueriesToProps, mapMutationsToProps)(Tester);

const RealmTester = () =>
  <View>
    <Text>Test!</Text>
    <Text>Test!</Text>
    <Text>Test!</Text>
    <TestText name="Rick" />
  </View>;

export default RealmTester;
