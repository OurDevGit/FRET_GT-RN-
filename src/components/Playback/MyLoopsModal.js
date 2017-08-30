import React, { Component } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { PrimaryBlue } from "../../design";

const keyExtractor = (item, index) => index;

const MyLoopsModal = ({
  isVisible,
  isEditing,
  loops,
  currentLoop,
  onToggleEditing,
  onCancel,
  onDelete,
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
          width: 500,
          height: 200,
          marginTop: -300,
          padding: 20,
          backgroundColor: "white"
        }}
      >
        <View style={{ flex: 1 }}>
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
              onCancel();
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                textAlign: "right"
              }}
            >
              {isEditing ? "Done" : "Edit"}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          keyExtractor={(item, index) => index}
          data={loops}
          renderItem={({ item, index }) =>
            <View>
              <Text>
                {item.name}
              </Text>
            </View>}
        />
      </View>
    </View>
  </Modal>;

export default MyLoopsModal;
