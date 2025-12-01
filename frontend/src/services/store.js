
import axios from "axios";

export const fetchProducts = async (filters, ordering, type) => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/store/products/", {
      params: {
        filters: JSON.stringify(filters),
        ordering: ordering,
        type: type
      },
    });

    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      throw new Error("Invalid response format from server");
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