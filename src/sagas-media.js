import {
  getProductDetails,
  loadPurchases,
  makePurchase,
  getPurchasedTransactionDetails
} from "./models/Products";

const doPurchase = async media => {
  // console.debug(media);
  const mediaId = media.mediaID.toLowerCase();

  const purchaseSuccess = await makePurchase(mediaId);

  if (purchaseSuccess === true) {
    this.props.addPurchasedMedia(mediaId);
    console.debug(`added purchased ${mediaId}`);
  }
};

export const getTransactionDetails = async mediaId => {
  try {
    const transactionStatus = await getPurchasedTransactionDetails(mediaId);
    return transactionStatus;
  } catch (error) {
    return null;
  }
};

const downloadMedia = async media => {
  const mediaId = media.mediaID.toLowerCase();
  const files = this.props.downloadedMedia[mediaId];

  if (files === undefined) {
    const paths = await downloadSong(
      "http://guitar-tunes-open.s3.amazonaws.com/TEST_RICK/1979/song.m4a",
      "http://guitar-tunes-open.s3.amazonaws.com/TEST_RICK/1979/song.mid",
      media.mediaID
    );
    // console.debug(paths);
  } else {
    console.debug({ files });
  }
};
