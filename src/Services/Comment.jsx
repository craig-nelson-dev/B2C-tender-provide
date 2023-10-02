import axios from "axios";

const api = axios.create({
  baseURL: 'https://chollitos.net/api/',
  // baseURL: process.env.API_BASE_URL,
});

const getCommentsByDealIdService = async (dealId) => {
  try {
    const response = await api.post('comment/find', {
      "type": "deal",
      "dest_id": dealId
    });
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const deleteCommentService = async (id) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.get('comment/delete/' + id, {
      headers: {
          authorization: auth_token.token_type + " " + auth_token.access_token,
      }
  } );
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const createCommentService = async ( {blog, dealId} ) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.post('comment/add', {
      "type": "deal",
      "dest_id": dealId,
      "blog": blog
    }, {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export {
  getCommentsByDealIdService,
  createCommentService,
  deleteCommentService
};