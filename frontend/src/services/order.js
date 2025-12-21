import api from "./api"

export const getCartItems = async(id) => {
    try{
        const response = await api.get("order/orders/",{params: { user: id }});
        return response.data.results;
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
        await api.delete(`order/orders/${id}/delete_one/`,{params : {user : user_id}});

    }catch(error){
        if (error.response) {
      throw error.response.data;
    } else {
      throw { error: "Network error" };
    }
    } 

};

export const updateCartItem = async(id, quantity, option) =>{
    try{
        const response = await api.patch(`order/orders/${id}/updateStock/`, { quantity, option });
        return response.data;
    }catch(error){
        if (error.response) {
            if (error.response.status === 304) {
                return { success: false, message: 'Not enough' };
            }
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
};