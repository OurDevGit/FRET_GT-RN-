import { Platform } from "react-native";
const baseURL =
  "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/home";

export const fetchHome = (environment, device, level, lastSync = 0) => {
  const url = `${baseURL}?lastSync=${lastSync}&environment=${environment}&device=${device}&level=${level}&platform=${
    Platform.OS
  }`;
  return fetch(url).then(response => {
    return response.json();
  });
};
