import axios from "axios";

// For Android emulator use 10.0.2.2 instead of localhost.
const baseURL = "http://10.0.2.2:5000/api";

export const api = axios.create({ baseURL });

export function setToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
