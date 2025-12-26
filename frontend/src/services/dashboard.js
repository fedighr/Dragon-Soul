import api from "./api"

export const getHomeInfo = async ()=>{
    try{
    const response = await api.get('dashboard/getHomeInfo/');
    return response.data.data;
    }catch(error){
        if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
    }
};

export const getOrderDetails = async (id)=>{
    try{
    const response = await api.get('dashboard/getOrderDetails/', { params: { id } });
    return response.data.data;
    }catch(error){
        if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
    }
};

export const addProduct = async (formData) => {
  try {
    const response = await api.post('store/add/', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data'
      }
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

export const updateProduct = async (productId, formData) => {
  try {
    const response = await api.put(`store/add/${productId}/`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data'
      }
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