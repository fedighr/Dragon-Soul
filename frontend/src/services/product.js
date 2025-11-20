import axios from "axios";

export const fetchProducts = async (filters, sort, category) => {
  console.log("Sending to backend:", { filters, sort, category });

  try{
      const response = await axios.get("http://127.0.0.1:8000/store/products/",{});
      console.log(response);
      return response.data;
  }catch(err){
      console.log(err);
      return [];
  }
};

