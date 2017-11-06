import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Dimensions from "Dimensions";
import PropTypes from "prop-types";
import { GuitarConnectedIcon } from "../StyleKit";
import NameModal from "./NameModal";
import TrackModal from "./TrackModal";
import { guitarRowStyles } from "./styles";

const GuitarRow = ({
  index,
  guitar,
  guitars,
  tracks,
  isPhone,
  onRename,
  onAssignTrack,
  onLeft,
  onBass,
  onToggleScanning
}) => {
  var guitarID = guitar.id.replace("Fretlight Guitar - ", "");
  guitarID = guitarID.replace("IVT DATA - ", "");
  return (
    <View style={guitarRowStyles.container}>
      <GuitarConnectedIcon style={guitarRowStyles.icon} />
      <Text style={guitarRowStyles.guitarNumber}>{index + 1}</Text>

      <View style={guitarRowStyles.descriptionContainer}>
        <View style={guitarRowStyles.description}>
          <NameModal
            guitar={guitar}
            guitars={guitars}
            isPhone={isPhone}
            onRename={onRename}
            onToggleScanning={onToggleScanning}
          />
          <Text style={guitarRowStyles.id}>{`ID: ${guitarID}`}</Text>

          {tracks.length > 0 ? (
            <TrackModal
              guitar={guitar}
              tracks={tracks}
              isPhone={isPhone}
              onAssignTrack={onAssignTrack}
            />
          ) : (
            <Text style={guitarRowStyles.noTracksButton}>
              No parts to assign
            </Text>
          )}
        </View>
      </View>

      <View style={guitarRowStyles.settings}>
        <TouchableOpacity
          style={guitarRowStyles.settingsButton}
          onPress={() => {
            onLeft(guitar);
          }}
        >
          <Text
            style={
              guitar.isLeft
                ? guitarRowStyles.settingsButtonTextOn
                : guitarRowStyles.settingsButtonTextOff
            }
          >
            ✔︎ Lefty
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={guitarRowStyles.settingsButton}
          onPress={() => {
            onBass(guitar);
          }}
        >
          <Text
            style={
              guitar.isBass
                ? guitarRowStyles.settingsButtonTextOn
                : guitarRowStyles.settingsButtonTextOff
            }
          >
            ✔︎ Bass
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GuitarRow;
