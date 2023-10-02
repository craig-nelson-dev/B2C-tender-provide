import axios from "axios";

const api = axios.create({
  baseURL: 'https://chollitos.net/api/',
  // baseURL: process.env.API_BASE_URL,
});

const getCategoriesService = async () => {
  try {
    const response = await api.get('category/getall');
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCategoryBySlugService = async (slug) => {
  try {
    const response = await api.get('category/getbyslug/' + slug);
    return response?.data?.data[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getCategoryByIdService = async (id) => {
  try {
    const response = await api.get('category/getbyid/' + id);
    return response?.data?.data[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const activateCategoryService = async (id) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.get('category/activate/' + id,
    {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const deactivateCategoryService = async (id) => {
  
  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.get('category/deactivate/' + id,
    {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const createCategoryService = async (data) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.post('category/add', data,
    {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

const editCategoryService = async (data) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.post('category/edit', data,
    {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export {
  getCategoriesService,
  getCategoryBySlugService,
  getCategoryByIdService,
  activateCategoryService,
  deactivateCategoryService,
  createCategoryService,
  editCategoryService,
};