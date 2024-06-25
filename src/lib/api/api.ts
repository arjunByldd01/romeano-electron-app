import axios from 'axios';

// const envConfig = window.electron.envConfig;

const Headers = {
  'Content-Type': 'application/json',
};

// const apiUrl = "envConfig.ROMEANO_API_BASE_URL";
const apiUrl = 'https://app.romeano.com/api';

const apiClient = axios.create({
  baseURL: apiUrl,
  headers: {
    ...Headers,
  },
});

export { apiClient, apiUrl };
