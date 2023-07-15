
// All database calls are made from this service file
// const localdomain = "http://localhost:5001"; 
const localdomain = "https://ebookstore-backend.herokuapp.com"; 
// for ngrok
// const localdomain = "https://37b4-2409-4054-8e-b3d4-80f5-479a-6430-f80f.in.ngrok.io"; 


const books_url = `${localdomain}/api/books`;
const cart_url = `${localdomain}/api/cart`;
const auth_url = `${localdomain}/api/user`;
const review_url = `${localdomain}/api/reviews`;
const order_url = `${localdomain}/api/order`;
const address_url = `${localdomain}/api/address`;
const pincode_url = `${localdomain}/api/pincode`;
const stock_url = `${localdomain}/api/stock`;
const wishlist_url = `${localdomain}/api/wishlist`;
const upload_url = `${localdomain}/api/upload`;

export const Upload_Service = {
    uploadImage : async (token, formData)=>{
        try{
            const response = await fetch(`${upload_url}`, {
                method: 'POST',
                headers:{
                    'auth-token': token  
                },
                body:formData
            });
            return response;
        }catch(err){
            return err;
        }
        
    }
}
export const Wishlist_Service = {
    addWishlistItem: async (token, formData)=>{
        try{
            const response = await fetch(wishlist_url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'auth-token': token
                },
                body:JSON.stringify(formData)
            });
            return response;
        }catch(err){
            return err;
        }
    },
    checkIfItemAlreadyAdded: async (token, formData)=>{
        try {
            const response = await fetch(`${wishlist_url}/added?book_id=${formData.book_id}&user_id=${formData.user_id}`,{
                headers:{
                    'Content-Type':'application/json',
                    'auth-token': token
                },
            });
            return response;
        }catch(err){
            return err;
        }
    },
    getUserWishlist: async (token,userId)=>{
        try{
            const response = await fetch(`${wishlist_url}/${userId}`,{
                headers:{
                    'auth-token': token
                }
            });
            return response;
        }catch(err){
            return err;
        }
    },
    deleteWishlistItem: async (token,itemId)=>{
        try{
            const response = await fetch(`${wishlist_url}/${itemId}`,{
                method:'DELETE',
                headers:{
                    'auth-token': token
                }
            });
            return response;
        }catch(err){
            return err;   
        }
    }
    
}

export const Stock_Service = {
    getStockDetails: async (bookCode)=>{
        try{
            const response = await fetch(`${stock_url}/${bookCode}`);
            return response;
        }catch(err){
            return err;
        }
    },
    addStockDetails: async (token, formData)=>{
        try{
            const response =  await fetch(stock_url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'auth-token': token
                },
                body:JSON.stringify(formData) 
            });
            return response;
        }catch(err){
            return err;
        }
    },
    editStockDetails: async (token, stockId,formData)=>{
        try{
            const response = await fetch(`${stock_url}/${stockId}`,{
                method:'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token':token
                },
                body: JSON.stringify(formData)
            });
            return response;
        }catch(err){
            return err;
        }
    }
}

export const Pincode_Service = {
    getPincodes: async (pincode)=>{
        const response = await fetch(`${pincode_url}/${pincode}`);
        const data = await response.json();
        return data;
    }
}

