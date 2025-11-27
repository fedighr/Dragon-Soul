
import api from "./api.js";
export const fetchProducts = async (filters, sort, category) => {
  console.log("Sending to backend:", { filters, sort, category });

  try{
      const response = await api.get("/store/products/",{});
      console.log(response);
      return response.data;
  }catch(err){
      console.log(err);
      return [];
  }
};

