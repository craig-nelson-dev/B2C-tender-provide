import axios from "axios";

const api = axios.create({
    baseURL: 'https://chollitos.net/api/',
});

const getLangService = async () => {
    try {
        const response = await api.get("lang/get");
        // console.log(JSON.stringify(response));
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
};

const changeLangService = async (lang) => {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    try {
        const response = await api.post("lang/change", {
            lang: lang,
        },
        {
          headers: {
            authorization: auth_token.token_type + " " + auth_token.access_token,
          }
        });
        // console.log(JSON.stringify(response));
        return response;
    } catch (error) {
        console.log(error)
        return error;
    }
};

export {
    getLangService,
    changeLangService
};