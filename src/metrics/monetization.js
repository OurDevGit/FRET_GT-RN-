import Mixpanel from "react-native-mixpanel";

export const trackPurchase = (productId, title, price) => {
  let purchase = { "Product Id": productId, Title: title, Price: price };
  // TODO: Price Locale, Localized Price, Finished in Background
  Mixpanel.trackWithProperites("Purchase Media", purchase);
};
