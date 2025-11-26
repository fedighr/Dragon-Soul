import api from "./api";

export const VerifyAuthCode = async (email, code) => {
  try {
    const response = await api.post("/users/VerifyCode/", { email, code });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const ResendAuthCode = async (email) => {
  try {
    const response = await api.post("/users/ResendCode/", { email });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
