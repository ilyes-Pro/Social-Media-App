import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const AuthStore = create((set) => ({
  user: {
    id: null,
    token: null,
  },
  // email: '', // قيمة مشتركة
  // setEmail: (newEmail) => set({ email: newEmail }),
  loading: false,
  statusUser: {
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

      set((state) => ({
        // user: {
        //   ...state.user, // هنا state معرف
        //   token: response.data.accessToken,
        //   email, // نخزن البريد هنا
        // },
        user: { id: response.data.id, token: response.data.accessToken },
        statusUser: { statusUS: true },
      }));

      return { success: true };
      // logoutTimer = setTimeout(() => {
      //   set({ user: null, statusUser: { messageErr: '', statusUS: true } });
      // }, 1000);
    } catch (error) {
      set({
        statusUser: {
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

  signup: async ({ fullname, username, email, password }) => {
    try {
      set({ loading: true });
      // if (logoutTimer) clearTimeout(logoutTimer);
      const response = await axios.post(`${API_URL}/register`, {
        fullname,
        username,
        email,
        password,
      });

      return { success: true };
      // logoutTimer = setTimeout(() => {
      //   set({ user: null, statusUser: { messageErr: '', statusUS: true } });
      // }, 1000);
    } catch (error) {
      console.error('Login error:', error.response?.data?.error);
      return {
        success: false,
        message: error.response?.data?.error || 'Server error',
      };
    } finally {
      set({ loading: false });
    }
  },

  verifyEmail: async ({ email, code }) => {
    try {
      console.log('Verifying email:', email, 'with code:', code);
      set({ loading: true });
      // if (logoutTimer) clearTimeout(logoutTimer);
      const response = await axios.post(`${API_URL}/verify`, {
        email,
        code,
      });

      // set((state) => ({
      //   user: { ...state.user, token: response.data.accessToken },
      // }));
      set({ user: { id: response.data.id, token: response.data.accessToken } });
      return { success: true };
      // logoutTimer = setTimeout(() => {
      //   set({ user: null, statusUser: { messageErr: '', statusUS: true } });
      // }, 1000);
    } catch (error) {
      console.error('Login error:', error.response?.data?.error);
      return {
        success: false,
        message: error.response?.data?.error || 'Server error',
      };
    } finally {
      set({ loading: false });
    }
  },

  resendVerificationCode: async ({ email }) => {
    try {
      set({ loading: true });
      // if (logoutTimer) clearTimeout(logoutTimer);
      const response = await axios.post(`${API_URL}/resendVerificationCode`, {
        email,
      });

      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data?.error);
      return {
        success: false,
        message: error.response?.data?.error || 'Server error',
      };
    } finally {
      set({ loading: false });
    }
  },

  UploadProfile: async ({ img_user, p_img, token }) => {
    try {
      console.log('this is the token :', token);
      console.log('this is the img user :', img_user);
      console.log('this is the img profile :', p_img);
      set({ loading: true });

      const formData = new FormData();
      formData.append('img_user', img_user);
      formData.append('p_img', p_img);

      const response = await axios.post(`${API_URL}/UploadProfile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({
        statusUser: {
          statusUS: true,
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Upload error:', error.response?.data?.error);

      return {
        success: false,
        message: error.response?.data?.error || 'Server error',
      };
    } finally {
      set({ loading: false });
    }
  },

  forgetPassword: async ({ email }) => {
    try {
      console.log('the bitch:', email);
      set({ loading: true });

      const response = await axios.post(`${API_URL}/forgotPassword`, {
        email,
      });

      console.log('Email in store now  fffak:', AuthStore.getState().email);
      return { success: true };
    } catch (error) {
      console.error('Upload error:', error.response?.data?.error);

      return {
        success: false,
        message: error.response?.data?.error || 'Server error',
      };
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async ({ email, password, token }) => {
    console.log(
      'Reset Password called with email:',
      email,
      'token:',
      token,
      'password:',
      password
    );
    try {
      set({ loading: true });

      const response = await axios.patch(`${API_URL}/resetPassword/${token}`, {
        email,
        password,
      });

      return { success: true };
    } catch (error) {
      console.error('Upload error:', error.response?.data?.error);

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
