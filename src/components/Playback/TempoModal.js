import React, { Component } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { PrimaryBlue } from "../../design";
import { BtnLoopDelete } from "../StyleKit";

const tempos = [
  1.25,
  1.2,
  1.115,
  1.1,
  1.05,
  1.0,
  0.95,
  0.9,
  0.85,
  0.8,
  0.75,
  0.7,
  0.65,
  0.6,
  0.55,
  0.5,
  0.45,
  0.4,
  0.35,
  0.1
];

const separator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#DDDDDD"
      }}
    />
  );
};

const TempoModal = ({
  isVisible,
  currentTempo,
  sourceFrame,
  onDismiss,
  onSelect
}) =>
  <Modal
    animationType={"fade"}
    transparent={true}
    visible={isVisible}
    onRequestClose={() => {
      onDismiss();
    }}
  >
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }}
    >
      <TouchableOpacity
        style={{
          position: "absolute",
          width: "100%",
          height: "100%"
        }}
        onPress={() => {
          onDismiss();
        }}
      />

      <View
        style={{
          position: "absolute",
          top: Math.max(100, sourceFrame.y - 380),
          left: sourceFrame.x + sourceFrame.width + 10,
          width: 180,
          height: 400,
          padding: 20,
          backgroundColor: "white"
        }}
      >
        <View style={{ flex: -1, marginBottom: 20, flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              fontSize: 22,
              fontWeight: "800"
            }}
          >
            Tempo
          </Text>
        </View>

        <FlatList
          keyExtractor={(item, index) => index}
          data={tempos}
          ItemSeparatorComponent={separator}
          renderItem={({ item, index }) =>
            <View style={{ width: "100%", height: 40, flexDirection: "row" }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  onSelect(item > 0.1 ? item : 0);
                }}
              >
                {item > 0.1
                  ? <Text
                      style={{
                        height: "100%",
                        textAlignVertical: "center",
                        fontSize: 18
                      }}
                    >
                      {`${parseInt(item * 100)}%`}
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
                          fontSize: 18
                        }}
                      >
                        NOTE
                      </Text>
                      <Text
                        style={{
                          height: "100%",
                          textAlignVertical: "center",
                          fontSize: 18
                        }}
                      >
                        Step™
                      </Text>
                    </View>}
              </TouchableOpacity>
            </View>}
        />
      </View>
    </View>
  </Modal>;

export default TempoModal;
