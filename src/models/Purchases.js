// @flow

import { makeStore } from "./StorageFactory";
import { union } from "lodash";

const Purchases = makeStore("Purchases");

const PURCHASED_MEDIA = "purchased";

export const loadPurchased = async () => {
  const purchased = await Purchases.getObj(PURCHASED_MEDIA);
  return purchased || [];
};

export const getIsPurchased = async (mediaId: string) => {
  const purchased = await loadPurchased();
  return purchased.includes(mediaId);
};

export const setPurchased = async (mediaIds: string[]) =>
  await Purchases.setObj(PURCHASED_MEDIA, mediaIds);

export const addPurchase = async (mediaId: string) => {
  await addPurchases([mediaId.toLowerCase()]);
};

export const addPurchases = async (mediaIds: string[]) => {
  const purchased = await loadPurchased();
  const updatedPurchases = union(purchased, mediaIds);
  await Purchases.setObj(PURCHASED_MEDIA, updatedPurchases);

  return updatedPurchases;
};
