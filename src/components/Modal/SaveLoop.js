import React, { Component } from "react";
import { Modal, Text, TextInput, TouchableHighlight, View } from "react-native";
import { PrimaryBlue } from "../../design";

const SaveLoop = ({ onTextChange, onCancel, onSave }) =>
  <View
    style={{
      width: 400,
      height: 230,
      marginTop: -300,
      borderRadius: 12,
      backgroundColor: "white"
    }}
  >
    <View style={{ flex: 1 }}>
      <Text
        style={{
          width: "100%",
          fontSize: 24,
          fontWeight: "800",
          textAlign: "center",
          marginTop: 15
        }}
      >
        Name Your Loop
      </Text>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "400",
          textAlign: "center",
          marginVertical: 10
        }}
      >
        Please enter a new name for loop
      </Text>

      <TextInput
        style={{
          fontSize: 22,
          fontWeight: "400",
          textAlign: "center"
        }}
        placeholder={"Loop name"}
        onChangeText={onTextChange}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          borderTopWidth: 1,
          borderTopColor: "#DDDDDD",
          height: 80
        }}
      >
        <TouchableHighlight
          style={{
            flex: 1,
            height: "100%",
            alignItems: "center",
            borderRightColor: "#DDDDDD",
            borderRightWidth: 1,
            borderBottomLeftRadius: 20
          }}
          underlayColor={"#EEEEEE"}
          onPress={() => {
            onCancel();
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "600",
              textAlign: "center",
              color: PrimaryBlue,
              height: "100%",
              textAlignVertical: "center"
            }}
          >
            Cancel
          </Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={{ flex: 1, borderBottomRightRadius: 20 }}
          underlayColor={"#EEEEEE"}
          onPress={() => {
            onSave();
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "200",
              textAlign: "center",
              color: PrimaryBlue,
              height: "100%",
              textAlignVertical: "center"
            }}
          >
            OK
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  </View>;

export default SaveLoop;
