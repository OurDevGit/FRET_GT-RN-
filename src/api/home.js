import { Platform } from "react-native";
const baseURL = "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/"; //\(stage)/\(resource)

export const fetchHome = (lastSync = 0) => {
  const url = `${baseURL}home?lastSync=${lastSync}&platform=${Platform.OS}`;
  return fetch(url).then(response => {
    return response.json();
  });
};
