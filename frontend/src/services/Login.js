import api from "./api";

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/users/login/", { email, password });
    localStorage.setItem("access", response.data.access);
    localStorage.setItem("refresh", response.data.refresh);
    return response.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};