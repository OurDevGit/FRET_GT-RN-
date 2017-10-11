import {
  getProductDetails,
  loadPurchases,
  makePurchase,
  getPurchasedTransactionDetails
} from "./models/Products";
import { fetchMediaLinks } from "./api";

import { downloadSong } from "./DownloadManager";

export const doPurchase = async mediaId => {
  const purchaseSuccess = await makePurchase(mediaId);
  return purchaseSuccess;
};

export const getTransactionDetails = async mediaId => {
  try {
    const transactionStatus = await getPurchasedTransactionDetails(mediaId);
    return transactionStatus;
  } catch (error) {
    return null;
  }
};

export const downloadMedia = async (media, transactionDetails) => {
  // const mediaId = media.mediaID.toLowerCase();

  const links = await fetchMediaLinks(media.mediaID, transactionDetails);
  console.debug(`got links!`);
  console.debug(links);

  const paths = await downloadSong(links, media.mediaID);
  return paths;
  // console.debug(paths);
};
