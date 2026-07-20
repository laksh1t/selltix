import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
})

let logoutFn = null;
api.registerLogout = (fn) => {
  logoutFn = fn;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('selltix_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('selltix_refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });

          const newAccessToken = res.data?.data?.accessToken || res.data?.accessToken;
          const newRefreshToken = res.data?.data?.refreshToken || res.data?.refreshToken;

          if (newAccessToken) {
            localStorage.setItem('selltix_token', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('selltix_refresh_token', newRefreshToken);
            }

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {

          if (logoutFn) logoutFn();
          return Promise.reject(refreshError);
        }
      } else {
    
        if (logoutFn) logoutFn();
      }
    }

    return Promise.reject(error);
  }
)

export default api
