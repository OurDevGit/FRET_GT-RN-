import React from "react";
import { View, Text, Button } from "react-native";

import realm, { realmify } from "../realm";

var i = 16;

const mapQueriesToProps = realm => {
  console.log("mapping queries to props!");
  return {
    categories: realm.objects("Category")
  };
};

const Tester = ({ categories, name }) =>
  <Text>
    {JSON.stringify(categories.length)} {name}
  </Text>;
const TestText = realmify(mapQueriesToProps)(Tester);

const RealmTester = () =>
  <View>
    <Text>Test!</Text>
    <Text>Test!</Text>
    <Text>Test!</Text>
    <Button
      onPress={() => {
        try {
          realm.write(() => {
            realm.create("Category", {
              id: `cat${i++}`
            });
          });
        } catch (err) {
          console.error(err);
        }
      }}
      title="Make Test Category"
    />
    <TestText name="Rick" />
  </View>;

export default RealmTester;
