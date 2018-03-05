const baseURL = "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/";

export const fetchConfig = () => {
  const url = `${baseURL}configuration?environment=production`;
  return fetch(url).then(response => {
    return response.json();
  });
};
