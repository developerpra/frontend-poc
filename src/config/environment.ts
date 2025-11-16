export const ENV = import.meta.env.MODE;

export const API_BASE_URLS: Record<string, string> = {
  development: "https://jsonplaceholder.typicode.com",
  uat: "https://jsonplaceholder.typicode.com",
  staging: "https://jsonplaceholder.typicode.com",
  production: "https://jsonplaceholder.typicode.com",
};

export const BASE_URL = API_BASE_URLS[ENV];
