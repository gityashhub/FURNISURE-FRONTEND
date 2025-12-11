import axios from 'axios';

// Define the base URL for your API
// const API_URL = 'http://localhost:5000/api'; // Update this with your actual API URL
const API_URL = import.meta.env.VITE_BACKENDURL;
// const API_URL = 'http://192.168.83.219:5000/api'; // Update this with your actual API URL
// const API_URL = 'https://furnisure-backend.onrender.com/api'; // Update this with your actual API URL

if (!API_URL) {
  console.warn("⚠️ BACKENDURL is not defined in environment variables");
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to make authenticated requests with Clerk token
// Pass getToken from useAuth() and use as shown belowimport api from "./api";

// Define the method and type safety
export const authApiRequest = async (
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  url: string,
  getToken: () => Promise<string | null>,
  data: any = null,
  config: Record<string, any> = {}
) => {
  const token = await getToken();

  if (!token) {
    console.warn(`⚠️ authApiRequest skipped — token is not available for: ${url}`);
    throw new Error("Authentication token not available");
  }

  const finalConfig = {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
  const requestConfig = {
    method,
    url,
    ...finalConfig,
    ...(data != null ? { data } : {}), // ✅ Only include `data` if it's not null/undefined
  };
  
  return api.request(requestConfig);
  
};


// Example usage in a React component:
// const { getToken } = useAuth();
// await authApiRequest('get', '/products', getToken);

export default api; 