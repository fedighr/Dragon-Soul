import api from "./api";

export const getHomeInfo = async () => {
  try {
    const res = await api.get("dashboard/getHomeInfo/");
    return res.data.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const getAnalyticsData = async ({ type = "sales", range = "month" }) => {
  try {
    const res = await api.get("dashboard/getAnalytics/", {
      params: { type, range }
    });
    return res.data.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const getOrderDetails = async (id) => {
  try {
    const res = await api.get("dashboard/getOrderDetails/", { params: { id } });
    return res.data.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const addProduct = async (formData) => {
  try {
    const res = await api.post("store/add/", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const updateProduct = async (productId, formData) => {
  try {
    const res = await api.put(`store/add/${productId}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const UpdateStock = async (stockData) => {
  try {
    const res = await api.patch("store/HandleProducts/UpdateStock/", {
      id: stockData.sizeId,
      quantity: stockData.quantity,
      option: stockData.action
    });
    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const DeleteProduct = async (id) => {
  try {
    await api.delete(`store/HandleProducts/${id}/DeleteProduct/`);
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const RegisterUser = async (data) => {
  try {
    const res = await api.post("/dashboard/HandleUser/", {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password,
      phone_number: data.phone,
      gender: data.gender,
      is_admin: data.isAdmin,
      is_verified: true
    });
    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const UpdateUser = async (data) => {
  try {
    const res = await api.patch(`/dashboard/HandleUser/${data.id}/`, {
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone_number: data.phone,
      gender: data.gender,
      is_admin: data.isAdmin
    });
    return res.data;
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const changeAdminStatus = async (id, is_admin) => {
  try {
    await api.patch(`/dashboard/HandleUser/${id}/changeAdminStatus/`, {
      is_admin
    });
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const deleteUser = async (id) => {
  try {
    await api.delete(`/dashboard/HandleUser/${id}/`);
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const cancelOrder = async (id) => {
  try {
    await api.patch(`/dashboard/${id}/cancelOrder/`);
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};

export const deleteOrder = async (id) => {
  try {
    await api.delete(`/dashboard/${id}/deleteOrder/`);
  } catch (error) {
    if (error.response) throw error.response.data;
    throw { error: "Network error" };
  }
};