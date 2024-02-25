import axios, { type AxiosInstance } from "axios";

const apiClient: AxiosInstance = axios.create({
  // baseURL: "https://5c8bf44c-a1d1-443e-a80c-d2d80b34aa68.mock.pstmn.io",
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-type": "application/json"
  },
});

export default apiClient;
