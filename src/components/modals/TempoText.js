import React, { Component } from "react";
import { Text, View } from "react-native";

export default (TempoText = ({ tempo, withTitle }) =>
  <View
    style={{
      height: "100%",
      flexDirection: "row"
    }}
  >
    {withTitle &&
      <Text
        style={{
          height: "100%",
          textAlignVertical: "center",
          fontSize: 20,
          marginHorizontal: 2
        }}
      >
        Tempo:
      </Text>}
    {tempo > 0
      ? <Text
          style={{
            height: "100%",
            textAlignVertical: "center",
            fontSize: 20
          }}
        >
          {`${parseInt(tempo * 100)}%`}
        </Text>
      : <View
          style={{
            height: "100%",
            flexDirection: "row"
          }}
        >
          <Text
            style={{
              height: "100%",
              textAlignVertical: "center",
              fontWeight: "800",
              fontSize: 20
            }}
          >
            NOTE
          </Text>
          <Text
            style={{
              height: "100%",
              textAlignVertical: "center",
              fontSize: 20
            }}
          >
            Step™
          </Text>
        </View>}
  </View>);
