const baseURL = "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/"; //\(stage)/\(resource)

export const fetchStore = () => {
  const storeUrl = `${baseURL}library`;
  return fetch(storeUrl).then(response => {
    return response.json();
  });
};
