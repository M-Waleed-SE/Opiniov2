/**
 * Centralized API Configuration
 * All API endpoints and base URLs are defined here for easier maintenance
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    CHECK_AUTH: `${API_BASE_URL}/api/auth/check`,
  },

  // Article endpoints
  ARTICLES: {
    GET_ALL: `${API_BASE_URL}/api/articles`,
    GET_ONE: (id) => `${API_BASE_URL}/api/articles/${id}`,
    CREATE: `${API_BASE_URL}/api/articles`,
    UPDATE: (id) => `${API_BASE_URL}/api/articles/${id}`,
    DELETE: (id) => `${API_BASE_URL}/api/articles/${id}`,
    GET_BY_CATEGORY: (category) => `${API_BASE_URL}/api/articles/category/${category}`,
    FEATURED: `${API_BASE_URL}/api/featured-posts`,
    SEARCH: (query) => `${API_BASE_URL}/api/articles/search?q=${encodeURIComponent(query)}`,
  },

  // User endpoints
  USERS: {
    GET_PROFILE: (userId) => `${API_BASE_URL}/api/users/${userId}`,
    UPDATE_PROFILE: (userId) => `${API_BASE_URL}/api/users/${userId}`,
    GET_ARTICLES: (userId) => `${API_BASE_URL}/api/users/${userId}/articles`,
  },

  // Category endpoints
  CATEGORIES: {
    GET_ALL: `${API_BASE_URL}/api/categories`,
  },
};

/**
 * Helper function to get authorization headers
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Helper function for API calls with error handling
 */
export const apiCall = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export default API_ENDPOINTS;
