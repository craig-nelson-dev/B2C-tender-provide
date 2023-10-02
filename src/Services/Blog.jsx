import axios from "axios";

const api = axios.create({
  baseURL: 'https://chollitos.net/api/',
  // baseURL: process.env.API_BASE_URL,
});

const getBlogByIdService = async (id) => {
  try {
    const response = await api.get('blog/get/' + id);
    return response?.data?.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export { getBlogByIdService }