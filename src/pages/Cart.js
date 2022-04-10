import React, { useEffect, useState } from 'react';
import {useParams} from 'react-router-dom';
import styled from 'styled-components';
import {Cart_Service} from '../services/Service';
import {cartService} from "../services/LocalService";


function Cart() {
    let i=1;
    let params = useParams();
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount]= useState(0);
    const [emptyCart, setEmptyCart] = useState(false);
    const [quantity, setQuantity] = useState([]);
     
    useEffect(()=>{
        getCartItems();
    },[]);
    const handleQuantity = (e, index)=>{
        e.preventDefault();
        const newQtyArr = [...quantity];
        newQtyArr[index] = e.target.value;
        setQuantity(newQtyArr)    
    }

    const getCartItems = async()=>{
        let user = JSON.parse(localStorage.getItem('user'));
        try{
            const cartResponse = await Cart_Service.getCartItems(params.id, user.token);
            if(cartResponse.length === 0){
                setEmptyCart(true);
            }
            let qty=[];
            cartResponse.forEach(item =>{
                qty.push(item.quantity);
            });
            setQuantity(qty);
            updateCartItems(cartResponse.length);
            // localStorage.setItem("noOfCartItems",JSON.stringify(cartResponse.length));
            setCartItems(cartResponse);
            calculateTotalAmount(cartResponse);
        }catch(err){
            console.log("There was some error: ",err)
        }
    }

    const updateCartItems = (cartDataLength)=>{
        cartService.updateCartItems(cartDataLength);
    }

    const calculateTotalAmount = (itemsArr)=>{
        let amount=0;
        itemsArr.forEach(item => {
            amount+=(item.quantity*item.price);
        });
        setTotalAmount(amount);
    }

    
    // Remove Item from cart
    const handleRemoveItem = async(id,index)=>{
        const newQtyArr = [...quantity];
        newQtyArr.splice(index, 1);
        console.log(newQtyArr);
        setQuantity(newQtyArr);

        //removes item from localStorage
        let cart = JSON.parse(localStorage.getItem('cart'));
        cart.splice(index,1);  
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // when it is the last item in the cart remove cart from localStorage
        if(index === 0){
            localStorage.removeItem('cart');
            updateCartItems(0)
        }else{
            updateCartItems(cart.length)
        }

        let user = JSON.parse(localStorage.getItem('user'));
        try{
            const data = await Cart_Service.removeFromCart(id, user.token);
            alert(data.message);
            getCartItems();
        }catch(err){
            console.log("There was some error: ",err)
        }    
    }
    
    // Update quatity
    const updateQty = async(item_id,i)=>{
         
        console.log(item_id, i);
        let user = JSON.parse(localStorage.getItem('user'));
        try{
            const data = await Cart_Service.updataCartItem(item_id, user.token, {quantity:quantity[i]});
            if(data)
                alert("Quantity updated");
        }catch(err){
            console.log("There was some error: ",err)
        }
        
    }
    return (
      <div className='ViewCartDiv'>
      {/* <Grid>
        {emptyCart && (
            <div style={{padding:'30px'}}>
                <h3 style={{color:'red'}}>Your Cart is Empty</h3>
            </div>
        )}     
        {!emptyCart && cartItems.map((item)=>{
        return (
            <Card key = {item._id}>
                   <img src={require(`../../public/assets/images/${item.book.book_image}.jpg`)} alt={item.book.book_name} />
                    <div style={{marginLeft:'0.3rem', marginTop:'0.5rem', textAlign:'left'}}>
                        <p>{item.book.book_name}</p>
                        <span>Rs.</span><span>{item.book.price}</span>
                    </div>
                    <div className='remove-item'>
                        <button className='remove-item-btn' onClick={() => handleRemoveItem(item._id) }>Remove</button> 
                    </div>
                   
            </Card>
        )
       })
      }
      </Grid> */}

      {/* items total price receipt */}
      {emptyCart && (
            <div style={{padding:'30px'}}>
                <h3 style={{color:'red'}}>Your Cart is Empty</h3>
            </div>
      )}  
      {!emptyCart && (
          <>
          <h3>Your Cart Items</h3>
          <div className='items-receipt'>  
          <table>
            <thead>
            <tr>
              <th>S.No.</th>
              <th>Book</th>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
            </thead>
            { 
              cartItems.map((item,index) => {     
              return (
                <tbody key={item._id}>
                <tr>
                  <td>{i++}</td>
                  <td>
                  <img src={require(`../../public/assets/images/${item.book.book_image}.jpg`)} alt={item.book.book_name} />
                  </td>
                  <td>{item.book.book_name}</td>
                  <td>
                    {quantity[index]}  
                    <div className='qty'>
                        <input className='qty-input' type="number" min={1} value={quantity[index]} name="quantity"  onChange={(e)=>handleQuantity(e,index)}/>
                        <button className='qty-btn' onClick={() =>updateQty(item._id,index) }>update</button> 
                    </div> 
                  </td>
                  <td>Rs. {item.price}</td>
                  <td>Rs. {item.quantity*item.price}</td>
                  <td>
                    <div className='remove-item'>
                        <button className='remove-item-btn' onClick={() => handleRemoveItem(item._id,index) }>Remove</button> 
                    </div>
                  </td>
                </tr>
                </tbody>
              )
            })}
           <tbody>
                <tr style={{background:'#b3a9346b'}}>
                   <td></td> 
                   <td></td> 
                   <td></td> 
                   <td colSpan="2"><b>Delivery Charges:</b></td> 
                   <td>Rs. 100</td>
                   <td></td> 
                </tr>
            </tbody>
          </table>
          <div className='amount'>
            <strong>Total Amount: </strong><b>Rs. {totalAmount+100}</b>
          </div>
          </div>    
    
          {/* Buttons */}
          <div className='checkout-btns'>
            <button className='btns'>Continue Shopping</button>
            <button className='btns'>Checkout</button>
          </div>
          </>
      )}
      </div>
  )
}

const Grid = styled.div`
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(13.5rem,1fr));
    grid-gap:1rem;

    /* responsive for mobiles */
    @media (max-width:650px) {
        grid-template-columns: repeat(auto-fit, minmax(8rem,1fr));
    }
`;

const Card = styled.div`
    border:1px solid grey !important;
    padding: 0.2rem;
    min-height:20rem;
    border-radius:5px;
    overflow:hidden;
    position:relative;
     /* responsive for mobiles */
     @media (max-width:650px) {
        height:9rem;
     }
    &:hover{
        border:1px solid black !important;
        opacity: 0.9;
    }
    img{
        height: 245px;
        border-radius:0.8rem;
        left:0;
        width:100%;
        @media (max-width:650px) {
            height:200px;
            border-radius:5px;
        }
    }
    span{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size:medium;
    }
    p{
        font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    }
`;
export default Cart
