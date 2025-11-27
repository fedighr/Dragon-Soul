import api from "./api";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/users/login/", { email, password });
    const { refresh, access } = response.data;
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};