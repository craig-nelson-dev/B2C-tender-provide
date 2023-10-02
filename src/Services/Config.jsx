import axios from "axios";

const api = axios.create({
    baseURL: 'https://chollitos.net/api/',
    // baseURL: process.env.API_BASE_URL,
});

const getConfigService = async () => {
    try {
        const response = await api.get('config/get');
        return response?.data?.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const setConfigService = async (data) => {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    try {
        const response = await api.post('config/set',
            data, {
            headers: {
                authorization: auth_token.token_type + " " + auth_token.access_token,
            }
        });
        return response
    } catch (error) {
        console.log(error);
        return error;
    }
}

export {
    getConfigService,
    setConfigService
}