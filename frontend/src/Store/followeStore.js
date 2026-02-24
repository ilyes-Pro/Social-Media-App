import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './AuthStore';
const API_URL = 'http://localhost:5000/api/friendships';

const followeStore = create((set) => ({
  loading: false,

  SendReqAcceptriendship: async ({ setText, id }) => {
    try {
      setText('Request Sent');
      const token = useAuthStore.getState().user.token;
      set({ loading: true });

      await axios.post(
        `${API_URL}/SendAcceptRequerst/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      setText('Add Friend');

      console.error('Login error:', error.response?.data?.error);
    } finally {
      set({ loading: false });
    }
  },

  CancelReqSendRec: async ({ setText, id }) => {
    try {
      setText('Add Friend');
      const token = useAuthStore.getState().user.token;
      set({ loading: true });

      await axios.delete(`${API_URL}/Cancel/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      setText('Request Sent');

      console.error('Login error:', error.response?.data?.error);
    } finally {
      set({ loading: false });
    }
  },

  Unfriend: async ({ setText, id }) => {
    try {
      setText('Add Friend');
      const token = useAuthStore.getState().user.token;
      set({ loading: true });

      await axios.delete(`${API_URL}/Unfriend/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      setText('Friend');
      console.error('Login error:', error.response?.data?.error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default followeStore;
