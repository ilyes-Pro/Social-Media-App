import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './AuthStore';
const API_URL = 'http://localhost:5000/api/likes';

const LikeStore = create((set) => ({
  loading: false,
  DatalikeUser: [],

  ShowAllLikeUser: async (id) => {
    try {
      set({ loading: true });
      const token = useAuthStore.getState().user.token;
      const response = await axios.get(`${API_URL}/showUsersLikesPost/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        DatalikeUser: response.data.likes,
      });
    } catch (error) {
      console.error('Login error:', error.response?.data?.error);
    } finally {
      set({ loading: false });
    }
  },

  AddLikeDislike: async ({ idPost, like, setLike, setLikeCont }) => {
    const prevLike = like;

    try {
      const token = useAuthStore.getState().user.token;

      // 🟢 Optimistic UI
      setLike(!prevLike);
      setLikeCont((prev) =>
        prevLike ? parseInt(prev) - 1 : parseInt(prev) + 1
      );

      console.log('id is the fak like ', idPost);

      await axios.post(
        `${API_URL}/likePost/${idPost}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // 🔴 rollback
      setLike(prevLike);
      setLikeCont((prev) =>
        prevLike ? parseInt(prev) + 1 : parseInt(prev) - 1
      );

      console.error('Like error:', error.response?.data?.error);
    }
  },
}));

export default LikeStore;
