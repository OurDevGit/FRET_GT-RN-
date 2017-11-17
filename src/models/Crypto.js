import { makeStore } from "./StorageFactory";
import { guid } from "../utils";

const Crypto = makeStore("Crypto");

export const getSalt = async () => {
  const salt = await Crypto.getObj("salt");
  if (salt === null) {
    const newSalt = guid();
    await Crypto.setObj("salt", newSalt);
    return newSalt;
  } else {
    return salt;
  }
};
