import React from "react";
import { TouchableOpacity } from "react-native";
import { BtnFavorite_isPressed } from "./styleKitComponents";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import { realmify } from "../../realm";
import { mapProps } from "recompose";

const SizeableFavorite = gtPcSizeable(BtnFavorite_isPressed);

const TouchableFavorite = props =>
  <TouchableOpacity
    onPress={() => {
      props.createFave(props.mediaId);
    }}
  >
    <SizeableFavorite
      style={{ width: 20, height: 20 }}
      size={{ width: 20, height: 20 }}
      isPressed={props.faves.length > 0}
      {...props}
    />
  </TouchableOpacity>;

const mapQueriesToProps = realm => ({
  faves: realm
    .objects("Favorite")
    .filtered("mediaId == $0", "GettingStartedWithGT")
});

const mapMutationsToProps = ({ create }) => ({
  // TODO: This should be a Toggle function (there's currently no way to un-fave something)
  createFave: mediaId => {
    console.log(`make fave for ${mediaId}`);
    create("Favorite", { mediaId });
  }
});

const Heart = realmify(mapQueriesToProps, mapMutationsToProps)(
  TouchableFavorite
);

export default Heart;