export const Address_Service = {
    addAddress: async (token, formData)=>{
        try{
            const response = await fetch(address_url, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'auth-token': token
                },
                body:JSON.stringify(formData) 
            });
            return response;
        }catch(err){
            return err;
        }
    },
    getUserAddress: async (token,userId)=>{
        try{
            const response = await fetch(`${address_url}/${userId}`,{
                headers:{
                    'auth-token': token
                }
            });
            return response;
        }catch(err){
            return err;
        }
    },
    deleteAddress: async (token, addressId)=>{
        try{
            const response = await fetch(`${address_url}/${addressId}`,{
                method:'DELETE',
                headers:{
                    'auth-token': token
                }
            });
            return response;
        }catch(err){
            return err;
        }

    },
    updateAddress: async(token, AddressId,formData)=>{
        try{
            const response = await fetch(`${address_url}/${AddressId}`,{
                method:'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token':token
                },
                body: JSON.stringify(formData)
            });
            return response;
        }catch(err){
            return err;
        }
    }

}
export const Order_Service = {
    getAllOrders: async (token)=>{
        try{
            const response = await fetch(order_url,{
                headers:{
                    'Content-Type':'application/json',
                    'auth-token': token
                }
            });
            return response;
        }catch(err){
            return err;
        }
    },
    addOrder: async (token, formData)=>{
        try{
            const response = await fetch(order_url, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'auth-token': token
                },
                body:JSON.stringify(formData) 
            });
            return response;
        }catch(err){
            return err;
        }
    },
    getOrderHistory: async (token,userId)=>{
        try{
            const response = await fetch(`${order_url}/search?user_id=${userId}`,{
                headers:{
                    'auth-token': token
                }
            }); 
            return response;
        }catch(err){
            return err;
        }
    },
    searchOrderById: async (token,orderId)=>{
        try{
            const response = await fetch(`${order_url}/${orderId}`,{
                headers:{
                    'auth-token': token
                }
            });
            return response;
        }catch(err){
            return err;
        }
    },
    updateOrder: async (token,orderId,formData)=>{
        try{
            const response = await fetch(`${order_url}/${orderId}`,{
                method:'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token':token
                },
                body: JSON.stringify(formData)
            });
            return response;
        }catch(err){
            return err;
        }
    }

}

export const Review_Service = {
    addReview: async (token,formData)=>{
       try{
            const response = await fetch(review_url,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'auth-token': token
                },
                body:JSON.stringify(formData)
            });
            return response;
       }catch(err){
           return err;
       }
    },
    checkIfSubmitted: async (token,formData)=>{
        try{
            const response = await fetch(`${review_url}/submitted?book_id=${formData.book_id}&user_id=${formData.user_id}`,{
                headers:{
                    'Content-Type':'application/json',
                    'auth-token': token
                },
            });
            return response;
        }catch(err){
            return err;
        }
        
    },
    getReviews: async (bookId)=>{
        try{
            const response  = await fetch(`${review_url}/${bookId}`);
            return response;
        }catch(err){
            return err;
        }
    }
}

