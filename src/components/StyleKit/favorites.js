import React from "react";
import { TouchableOpacity } from "react-native";
import { gtPcPressable, gtPcColorable, gtPcSizeable } from "./lib";
import { BtnFavorite_isPressed } from "./styleKitComponents";
import {
  ResizingBehavior,
  SizePropType,
  ResizingBehaviorPropType
} from "./lib";

import { realmify } from "../../realm";

const TouchableFavorite = props => {
  const Comp = gtPcSizeable(BtnFavorite_isPressed);

  return (
    <TouchableOpacity
      onPress={() => {
        const faves = props.faves === undefined ? {} : props.faves;
        if (faves.length > 0) {
          props.deleteFavorite(faves[0]);
        } else {
          props.createFavorite(props.mediaId);
        }
      }}
    >
      <Comp
        {...props}
        resizing={ResizingBehavior.AspectFit}
        isPressed={props.faves === undefined ? false : props.faves.length > 0}
      />
    </TouchableOpacity>
  );
};

const mapQueriesToProps = (realm, ownProps) => ({
  faves: realm.objects("Favorite").filtered("mediaId == $0", ownProps.mediaId)
});

const mapMutationsToProps = ({ create, destroy }) => ({
  createFavorite: mediaId => {
    create("Favorite", { mediaId });
  },
  deleteFavorite: favorite => {
    destroy(favorite);
  }
});

export const BtnHeart = realmify(mapQueriesToProps, mapMutationsToProps)(
  TouchableFavorite
);
