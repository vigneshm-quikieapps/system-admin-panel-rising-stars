import axios from "axios";

import { baseURL } from "../helper/config";

const axiosInstance = axios.create({
  baseURL,
  ///
  // withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    config.headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    return config;
  },
  function (error) {
    console.error(error);
    // Do something with request error
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error(error);
    if (error.response.status === 401) {
      if (error.config.url === "refresh-token") {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }
      axiosInstance
        .post("refresh-token")
        .then((response) => {
          const accessToken = response.data.accessToken;
          localStorage.setItem("accessToken", accessToken);
          const { config } = error;
          config.headers = { Authorization: `Bearer ${accessToken}` };
          ///
          // config.withCredentials = true;
          return new Promise((resolve) => resolve(axios(config)));
        })
        .catch((error) => {
          console.error("[refresh-token]", error);
          return Promise.reject(error);
        });
    } else {
      // Do something with response error
      return Promise.reject(error);
    }
  },
);

export default axiosInstance;
