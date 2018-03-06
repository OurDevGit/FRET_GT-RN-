const baseURL = "https://h59y6nr7la.execute-api.us-east-1.amazonaws.com/PROD/"; //\(stage)/\(resource)

export const registerEmail = email => {
  const url = `${baseURL}user/register?email=${email}&listId=1362267580`;
  return fetch(url).then(response => {
    return response.json();
  });
};

export const registerContestEmail = email => {
  const url = `${baseURL}user/register?email=${email}&listId=1095395097`;
  return fetch(url).then(response => {
    return response.json();
  });
};
