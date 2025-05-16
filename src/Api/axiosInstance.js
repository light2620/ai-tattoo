import axios from 'axios';

const token = localStorage.getItem('Authorization');
 const axiosInstance = axios.create({
    headers : {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
})

export default axiosInstance;