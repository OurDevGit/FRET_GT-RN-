import Mixpanel from "react-native-mixpanel";

// TODO
export const trackPurchase = (productId, Title, Price, Currency) => {
  let purchase = { "Product Id": productId, Title, Price, Currency };
  Mixpanel.trackWithProperties("Purchase Media", purchase);
};
