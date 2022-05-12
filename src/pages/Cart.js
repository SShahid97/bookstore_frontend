import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {Cart_Service,Stock_Service} from '../services/Service';
import {cartService,mobileMenuService} from "../services/LocalService";
import Loader from '../components/Loader';


function Cart() {
    let i=1;
    let params = useParams();
    let navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount]= useState(0);
    const [emptyCart, setEmptyCart] = useState(false);
    const [quantity, setQuantity] = useState([]);
    const [stockArray, setStockArray] = useState([]);
    const [showLoader, setShowLoader] = useState(false); 
    const [deliveryCharges, setDeliveryCharges] = useState(50); 
    useEffect(()=>{
        setShowLoader(true);
        mobileMenuService.setMobileMenuIndicies(null);
        getCartItems();
        // let area_code_details = JSON.parse(localStorage.getItem("area_code_details"));
        // if(area_code_details){
        //     console.log(area_code_details);
        //     setAreaCodeDetails(area_code_details);
        // }
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
            const response = await Cart_Service.getCartItems(params.id, user.token);
            if(response.status === 200){
                setShowLoader(false);
                const cartResponse = await response.json(); 
                console.log("CART: ",cartResponse);
                let stockArr=[];
                cartResponse.forEach(async(item)=>{
                    let stock = await Stock_Service.getStockDetails(item.book._id);
                    stockArr.push(stock.count_in_stock);
                });
                console.log("Stock:",stockArr);
                setStockArray(stockArr);
                localStorage.setItem("cart",JSON.stringify(cartResponse));

                let qty=[];
                cartResponse.forEach(item =>{
                    qty.push(item.quantity);
                });
                setQuantity(qty);
                updateCartItems(cartResponse.length);
                // localStorage.setItem("noOfCartItems",JSON.stringify(cartResponse.length));
                // console.log(cartResponse);
                setCartItems(cartResponse);
                calculateTotalAmount(cartResponse);
            }else if(response.status === 204){
                setShowLoader(false);
                setEmptyCart(true);
                console.log(response.statusText)
            }else if(response.status === 404 ){
                setShowLoader(false);
                console.log("Bad Request");
            }
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
            amount+=(item.quantity*(item.price-(item.price*item.book.discount)));
        });
        setTotalAmount(amount);
    }

    
    // Remove Item from cart
    const handleRemoveItem = async(id,index)=>{
        const confirmation = window.confirm("Do you want to deleted this item?");
        if(confirmation){
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
        }else{
            console.log("cancelled")
        }     
    }
    
    // Update quatity
    const updateQty = async(item_id,i)=>{
        console.log(item_id, i);
        let user = JSON.parse(localStorage.getItem('user'));
        try{
            const data = await Cart_Service.updataCartItem(item_id, user.token, {quantity:quantity[i]});
            getCartItems();
            if(data)
                alert("Quantity updated");
        }catch(err){
            console.log("There was some error: ",err)
        }
        
    }
    const hanldeCheckout = (userId)=>{
        // console.log(userId);
        navigate("/checkout/billing");
    }
    return (
    <>   
    {showLoader && (<Loader/>) } 
    {!showLoader && (
        <>
      <CartCard  >   
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
                            <td>
                            {(item.book.discount>0) && (
                                <span className='discount-badge' >{item.book.discount*100}%</span>
                            )}
                                <img src={require(`../../public/assets/images/${item.book.book_image}`)} alt={item.book.book_name} />
                            </td>
                            <td>{item.book.book_name}</td>
                            <td>
                                {quantity[index]} 
                                {quantity[index]>0 && ( 
                                <div className='qty'>
                                    <input className='qty-input' type="number" step={1} min={1} max={stockArray[index]} value={quantity[index]} name="quantity"  onChange={(e)=>handleQuantity(e,index)}/>
                                    <button className='qty-btn' onClick={() =>updateQty(item._id,index) }>update</button> 
                                </div> 
                                )}    
                                {quantity[index]===0 && (
                                    <p style={{color:'#db0c0c', marginTop:'15px', fontSize:'14px'}}>Out of Stock!</p>
                                )}
                            </td>
                            <td>&#8377;{item.price-item.price*item.book.discount}</td>
                            <td>&#8377;{item.quantity*(item.price-item.price*item.book.discount)}</td>
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
                            <td>&#8377;{deliveryCharges}</td>
                            <td></td> 
                            </tr>
                        </tbody>
                    </table>
                <div className='amount'>
                    <strong>Total Amount: </strong><b>&#8377;{totalAmount+deliveryCharges}</b>
                </div>
                </div>    
        
                {/* Buttons */}
                <div className='checkout-btns'>
                    <button className='btns'>Continue Shopping</button>
                    <button className='btns' onClick={()=> hanldeCheckout(cartItems[0].user_id)}>Checkout</button>
                </div>
            </div>
            </>
        )}
      </CartCard>
      <CartCardMobile>
        {emptyCart && (
            <div style={{padding:'10px'}}>
                <h3 style={{color:'red'}} >Your Cart is Empty</h3>
            </div>
        )}
         {!emptyCart && (
            <>
            <h4 className='cart-heading'>Your Cart Items</h4>
          {cartItems.map((item,index) => {     
            return (
              <div key={item._id} className='item'>
                <div className='left'>
                    <div className='img-badge'>
                        {(item.book.discount>0) && (
                            <span className='discount-badge' >{item.book.discount*100}%</span>
                        )}
                        <img src={require(`../../public/assets/images/${item.book.book_image}`)} alt={item.book.book_name} />
                    </div>
                    <div className='qty-mobile'>
                        {quantity[index]>0 && ( 
                            <div className='qty'>
                                <input className='qty-input' type="number" step={1} min={1} max={stockArray[index]} value={quantity[index]} name="quantity"  onChange={(e)=>handleQuantity(e,index)}/>
                                <button className='qty-btn' onClick={() =>updateQty(item._id,index) }>update</button> 
                            </div> 
                        )}    
                        {quantity[index]===0 && (
                        <p style={{color:'#db0c0c', marginTop:'15px', fontSize:'14px'}}>Out of Stock!</p>
                        )}    
                    </div>
                </div>
                <div className='right'>
                   <div className='detailsBook'>
                        <p className='book-name'>{item.book.book_name}</p>
                        <p className='price'><strong>&#8377;{item.price-item.price*item.book.discount}</strong></p>
                   </div>
                   <div className='delete-item'>
                        <button className='delete-item-btn' onClick={() => handleRemoveItem(item._id,index) }>Remove</button> 
                   </div>
                </div>
             </div>  
             
            )}
          
          )}
        </>
        )}           
      </CartCardMobile>
      </>
      )}
      </> 
  )
}

