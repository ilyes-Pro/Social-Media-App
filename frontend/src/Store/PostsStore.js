import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './AuthStore';

const API_URL = 'http://localhost:5000/api/posts';

const PostshStore = create((set) => ({
  loading: false,
  DataPosts: [],

  ShowAllPosts: async () => {
    try {
      const token = useAuthStore.getState().user.token;
      set({ loading: true });

      const response = await axios.get(`${API_URL}/getPost`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        DataPosts: response.data.data,
      });
    } catch (error) {
      console.error('Login error:', error.response?.data?.error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default PostshStore;
