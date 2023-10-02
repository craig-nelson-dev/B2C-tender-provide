import axios from "axios";

const api = axios.create({
	baseURL: 'https://chollitos.net/api/',
	// baseURL: process.env.API_BASE_URL,
});

const addLikeDealService = async (data) => {
	try {
		const auth_token = JSON.parse(localStorage.getItem('authToken'));
		const response = await api.post('like/add', data, {
			headers: {
				authorization: auth_token.token_type + " " + auth_token.access_token,
			}
		});
		return response;
	} catch (error) {
		console.log(error);
		return error;
	}
}

const isLikedDealService = async (data) => {
	try {
		const auth_token = JSON.parse(localStorage.getItem('authToken'));
		const response = await api.post('like/find', data, {
			headers: {
				authorization: auth_token.token_type + " " + auth_token.access_token,
			}
		});
		return response;
	} catch (error) {
		console.log(error);
		return error;
	}
}

export {
	addLikeDealService,
	isLikedDealService,
};