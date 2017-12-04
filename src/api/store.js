import { Platform } from "react-native";
const baseURL = "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/";

export const fetchStore = () => {
  const storeUrl = `${baseURL}library?platform=${Platform.OS}`;
  return fetch(storeUrl).then(response => {
    return response.json();
  });
};
