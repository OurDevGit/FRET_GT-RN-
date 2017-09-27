import InAppBilling from "react-native-billing";
import { keyBy, chunk } from "lodash";

var _openCount = 0;
var _billingIsOpen = false;
var _billingSubscribers = [];
var _productDetailsById = null;

const openBilling = async () => {
  // if billing is open, resolve right away
  if (_billingIsOpen === true) {
    console.debug("billing is already open");
    return Promise.resolve();
  } else {
    console.debug("waiting on billing to open");
    // create a promise for this caller to wait on
    const waiter = new Promise((resolve, reject) => {
      _billingSubscribers.push(resolve);
    });

    // if this is the first opener, open the billing channel
    _openCount++;
    if (_openCount === 1) {
      console.debug("opening billing channel now");
      await InAppBilling.open();
      _billingIsOpen = true; // subsequent calls get through right away
      console.debug("billing channel is now open");

      // call all the subscribed resolvers once the channel is open
      while (_billingSubscribers.length > 0) {
        console.debug("calling billing subscriber");
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
    console.debug("closing billing");
    await InAppBilling.close();
    _billingIsOpen = false;
    return;
  }
};

// const loadPurchases = () => {
//   console.debug("loadPurchases()");
//   this.openBilling().then(closeBilling => {
//     InAppBilling.loadOwnedPurchasesFromGoogle()
//       .then(() => InAppBilling.listOwnedProducts())
//       .then(listResults => {
//         const allPurchases = addPurchases(listResults);
//         Alert.alert("Purchased Items", JSON.stringify(allPurchases, null, 2));
//       })
//       .then(() => closeBilling())
//       .catch(err => {
//         console.error(err);
//         InAppBilling.close();
//       });
//   });
// };

export const getProductDetails = async mediaIds => {
  console.debug("getProductDetails()");
  // console.debug(mediaIds);

  // return the cached version
  if (_productDetailsById !== null) {
    console.debug("using cached product details");
    return _productDetailsById;
  }

  // break the mediaIds into chunks of 20. It's undocumented, but the Google's InAppBilling API can only take 20 at a time. Any more will result in errors.
  const mediaIdChunks = chunk(mediaIds, 20);
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

  // return the mapping
  return productDetailsById;
};

const normalizeProductDetails = details => {
  var byId = {};
  details.forEach(product => {
    byId[product.productId] = product;
  });

  return byId;

  // keyBy(details, "productId")
};

const getAllPrices = async () => {};

const getPrice = async mediaId => {};
