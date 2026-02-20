import { create } from 'zustand';
import axios from 'axios';

import useAuthStore from './AuthStore';

const API_URL = 'http://localhost:5000/api/users';

const AuthStore = create((set) => ({
  dataUser: null,

  ShowUser: async () => {
    try {
      const id = useAuthStore.getState().user.id;
      set({ loading: true });

      const response = await axios.get(`${API_URL}/user/${id}`);

      set({ dataUser: response.data.user });
    } catch (error) {
      console.error('Login error:', error.response?.data?.error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default AuthStore;
