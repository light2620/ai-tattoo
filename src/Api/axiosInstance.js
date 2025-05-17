import axios from 'axios';

const token = localStorage.getItem('Authorization');
 const axiosInstance = axios.create({
    headers : {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})

axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('Authorization');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default axiosInstance;