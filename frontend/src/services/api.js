import axios from 'axios';

const api = axios.create({
    baseURL: 'http://uevertonapitindev-com.umbler.net'
});

export default api;