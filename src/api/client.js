import axios from 'axios';

// Single source of truth for the backend origin, per API_User_Guide_Full_Updated.pdf
const BASE_URL = 'https://backend-auth-gdiz.onrender.com/api';

const client = axios.create({
  baseURL: BASE_URL,
  // Render's free tier spins down an idle backend and can take 30-60s to
  // wake up on the first request after inactivity. A short default timeout
  // makes that cold start look like a generic failure, so we give it room.
  timeout: 60000,
});

// Attach the stored token to every outgoing request automatically.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('vaultline_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;
