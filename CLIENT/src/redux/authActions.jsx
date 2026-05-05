import { loginStart, loginSuccess, loginFailure, logout, registerStart, registerSuccess, registerFailure } from './authSlice';
import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Async action for login
export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    
    // Check if it's the admin logging in
    const endpoint = credentials.email === 'admin@opinio.com' ? '/api/admin/login' : '/api/login';
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, credentials);

    if (response.data.token) {
      const user = response.data.user || response.data.admin;
      const token = response.data.token;

      // Store token in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch(loginSuccess({ user, token }));
      return { success: true };
    } else {
      throw new Error('Login failed');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// Async action for registration
export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());

    // Replace with your actual API endpoint
    const response = await axios.post(`${API_BASE_URL}/api/register`, userData);

    const { user, token } = response.data;

    // Store token in localStorage for persistence
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    dispatch(registerSuccess({ user, token }));
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    dispatch(registerFailure(errorMessage));
    return { success: false, error: errorMessage };
  }
};

// Action for logout
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  dispatch(logout());
};

// Check if user is already logged in (from localStorage)
export const checkAuthState = () => (dispatch) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      dispatch(loginSuccess({ 
        user: userData,
        token 
      }));
    } catch (error) {
      // If there's an error parsing the user data, clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
};
