const explicitApiUrl = import.meta.env.VITE_API_URL;

// Get the current mode (development, production, local, etc.)
const ENV = import.meta.env.MODE;

// Define API base URLs for each environment
export const API_BASE_URLS: Record<string, string> = {
  system: "https://localhost:54805/api/v1",
  development: "https://azapptest.camincargo.com/CaminPolarisMaintenance/api/v1",
  uat: "https://azapptest.camincargo.com/CaminPolarisMaintenance/api/v1",
  staging: "https://azapptest.camincargo.com/CaminPolarisMaintenance/api/v1",
  production: "https://azapptest.camincargo.com/CaminPolarisMaintenance/api/v1",
};

// Priority: 1. Explicit VITE_API_URL, 2. Mode-based URL, 3. Fallback to development
export const BASE_URL = explicitApiUrl || API_BASE_URLS[ENV] || API_BASE_URLS.development;

// Log for debugging (remove in production if needed)
if (import.meta.env.DEV) {
  console.log('🌍 Environment:', ENV);
  console.log('🔗 API Base URL:', BASE_URL);
  console.log('📝 Explicit API URL:', explicitApiUrl || 'Not set');
}
