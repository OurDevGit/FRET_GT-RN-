export const refreshStore = () => ({
  type: "REFRESH_STORE"
});

export const storeLoaded = payload => ({
  type: "STORE_LOADED",
  payload
});
