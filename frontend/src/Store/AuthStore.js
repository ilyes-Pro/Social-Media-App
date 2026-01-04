import { create } from 'zustand';
import axios from 'axios';
import { set } from 'zod';

const API_URL = 'http://localhost:5000/api/auth';

const AuthStore = create((set) => ({
  user: null,
  loading: false,
  statusUser: {
    messageErr: '',
    statusUS: false,
  },

  login: async ({ email, password }) => {
    try {
      set({ loading: true });
      // if (logoutTimer) clearTimeout(logoutTimer);
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      set({
        user: response.data.user,
        statusUser: {
          messageErr: '',
          statusUS: true,
        },
      });
      return { success: true };
      // logoutTimer = setTimeout(() => {
      //   set({ user: null, statusUser: { messageErr: '', statusUS: true } });
      // }, 1000);
    } catch (error) {
      set({
        statusUser: {
          messageErr: error.response?.data?.error || 'Server error',
          statusUS: false,
        },
      });
      console.error('Login error:', error.response?.data?.error);
      return {
        success: false,
        message: error.response?.data?.error || 'Server error',
      };
    } finally {
      set({ loading: false });
    }
  },
}));

export default AuthStore;
