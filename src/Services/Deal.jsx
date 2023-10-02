import axios from "axios";

const api = axios.create({
  baseURL: 'https://chollitos.net/api/',
  // baseURL: process.env.API_BASE_URL,
});

const createDealService = async (data) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.post('deal/add', data, {
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

const getDealByIdService = async (dealId) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.get('deal/get/' + dealId,
      {
        headers: {
          authorization: auth_token ? (auth_token.token_type + " " + auth_token.access_token) : "",
        }
      });
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

const getCountDealsService = async (catIds) => {
  try {
    const data = { category_id: catIds };
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    if (!data.vip && auth_token && auth_token.user.role !== "customer") data.vip = 2;
    else if (!data.vip) data.vip = 0;

    const response = await api.post('deal/count', data,
    {
      headers: {
        authorization: auth_token ? (auth_token.token_type + " " + auth_token.access_token) : "",
      }
    });
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

const getDealByFilter = async (data) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    if (!data.vip && auth_token && auth_token.user.role !== "customer") data.vip = 2;
    else if (!data.vip) data.vip = 0;

    var headers = {};
    if (auth_token) {
      headers = {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      };
    }
 
    const response = await api.post('deal/find', data, { headers: headers });
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const activateDealService = async (id) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.get('deal/activate/' + id,
    {
      headers: {
        authorization: auth_token ? (auth_token.token_type + " " + auth_token.access_token) : "",
      }
    });
    return response
  } catch (error) {
    console.log(error);
    return error
  }
}

const deactivateDealService = async (id) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.get('deal/deactivate/' + id,
    {
      headers: {
        authorization: auth_token ? (auth_token.token_type + " " + auth_token.access_token) : "",
      }
    });
    return response
  } catch (error) {
    console.log(error);
    return error
  }
}

const setVipService = async (id) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.get('deal/set_vip/' + id,
    {
      headers: {
        authorization: auth_token ? (auth_token.token_type + " " + auth_token.access_token) : "",
      }
    });
    return response
  } catch (error) {
    console.log(error);
    return error
  }
}

const unsetVipService = async (id) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.get('deal/unset_vip/' + id,
    {
      headers: {
        authorization: auth_token ? (auth_token.token_type + " " + auth_token.access_token) : "",
      }
    });
    return response
  } catch (error) {
    console.log(error);
    return error
  }
}

const setPinService = async (id) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.get('deal/pin/' + id,
    {
      headers: {
        authorization: auth_token ? (auth_token.token_type + " " + auth_token.access_token) : "",
      }
    });
    return response
  } catch (error) {
    console.log(error);
    return error
  }
}

const setUnpinService = async (id) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.get('deal/unpin/' + id,
    {
      headers: {
        authorization: auth_token ? (auth_token.token_type + " " + auth_token.access_token) : "",
      }
    });
    return response
  } catch (error) {
    console.log(error);
    return error
  }
}

const deleteDealService = async (id) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.get('deal/delete/' + id,
    {
      headers: {
        authorization: auth_token ? (auth_token.token_type + " " + auth_token.access_token) : "",
      }
    });
    return response
  } catch (error) {
    console.log(error);
    return error
  }
}

const updateDealService = async (data) => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.post('deal/edit', data, {
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

const getAllService = async () => {
  try {
    const auth_token = JSON.parse(localStorage.getItem('authToken'));
    const response = await api.get('deal/getall', {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export {
  createDealService,
  getDealByIdService,
  getCountDealsService,
  getDealByFilter,
  setVipService,
  unsetVipService,
  deleteDealService,
  activateDealService,
  deactivateDealService,
  updateDealService,
  getAllService,
  setPinService,
  setUnpinService
};