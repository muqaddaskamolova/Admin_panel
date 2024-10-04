import axios from 'axios';

const BASE_URL = 'http://autoapi.dezinfeksiyatashkent.uz/api/';

const instance = axios.create({
    baseURL: BASE_URL,
});

// Add a response interceptor
instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const response = await instance.post('refresh', {}, { withCredentials: true });
                if (response.status === 200) {
                    instance.defaults.headers.common['Authorization'] = `Bearer ${response.data['token']}`;
                    return instance(originalRequest);
                }
            } catch (err) {
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
