import axios from "axios";

const Headers = {
  "Content-Type": "application/json",
};

const apiUrl = "https://app.romeano.com/api";

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    ...Headers,
  },
});

export { apiClient, apiUrl };
