import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './AuthStore';
const API_URL = 'http://localhost:5000/api/comments';

const CommentsStore = create((set) => ({
  loading: false,
  DataComments: [],

  ShowAllComments: async (idPost) => {
    try {
      set({ loading: true });

      const response = await axios.get(`${API_URL}/posts/${idPost}`);

      set({
        DataComments: response.data.comments,
      });
    } catch (error) {
      console.error('Login error:', error.response?.data?.error);
    } finally {
      set({ loading: false });
    }
  },

  CreatComments: async ({ idPost, body_comment, setCommentCont }) => {
    try {
      setCommentCont((prev) => parseInt(prev) + 1);

      set({ loading: true });
      const token = useAuthStore.getState().user.token;

      const response = await axios.post(
        `${API_URL}/posts/${idPost}/AddComments`,
        { body_comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set((state) => ({
        DataComments: [...state.DataComments, response.data.comment],
      }));
    } catch (error) {
      setCommentCont((prev) => parseInt(prev) - 1);

      console.error(
        'Create comment error:',
        error.response?.data?.error || error.response?.data || error.message
      );
    } finally {
      set({ loading: false });
    }
  },
}));

export default CommentsStore;
