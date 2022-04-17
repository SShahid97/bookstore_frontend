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
      <CartCard >
        {emptyCart && (
                <div style={{padding:'30px'}}>
                    <h3 style={{color:'red'}} >Your Cart is Empty</h3>
                </div>
        )}  
        {!emptyCart && (
            <>
            <h3 className='cart-heading'>Your Cart Items</h3>
            <div className='cart-div-inner'>
                <div className='cart-items-div'>  
                    <table>
                        <thead>
                        <tr>
                            <th>S.No.</th>
                            <th>Book</th>
                            <th>Name</th>
                            <th>Qty</th>
                            <th>Price(in &#8377;)</th>
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
                            <img src={require(`../../public/assets/images/${item.book.book_image}`)} alt={item.book.book_name} />
                            </td>
                            <td>{item.book.book_name}</td>
                            <td>
                                {quantity[index]}  
                                <div className='qty'>
                                    <input className='qty-input' type="number" min={1} value={quantity[index]} name="quantity"  onChange={(e)=>handleQuantity(e,index)}/>
                                    <button className='qty-btn' onClick={() =>updateQty(item._id,index) }>update</button> 
                                </div> 
                            </td>
                            <td>&#8377;{item.price}</td>
                            <td>&#8377;{item.quantity*item.price}</td>
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
                            <td>&#8377;100</td>
                            <td></td> 
                            </tr>
                        </tbody>
                    </table>
                <div className='amount'>
                    <strong>Total Amount: </strong><b>&#8377;{totalAmount+100}</b>
                </div>
                </div>    
        
                {/* Buttons */}
                <div className='checkout-btns'>
                    <button className='btns'>Continue Shopping</button>
                    <button className='btns'>Checkout</button>
                </div>
            </div>
            </>
        )}
      </CartCard>
  )
}

const CartCard = styled.div`
    width: 80%;
    background-color: #f7f7f7;
    height: auto;
    margin: auto;
    box-shadow: 1px 2px 2px 1px #00000036;
    margin-top: 5px;
    text-align: center;
    @media (max-width:850px) {
            width: 100%;
    }
    .cart-heading{
        padding: 10px;
        background: #8080808f;
        color: white;
        font-weight: 600;
    }
    .cart-div-inner{
        padding:30px;
    }
    .cart-items-div{
        text-align: left;
        @media (max-width:620px){
            overflow-x: scroll !important;
            width: 525px !important;
            display: block !important;
        } 
        @media (max-width:590px){
            overflow-x: scroll !important;
            width: 400px !important;
            display: block !important;
        }
        @media (max-width:440px){
            overflow-x: scroll !important;
            width: 300px !important;
            display: block !important;
        }  
    }
    .cart-items-div img{
        height:150px;
        width:100px;
    }
`;
export default Cart
