import {
  loadPurchases,
  makePurchase,
  getPurchasedTransactionDetails
} from "./models/Products";
import { fetchMediaLinks } from "./api";

import { downloadMediaFiles } from "./DownloadManager";

export const doPurchase = async media => {
  const purchaseSuccess = await makePurchase(media.mediaID);
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
  // const mediaId = media.mediaID;

  const links = await fetchMediaLinks(media.mediaID, transactionDetails);
  // console.debug(`got links!`);
  // console.debug(links);

  const paths = await downloadMediaFiles(links, media.mediaID);
  return paths;
  // console.debug(paths);
};
