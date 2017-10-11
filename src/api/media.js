const baseURL = "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/STAGE/"; //\(stage)/\(resource)

export const fetchMediaLinks = (mediaId, transactionDetails) => {
  const url = `${baseURL}media/access/android`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify({
      mediaId,
      transactionDetails
    })
  }).then(response => {
    return response.json();
  });
};
