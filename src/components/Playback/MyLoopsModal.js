import React, { Component } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { PrimaryBlue } from "../../design";
import { BtnLoopDelete } from "../StyleKit";

const keyExtractor = (item, index) => index;

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

const MyLoopsModal = ({
  isVisible,
  isEditing,
  loops,
  currentLoop,
  onToggleEditing,
  onCancel,
  onDelete,
  onClear,
  onSelect
}) =>
  <Modal
    animationType={"fade"}
    transparent={true}
    visible={isVisible}
    onRequestClose={() => {
      onCancel();
    }}
  >
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
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
          onCancel();
        }}
      />

      <View
        style={{
          width: "50%",
          height: "50%",
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
            My Loops
          </Text>

          <TouchableOpacity
            style={{ flex: -1 }}
            onPress={() => {
              onToggleEditing();
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "400",
                textAlign: "right"
              }}
            >
              {isEditing ? "Done" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          keyExtractor={(item, index) => index}
          data={[...loops, { name: "None" }]}
          ItemSeparatorComponent={separator}
          renderItem={({ item, index }) =>
            <View style={{ width: "100%", height: 44, flexDirection: "row" }}>
              {isEditing &&
                item.name !== "None" &&
                <BtnLoopDelete
                  style={{ width: 40, height: 40, marginHorizontal: 10 }}
                  color={"#B20000"}
                  onPress={() => {
                    onDelete(item);
                  }}
                />}

              {currentLoop.name === item.name &&
                item.name !== "None" &&
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "400",
                    paddingHorizontal: 10,
                    color: PrimaryBlue
                  }}
                >
                  ✓
                </Text>}

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  item.name === "None" ? onClear() : onSelect(item);
                }}
              >
                <Text style={{ fontSize: 18 }}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            </View>}
        />
      </View>
    </View>
  </Modal>;

export default MyLoopsModal;
