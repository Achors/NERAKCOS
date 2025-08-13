const API_BASE_URL = 'http://localhost:5000/api/';

export const api = {
  contact: {
    submit: () => `${API_BASE_URL}contact`,
  },
  auth: {
    register: () => `${API_BASE_URL}register`,
    login: () => `${API_BASE_URL}login`,
    resetPassword: () => `${API_BASE_URL}reset-password`,
  },
  profile: {
    get: (userId) => `${API_BASE_URL}profile?user_id=${userId}`,
    update: (userId) => `${API_BASE_URL}profile?user_id=${userId}`,
  },
  products: {
    list: () => `${API_BASE_URL}products`,
    create: () => `${API_BASE_URL}products`,
  },
  categories: {
    list: () => `${API_BASE_URL}categories`,
    create: () => `${API_BASE_URL}categories`,
  },
  orders: {
    list: () => `${API_BASE_URL}orders`,
    create: () => `${API_BASE_URL}orders`,
    update: (orderId) => `${API_BASE_URL}orders/${orderId}`,
  },
  collaborate: {
    submit: () => `${API_BASE_URL}collaborate`,
    list: () => `${API_BASE_URL}contact-message`,
  },
  blog: {
    list: () => `${API_BASE_URL}blog`,
    create: () => `${API_BASE_URL}blog`,
    update: (id) => `${API_BASE_URL}blog/${id}`,
    delete: (id) => `${API_BASE_URL}blog/${id}`,
  },
};

export const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem('jwt_token'); 
  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : '',
  };
  // Only set Content-Type to application/json if not overridden (e.g., for form-data)
  if (!options.headers || !options.headers['Content-Type']) {
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