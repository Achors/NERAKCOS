

const config = {
  development: {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/',
  },
  production: {
    API_BASE_URL: import.meta.env.VITE_API_URL || 'https://nerakcos-1.onrender.com/api/',
  },
};

// Detect environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate config
export const API_CONFIG = config[environment];


// API_CONFIG.API_BASE_URL in the api object
export const api = {
  contact: { submit: () => `${API_CONFIG.API_BASE_URL}contact` },
  auth: {
    register: () => `${API_CONFIG.API_BASE_URL}register`,
    login: () => `${API_CONFIG.API_BASE_URL}login`,
    resetPassword: () => `${API_CONFIG.API_BASE_URL}reset-password`,
  },
  profile: {
    get: (userId) => `${API_CONFIG.API_BASE_URL}profile?user_id=${userId}`,
    update: (userId) => `${API_CONFIG.API_BASE_URL}profile?user_id=${userId}`,
  },
  products: {
    list: () => `${API_CONFIG.API_BASE_URL}products`,
    create: () => `${API_CONFIG.API_BASE_URL}products`,
    update: (id) => `${API_CONFIG.API_BASE_URL}products/${id}`,
    delete: (id) => `${API_CONFIG.API_BASE_URL}products/${id}`,
  },
  categories: {
    list: () => `${API_CONFIG.API_BASE_URL}categories`,
    create: () => `${API_CONFIG.API_BASE_URL}categories`,
  },
  orders: {
    list: () => `${API_CONFIG.API_BASE_URL}orders`,
    create: () => `${API_CONFIG.API_BASE_URL}orders`,
    update: (orderId) => `${API_CONFIG.API_BASE_URL}orders/${orderId}`,
  },
  collaborate: {
    submit: () => `${API_CONFIG.API_BASE_URL}collaborate`,
    list: () => `${API_CONFIG.API_BASE_URL}contact-message`,
  },
  blog: {
    list: () => `${API_CONFIG.API_BASE_URL}blog`,
    create: () => `${API_CONFIG.API_BASE_URL}blog`,
    update: (id) => `${API_CONFIG.API_BASE_URL}blog/${id}`,
    delete: (id) => `${API_CONFIG.API_BASE_URL}blog/${id}`,
    upload: () => `${API_CONFIG.API_BASE_URL}blog/upload`,
  },
};

export const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem('jwt_token');
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };

  // Remove Content-Type if FormData is present, let browser set multipart/form-data
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  } else if (!options.headers || !options.headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Request failed');
  return data;
};