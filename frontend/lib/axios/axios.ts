import axios from 'axios';

const instance = axios.create({
	baseURL: 'http://localhost:5555',
});

instance.interceptors.request.use((config) => {
	return config;
});

export default instance;
