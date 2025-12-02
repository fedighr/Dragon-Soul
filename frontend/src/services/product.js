import api from "./api"

export const AddProduct = async(name, price, color, size, image, quantity, user, product) =>{

  try{
      const response = await api.post("http://127.0.0.1:8000/order/orders/", {name, price, color, size, image, quantity, user, product});
      return response.date;
  }catch(error){
        if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
}
}