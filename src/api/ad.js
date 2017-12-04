import { Platform } from "react-native";
const baseURL = "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/";

export const fetchAd = () => {
  const adUrl = `${baseURL}ad?adVendorCode=Optek&platform=${Platform.OS}`;
  console.debug(adUrl);
  return fetch(adUrl).then(response => {
    return response.json();
  });
};
