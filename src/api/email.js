const baseURL = "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/"; //\(stage)/\(resource)

export const registerEmail = email => {
  const url = `${baseURL}user/register?email=${email}&type=updates`;
  return fetch(url).then(response => {
    return response.json();
  });
};

export const registerContestEmail = email => {
  const url = `${baseURL}user/register?email=${email}&type=contest`;
  return fetch(url).then(response => {
    return response.json();
  });
};
