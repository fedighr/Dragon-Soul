import api from "./api.js";

export const SendResetEmail = async (email) =>{
    try{
        const response = await api.post("/users/ResetPassword1/", {email});
        return response.data;
    }catch(error){
        if (error.response) {
            throw error.response.data;
        }else{
            throw { error: "Network error" };
        }
    }
}

export const VerifyResetCode = async (email, code) => {
  try {
    const response = await api.post("/users/ResetPassword2/", { email, code });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const ResendResetCode = async (email) => {
  try {
    const response = await api.post("/users/ResendCode/", { email });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const SaveResetPassword = async (email, password) => {
  try {
    const response = await api.post("/users/ResetPassword3/", {email, password });
    return response.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const ResetEmailVerify = async (email) => {
  try {
    const response = await api.post("/users/verifyEmailUsed/", { email });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
  }
};