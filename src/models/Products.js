import InAppBilling from "react-native-billing";
import { keyBy, chunk } from "lodash";

var _openCount = 0;
var _billingIsOpen = false;
var _billingSubscribers = [];
var _productDetailsById = null;

const openBilling = async () => {
  // if billing is open, resolve right away
  if (_billingIsOpen === true) {
    // console.debug("billing is already open");
    return Promise.resolve();
  } else {
    // create a promise for this caller to wait on
    const waiter = new Promise((resolve, reject) => {
      _billingSubscribers.push(resolve);
    });

    // if this is the first opener, open the billing channel
    _openCount++;
    if (_openCount === 1) {
      await InAppBilling.open();
      _billingIsOpen = true; // subsequent calls get through right away

      // call all the subscribed resolvers once the channel is open
      while (_billingSubscribers.length > 0) {
        const subscriber = _billingSubscribers.pop();
        subscriber();
      }
    }

    // increment the wait count and return the waiter Promise
    return waiter;
  }
};

const closeBilling = async () => {
  _openCount--;

  if (_openCount === 0) {
    await InAppBilling.close();
    _billingIsOpen = false;
    return;
  }
};

export const loadPurchases = async () => {
  // console.debug("loadPurchases()");

  await openBilling();

  await InAppBilling.loadOwnedPurchasesFromGoogle();
  const ownedProducts = await InAppBilling.listOwnedProducts();
  // const allPurchases = addPurchases(ownedProducts);

  await closeBilling();

  return ownedProducts;
};

export const getProductDetails = async mediaIds => {
  // console.debug("getProductDetails()");
  // console.debug(mediaIds);

  // return the cached version
  if (_productDetailsById !== null) {
    console.debug("using cached product details");
    return _productDetailsById;
  }

  // break the mediaIds into chunks of 20. It's undocumented, but the Google's InAppBilling API can only take 20 at a time. Any more will result in errors.
  const lowercased = mediaIds.map(m => m.toLowerCase()); // Google Product Id's are always lower case
  const mediaIdChunks = chunk(lowercased, 20);
  let productDetails = [];

  // open the billing channel
  await openBilling();

  // get each chunk
  while (mediaIdChunks.length > 0) {
    const chunk = mediaIdChunks.shift();
    try {
      const results = await InAppBilling.getProductDetailsArray(chunk);
      productDetails.push(...results);
    } catch (error) {}
  }

  console.debug(`got ${productDetails.length} total product details`);

  // close the billing channel
  await closeBilling();

  // create an id-based mapping of the product details and cache it
  const productDetailsById = normalizeProductDetails(productDetails);
  _productDetailsById = productDetailsById;

  // console.debug(productDetailsById);

  // return the mapping
  return productDetailsById;
};

export const getPurchasedTransactionDetails = async mediaId => {
  await openBilling();
  const transactionStatus = await InAppBilling.getPurchaseTransactionDetails(
    mediaId
  );
  await closeBilling();

  return transactionStatus;
};

export const makePurchase = async mediaId => {
  await openBilling();

  var success = false;
  try {
    const safeMediaId = mediaId.toLowerCase();
    const testId = "android.test.purchased";
    const purchaseDetails = await InAppBilling.purchase(safeMediaId);
    const transactionStatus = await InAppBilling.getPurchaseTransactionDetails(
      mediaId
    );

    console.debug({ transactionStatus });

    success = true;
  } catch (error) {
    console.debug("got error when purchasing:");
    console.debug(error);

    success = false;
  }

  await closeBilling();

  return success;
};

const normalizeProductDetails = details => {
  var byId = {};
  details.forEach(product => {
    byId[product.productId] = product;
  });

  return byId;

  // keyBy(details, "productId")
};
