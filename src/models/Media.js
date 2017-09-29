import { getIsPurchased } from "./Purchases";

export const GetMediaButtonMode = {
  Purchase: "purchaseMode",
  ComingSoon: "comingSoonMode",
  Download: "downloadMode",
  Downloading: "downloadingMode",
  Indetermindate: "indeterminateMode",
  Play: "playMode"
};

export const getPurchaseDetails = mediaId => {
  const mediaIsPurchased = getIsPurchased(mediaId);

  return {
    mode: GetMediaButtonMode.Purchase,
    price: "LOADING"
  };
};
