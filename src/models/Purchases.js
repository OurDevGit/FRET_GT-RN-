import { makeStore } from "./StorageFactory";
import { union } from "lodash";

const Purchases = makeStore("Purchases");

const PURCHASED_MEDIA = "purchased";
const getPurchased = async () => {
  const purchased = await Purchases.getObj(PURCHASED_MEDIA);
  return purchased || [];
};

export const getIsPurchased = async mediaId => {
  const purchased = await getPurchased();
  return purchased.includes(mediaId);
};

export const getAllPurchased = async () => await getPurchased();

export const addPurchase = async mediaId => {
  const isAlreadyPurchased = await getIsPurchased(mediaId);
  if (isAlreadyPurchased) {
    return true;
  } else {
    const purchased = await getPurchased();
    await Purchases.setObj(PURCHASED_MEDIA, purchased.concat(mediaId));

    return true;
  }
};

export const addPurchases = async mediaIds => {
  const purchased = await getPurchased();
  const updatedPurchases = union(purchased, mediaIds);
  await Purchases.setObj(PURCHASED_MEDIA, updatedPurchases);

  return updatedPurchases;
};
