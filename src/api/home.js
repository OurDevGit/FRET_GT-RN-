const baseURL =
  "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/home";

export const fetchHome = (environment, device, level, lastSync = 0) => {
  const url = `${baseURL}?lastSync=${lastSync}&platform=android&environment=${environment}&device=${device}&level=${level}`;
  return fetch(url).then(response => {
    return response.json();
  });
};
