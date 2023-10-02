import axios from "axios";

const api = axios.create({
  baseURL: 'https://chollitos.net/api/',
  // baseURL: process.env.API_BASE_URL,
});

const getStoresService = async () => {
  try {
    const response = await api.get('store/getall');
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStoreByIdService = async (id) => {
  try {
    const response = await api.get('store/get/' + id);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getStoreByNameService = async (name) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    if (auth_token && auth_token.user.role !== 'customer') name += "_vip";
    const response = await api.get('store/getbyname/' + name);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const activateStoreService = async ( id ) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'))
  try {
    const response = await api.get('store/activate/' + id,
    {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    return error
  }
}

const deactivateStoreService = async ( id ) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'))
  try {
    const response = await api.get('store/deactivate/' + id,
    {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    return error
  }
}

const createStoreService = async ( data ) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'))
  try {
    const response = await api.post('store/add', data,
    {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    return error
  }
}

const updateStoreService = async ( data ) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'))
  try {
    const response = await api.post('store/edit', data,
    {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    return error
  }
}

export {
  getStoresService,
  getStoreByIdService,
  getStoreByNameService,
  activateStoreService,
  deactivateStoreService,
  createStoreService,
  updateStoreService,
};