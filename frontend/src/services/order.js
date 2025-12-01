import api from "./api"

export const getCartItems = async(id) => {
    try{
        const response = await api.get("order/orders/",{params: { user: id }});
        return response.data;
    }catch(error){
        if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
    }    
};

export const removeCartItem = async (id, user_id) =>{

    try{
        await api.delete(`order/orders/${id}/`,{params : {user : user_id}});

    }catch(error){
        if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
    } 

};

export const updateCartItem = async(id, quantity, user_id) =>{
    console.log(quantity, id, user_id)
    try{
        await api.patch(`order/orders/${id}/`,{quantity},{params : {user : user_id }});

    }catch(error){
        if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
}
};
export const clearCartItems = async(id) =>{

    try{
        await api.delete("order/orders/delete_all/",{params: { user: id }});
    }catch(error){
        if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
    }
}  ;
