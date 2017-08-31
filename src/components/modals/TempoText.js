import React, { Component } from "react";
import { Text, View } from "react-native";

export default (TempoText = ({ color, tempo, withTitle }) =>
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
          marginHorizontal: 2,
          color: color
        }}
      >
        Tempo:
      </Text>}
    {tempo > 0
      ? <Text
          style={{
            height: "100%",
            textAlignVertical: "center",
            fontSize: 20,
            color: color
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
              fontSize: 20,
              color: color
            }}
          >
            NOTE
          </Text>
          <Text
            style={{
              height: "100%",
              textAlignVertical: "center",
              fontSize: 20,
              color: color
            }}
          >
            Step™
          </Text>
        </View>}
  </View>);
