import axios from "axios";

const api = axios.create({
  baseURL: 'https://chollitos.net/api/',
  // baseURL: process.env.API_BASE_URL,
});

const signInService = async (email, password) => {
  try {
    const response = await api.post("user/login", {
      email: email,
      password: password,
    });
    // console.log(JSON.stringify(response));
    return response;
  } catch (error) {
    console.log(error)
    return error;
  }
};

const signUpService = async (email, password, username, birthday) => {
  try {
    const response = await api.post("user/register", {
      email: email,
      password: password,
      username: username,
      birthday: birthday
    });
    // console.log(JSON.stringify(response));
    return response;
  } catch (error) {
    return error;
  }
};

const getAllUserService = async () => {

  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.get("user/getall",
      {
        headers: {
          authorization: auth_token.token_type + " " + auth_token.access_token,
        }
      });
    return response?.data?.data;
  } catch (error) {
    return error;
  }
};
const verifyCodeService = async (email, code) => {

  try {
    const response = await api.post("user/verify_code", {
      email: email,
      code: code
    });
    return response;
  } catch (error) {
    return error;
  }
}

const resendCodeService = async (email) => {
  try {
    const response = await api.post("user/resend_code", {
      email: email
    });
    return response;
  } catch (error) {
    return error;
  }
}

const resetPasswordService = async (data) => {

  try {
    const response = await api.post("user/reset_password", data);
    return response;
  } catch (error) {
    return error;
  }
}

const updateRoleService = async (id, role) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.post("user/update_role", {
      user_id: id,
      role: role
    },
      {
        headers: {
          authorization: auth_token.token_type + " " + auth_token.access_token,
        }
      });

    return response;
  } catch (error) {
    return error;
  }
}

const deleteUserService = async (id) => {

  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.get(`user/delete/${id}`, {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });

    return response;
  } catch (error) {
    return error;
  }
}

const deactivateUserService = async (id) => {

  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.get(`user/deactivate/${id}`, {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response;
  } catch (error) {
    return error;
  }
}

const activateUserService = async (id) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.get(`user/activate/${id}`, {
      headers: {
        authorization: auth_token.token_type + " " + auth_token.access_token,
      }
    });
    return response;
  } catch (error) {
    return error;
  }
}

const changePasswordService = async (data) => {
  const auth_token = JSON.parse(localStorage.getItem('authToken'));
  try {
    const response = await api.post(`user/change_password`,
      data,
      {
        headers: {
          authorization: auth_token.token_type + " " + auth_token.access_token,
        }
      });
    return response;
  } catch (error) {
    return error;
  }
}

export {
  signInService,
  signUpService,
  getAllUserService,
  verifyCodeService,
  resendCodeService,
  resetPasswordService,
  deleteUserService,
  activateUserService,
  deactivateUserService,
  updateRoleService,
  changePasswordService,
};