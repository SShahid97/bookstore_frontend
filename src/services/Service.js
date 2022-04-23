
// All database calls are made from this service file
// for ngrok
// const books_url = 'http://0b9c-117-214-244-109.ngrok.io/api/books';
// const cart_url = 'http://0b9c-117-214-244-109.ngrok.io/api/cart';
// const auth_url = 'http://0b9c-117-214-244-109.ngrok.io/api/user';

const books_url = 'http://localhost:5001/api/books';
const cart_url = 'http://localhost:5001/api/cart';
const auth_url = 'http://localhost:5001/api/user';
const review_url = 'http://localhost:5001/api/reviews'

export const Review_Service = {
    addReview: async (token,formData)=>{
        const response = await fetch(review_url,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'auth-token': token
            },
            body:JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    },
    getReviews: async (bookId)=>{
        const response = await fetch(`${review_url}/${bookId}`);
        const data = await response.json();
        return data;
    }
}

// Item/book Service
export const User_Service = {
    addBookItem: async (token,formData)=>{
        const response = await fetch(books_url,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'auth-token': token
            },
            body:JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    },

    getLatest: async(cat)=>{
       const response = await fetch(`${books_url}?category=${cat}`);
       const data = await response.json();
       return data;
    },

    getPopular: async()=>{
        const response = await fetch(`${books_url}?category=css_book`)
        const data = await response.json();
        return data;
    },

    getSearched: async (searchKey)=>{
        const response = await fetch(`${books_url}/search?search=${searchKey}`);
        const data = await response.json();
        return data;
        
    },

    getBooksByCategory: async (category)=>{
        const response = await fetch(`${books_url}?category=${category}`);
        const data = await response.json();
        return data;
    },

    getBookDetails: async (bookId)=>{
        const response = await fetch(`${books_url}/${bookId}`);
        const data = await response.json();
        return data;
    },

    getAllBooks: async()=>{
        const response = await fetch(books_url)
        const data = await response.json();
        return data;
    },

    updateBookItem: async(bookId, token, formData)=>{
        const response = await fetch(`${books_url}/${bookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      return data;
    }

}

// Cart Service
export const Cart_Service ={
    getCartItems: async(id, token)=>{
        const response = await fetch(`${cart_url}/${id}`,{
                headers: {
                    'auth-token': token
                }
            });
        const data = await response.json();
        return data;
    },

    addToCart: async(token, userItem)=>{
        const response = await fetch(cart_url,{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                    'auth-token': token
                },
                body:JSON.stringify(userItem)
        });
        const data = await response.json();
        return data;
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
    onLogin: async(formData)=>{
        const response = await fetch(`${auth_url}/login`,{
        method: 'POST',
        headers: {
            'Content-Type':'application/json',
            'Accept': 'application/json',
        },
        body:JSON.stringify(formData)
        });
        return response;
    },
    onRegister: async(formData)=>{
        const response = await fetch(`${auth_url}/register`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify(formData)
        });
        return response;
    }

}