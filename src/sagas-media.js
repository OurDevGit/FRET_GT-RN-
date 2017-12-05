import {
  makePurchase,
  getPurchasedTransactionDetails
} from "./models/Products";
import { fetchMediaLinks } from "./api";

import { downloadMediaFiles } from "./DownloadManager";

export const doPurchase = async media => {
  const purchaseResult = await makePurchase(media.mediaID);
  return purchaseResult;
};

export const fetchTransactionDetails = async mediaId => {
  try {
    const transactionStatus = await getPurchasedTransactionDetails(mediaId);
    return transactionStatus;
  } catch (error) {
    return null;
  }
};

export const downloadMedia = async (media, transactionDetails) => {
  const links = await fetchMediaLinks(media.mediaID, transactionDetails);
  // console.debug(`got links!`);
  // console.debug(links);

  if (links.errorMessage !== undefined) {
    throw new Error(links.errorMessage);
  } else {
    const paths = await downloadMediaFiles(links, media.mediaID);
    return paths;
  }
};

export const deleteMedia = async mediaId => {};
