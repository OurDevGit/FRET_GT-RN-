import React from "react";
import PropTypes from "prop-types";
import { View, Text, TouchableOpacity } from "react-native";
import { PrimaryBlue } from "../../design";
import { BtnPhoneBluetooth } from "../StyleKit";

const BtnFretlightAdmin = ({ isPhone, guitars, onPress }) => (
  <TouchableOpacity
    style={{
      flex: -1,
      flexDirection: "row",
      marginHorizontal: 6,
      paddingTop: 0,
      paddingRight: 8,
      paddingHorizontal: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: PrimaryBlue,
      borderRadius: 6
    }}
    onPress={onPress}
  >
    {isPhone ? (
      <BtnPhoneBluetooth style={{ width: 36, height: 36 }} color={"#FFFFFF"} />
    ) : (
      <Text
        style={{
          marginTop: -4,
          marginLeft: 8,
          fontSize: 20,
          color: "white",
          lineHeight: 22
        }}
      >
        Fretlight Status
      </Text>
    )}
    <Text
      style={{
        marginTop: -4,
        fontSize: 20,
        color: "white",
        lineHeight: 22
      }}
    >
      ({guitars})
    </Text>
  </TouchableOpacity>
);

BtnFretlightAdmin.propTypes = {
  isPhone: PropTypes.bool.isRequired,
  guitars: PropTypes.number.isRequired
};

export default BtnFretlightAdmin;
