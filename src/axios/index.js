import axios from "axios";

const service = axios.create({
  timeout: 1000 * 60 * 5, // 超时时间-120秒
  headers: {},
});

service.interceptors.response.use(
  (response) => {
    const {
      headers = {},
      data: { code, message, result },
    } = response;

    return response.data;
  },
  (error) => {
    const {
      status,
      config: { url },
    } = error.response;

    return Promise.reject(error);
  }
);

export function setTokenForAxios(token) {
  service.defaults.headers.Authorization = `Bearer ${token}`;
}

export default service;
