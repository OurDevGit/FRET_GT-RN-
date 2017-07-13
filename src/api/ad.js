const baseURL = "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/"; //\(stage)/\(resource)

export const fetchAd = () => {
  const adUrl = `${baseURL}ad?adVendorCode=Optek`;
  return fetch(adUrl).then(response => {
    return response.json();
  });
};