// Item/book Service
export const Item_Service = {
    addBookItem: async (token,formData)=>{
        try{
            const response = await fetch(books_url,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'auth-token': token
                },
                body:JSON.stringify(formData)
            });
            return response;
        }catch(err){
            return err;
        }
    },

    getLatest: async(cat)=>{
        try{
            const response = await fetch(`${books_url}?category=${cat}`);
            return response;
        }catch(err){
            return err;
        }
    },

    getPopular: async()=>{
        try{
            const response = await fetch(`${books_url}?category=physics`)
            return response;
        }catch(err){
            return err;
        }
    },

    getSearched: async (searchKey)=>{
        try{
            const response = await fetch(`${books_url}/search?search=${searchKey}`);
            return response;
        }catch(err){
            return err;
        }
        
    },
    
    getSearchSuggestions: async (searchKey)=>{
        try{
            const response = await fetch(`${books_url}/search_suggestions?keyWord=${searchKey}`);
            return response;
        }catch(err){
            return err;
        }
        
    },


    getBooksByCategory: async (category)=>{
        try{
            const response = await fetch(`${books_url}?category=${category}`);
            return response;
        }catch(err){
            return err;
        }
    },

    getBookDetails: async (bookId)=>{
        try{
            const response = await fetch(`${books_url}/${bookId}`);
            return response;
        }catch(err){
            return err;
        }
    },

    
    getAllBooks: async()=>{
        try{
            const response = await fetch(books_url);
            return response;
        }catch(err){
            return err;
        }
    },

    updateBookItem: async(bookId, token, formData)=>{
        try{
            const response = await fetch(`${books_url}/${bookId}`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                'auth-token': token
                },
                body: JSON.stringify(formData)
            });
            return response;
        }catch(err){
            return err;
        }
    },
    deleteBookItem: async (token,bookId)=>{
        try{
            const response = await fetch(`${books_url}/${bookId}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': token
                },
            });
            return response;
        }catch(err){
            return err;
        }
    }

}

// Cart Service
export const Cart_Service ={
    addToCart: async(token, userItem)=>{
        try{
            const response = await fetch(cart_url,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'auth-token': token
                },
                body:JSON.stringify(userItem)
            });
        return response;
        }catch(err){
            return err;
        }
    },
    deleteCart: async (token,userID)=>{
        const response = await fetch(`${cart_url}/whole/${userID}`,{
            method:'DELETE',
            headers: {
                'auth-token':token
            }
        });
        const data = await response.json();
        return data;
    },
    getCartItems: async(id, token)=>{
        try{
            const response = await fetch(`${cart_url}/${id}`,{
                headers: {
                    'auth-token': token
                }
            });
            return response;
        }catch(err){
            return err;
        }
        
    },

    removeFromCart: async(id,token)=>{
        const response = await fetch(`${cart_url}/${id}`,{
            method:'DELETE',
            headers: {
                'auth-token':token
            }
        });
        const data = await response.json();
        return data;
    },

    updataCartItem: async(id,token,formData)=>{
        const response = await fetch(`${cart_url}/${id}`,{
            method:'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'auth-token':token
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    }

}

// User Service
export const Auth_Service = {
    uploadProfilePic: async (token, userId, formData)=>{
        try{
            const response = await fetch(`${auth_url}/${userId}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body:JSON.stringify(formData)
            })
            return response;
        }catch(err){
            return err;
        }
    },
    updateUserName: async (token, userId, formData)=>{
        try{
            const response = await fetch(`${auth_url}/${userId}`,{
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body:JSON.stringify(formData)
            })
            return response;
        }catch(err){
            return err;
        }
    },
    getUser: async (token,userId)=>{
        try{
            const response = await fetch(`${auth_url}/${userId}`,{
                headers:{
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            }); 
            return response;
        }catch(err){
            return err;
        }
    },
    getUsers: async (token)=>{
        try{
            const response = await fetch(`${auth_url}`,{
                headers:{
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            }); 
            return response;
        }catch(err){
            return err;
        }
    },
    onLogin: async(formData)=>{
        try{
            const response = await fetch(`${auth_url}/login`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Accept': 'application/json',
            },
            body:JSON.stringify(formData)
            });
            return response;
        }catch(err){
            return err;
        }
    },
    onRegister: async(formData)=>{
       try{
            const response = await fetch(`${auth_url}/register`,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Accept': 'application/json'
                },
                body:JSON.stringify(formData)
            });
            return response; 
       }catch(err){
        return err;
       }
    },
    deleteUser: async (token, userId)=>{
        try{
            const response = await fetch(`${auth_url}/${userId}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': token
                },
            });
            return response;
        }catch(err){
            return err;
        }
    },
    verifycurrentPassword: async(userInfo)=>{
        try{
            const response = await fetch(`${auth_url}/verifypassword`,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Accept': 'application/json',
                    'auth-token': userInfo.token
                },
                body:JSON.stringify(userInfo)
            });
            return response;
        }catch(err){
            return err;
        }
    },
    changePassword: async (userId,passwordObj)=>{
        try{
            const response = await fetch(`${auth_url}/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type':'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(passwordObj)
            });
            return response;
        }catch(err){
            return err;
        }
    },
    verifyEmail: async(userInfo)=>{
        try{
            const response = await fetch(`${auth_url}/verifyemail`,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'Accept': 'application/json',
                },
                body:JSON.stringify(userInfo)
            });
            return response;
        }catch(err){
            return err;
        }
    }
  
}