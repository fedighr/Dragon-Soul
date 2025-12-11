import api from "./api";

export const fetchProducts = async (filters, ordering, type, page) => {
  try {
    const response = await api.get("store/products/", {
      params: {
        filters: JSON.stringify(filters),
        ordering,
        type,
        page,
      },
      validateStatus: (status) => status >= 200 && status < 500,
    });
    console.log(response.data);
    if (response.status === 404) {
      return [];
    }


    if (response.data && response.data.results) {
      return response.data.results;
    } else {
      console.error("Invalid response format from server:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);

    if (error.response) {
      throw new Error(`Server error: ${error.response.status}`);
    } else if (error.request) {
      throw new Error("Network error: Unable to connect to server");
    } else {
      throw new Error("Failed to load products");
    }
  }
};

export const addCartItem = async (id) => {

    try{
    const response = await api.post("order/orders/",{params: { user: id }})
    return response.data
    }catch(error){
        if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
    }
};