const CartCard = styled.div`
    width: 60%;
    background-color: #f7f7f7;
    height: auto;
    margin: auto;
    box-shadow: 1px 2px 2px 1px #00000036;
    margin-top: 5px;
    text-align: center;
    margin-bottom: 1rem;

    @media (max-width:1100px) {
            width: 90%;
    }
    @media (max-width:850px) {
            width: 95%;
            margin-top: -20px;
    }
    @media (max-width:650px){
            display:none;
    }
    
    table {
        width: 100%;
        height: auto;
        border-collapse: collapse;
        font-weight: 700;
        @media (max-width:650px) {
            font-size: 0.7rem !important;
            /* width:100; */
            display: none;
        }
    }
    table thead{
        font-size: 1rem !important;
        @media (max-width:650px) {
            font-size: 0.7rem !important;
        }
    }
        
    th {
        border-bottom: 2px solid rgb(48, 48, 48);
    }
    tr{
        border-bottom: 1px solid grey;
    }
    tr td{
        padding: 5px;
        max-width: 120px;
        @media (max-wdith:650px){
            padding:3px;
            max-width: 90px;
        }
    }
    

    .discount-badge{
        position: absolute;
        background: #e30606;
        padding: 5px 3px;
        border-radius: 50%;
        color: white;
        font-size: 0.9rem;
        font-weight: 500;
        @media (max-width:650px){
            font-size: 0.7rem;
        }
    }
    .cart-heading{
        padding: 10px;
        background: #8080808f;
        color: white;
        font-weight: 600;
        @media (max-width:650px){
            padding: 5px;
            font-size: 1rem;
        }
    }
    .cart-div-inner{
        padding:30px;
        @media (max-width:650px){
            padding:5px;
        }
        @media (max-width:360px){
            padding:2px;
        }
    }
    .cart-items-div{
        text-align: left;
        @media (max-width:650px){
            border-radius: 3px;
        } 
    }

    .cart-items-div img{
        height:150px;
        width:100px;
        @media(max-width:650px){
            height:110px;
            width:90px;
        }
    }
`;

const CartCardMobile = styled.div`
    display: none;
    @media (max-width:650px){
        display: block;
        width: 98%;
        margin: 0 auto;
        margin-top: -20px;
    }
    .item{
        display:flex;
        flex-direction: row;
        margin-top:10px;
        box-shadow: 1px 2px 2px 1px #00000036;
        border:1px solid lightgrey;
    }
    .left{
        width: 40%;
        display: flex;
        flex-direction: column;
    }
    .detailsBook .book-name{
        font-size:0.8rem;
    }
    .detailsBook .price{
        font-size:0.9rem;
    }
    .right{
        width:60%;
        display: flex;
        flex-direction: column;
    }
    .delete-item{
        margin-top:5px;
    }
    .delete-item-btn{
        padding: 4px 6px;
        font-size: 0.9rem;
        background-color: white;
        border:1px solid red;
        color:red;
        border-radius: 2px;
    }

    .delete-item-btn:hover{
        background:red;
        color:white;
        cursor: pointer;
    }
    .qty-mobile{
        margin-top:5px;
    }
    .img-badge img{
        width: 110px;
        height: 120px
    }
    .discount-badge{
        position: absolute;
        background: #e30606;
        padding: 5px 3px;
        border-radius: 50%;
        color: white;
        font-size: 0.9rem;
        font-weight: 500;
        @media (max-width:650px){
            font-size: 0.7rem;
        }
    }

    .cart-heading{
        padding: 5px;
        font-size: 1rem;
        background: #8080808f;
        color: white;
        font-weight: 600;
        text-align: center;
       
    }
`;
export default Cart
