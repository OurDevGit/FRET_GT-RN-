// import { Platform } from "react-native";
const baseURL = "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/";

export const fetchChordsAndScalesData = (lastSync = 0) => {
  const url = `${baseURL}chords-scales/data?lastSync=${lastSync}`;
  console.debug(url);
  return fetch(url).then(response => {
    return response.json();
  });
};
