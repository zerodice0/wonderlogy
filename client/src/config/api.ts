const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiConfig = {
  baseURL: API_URL,
  timeout: 10000,
};

export const getApiUrl = () => API_URL;

export const validateEnvironment = () => {
  const url = getApiUrl();
  console.log('🔧 Current API URL:', url);
  console.log('🌍 Environment:', import.meta.env.MODE);
  
  if (!url) {
    console.error('❌ API URL is not configured');
    return false;
  }
  
  try {
    new URL(url);
    console.log('✅ API URL is valid');
    return true;
  } catch {
    console.error('❌ Invalid API URL format:', url);
    return false;
  }
};