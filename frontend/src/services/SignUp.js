import api from "./api";

export const EmailVerify = async (email) => {
  try {
    const response = await api.post("/users/verifyEmail/", { email });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
  }
};

export const PhoneNumberVerify = async (phoneNumber) => {
  try {
    const response = await api.post("/users/verifyPhone/", { phoneNumber });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
  }
};

export const RegisterUser = async (data) => {
  try {
    const response = await api.post("/users/register/", {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      phone_number: data.phone,
      gender: data.gender,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
  }
};

/*export const SendAuthEmail = async (email) =>{
    try{
        const response = await api.post("/users/sendAuthEmail/", {email});
        return response.data;
    }catch(error){
        if (error.response) {
            throw error.response.data;
        }else{
            throw { error: "Network error" };
        }
    }
}*/
