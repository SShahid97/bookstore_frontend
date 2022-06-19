import React, { useEffect, useState } from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {Cart_Service,Stock_Service} from '../services/Service';
import {cartService,mobileMenuService} from "../services/LocalService";
import Loader from '../components/Loader';
import PopUp from "../components/PopUp";
import {BiRefresh} from "react-icons/bi";
import {FaPlus,FaMinus} from "react-icons/fa";

function Cart() {
    // let i=1;
    let params = useParams();
    let navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount]= useState(0);
    const [emptyCart, setEmptyCart] = useState(false);
    const [quantity, setQuantity] = useState([]);
    const [stockArray, setStockArray] = useState([]);
    const [showLoader, setShowLoader] = useState(false); 
    const [deliveryCharges, setDeliveryCharges] = useState(50); 
    const [messageSuccess, setMessageSuccess] = useState("");
    const [bookDummyImage, setBookDummyImage]= useState(['dummy_book_img.png']);
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
    const hanldeCheckout = (userId)=>{
        // console.log(userId);
        navigate("/checkout/billing");
    }
    // const handleQuantity = (e, index)=>{
    //     e.preventDefault();
    //     const newQtyArr = [...quantity];
    //     newQtyArr[index] = e.target.value;
    //     setQuantity(newQtyArr)    
    // }
    
    const handleDecrement = (index) =>{
        // console.log(index,"minus")
        if(quantity[index]>1){
            const newQtyArr = [...quantity];
            newQtyArr[index] = newQtyArr[index]-1;
            console.log(newQtyArr[index])
			setQuantity(newQtyArr);
        }
    }
    const handleIncrement = (index) =>{
        if(quantity[index]<stockArray[index]){
			const newQtyArr = [...quantity];
            newQtyArr[index] = newQtyArr[index]+1;
            console.log(newQtyArr[index])
			setQuantity(newQtyArr);

        }
        
    }
    // Update quatity
    const updateQty = async(item_id,i)=>{
        console.log(item_id, i);
        let user = JSON.parse(localStorage.getItem('user'));
        try{
            const data = await Cart_Service.updataCartItem(item_id, user.token, {quantity:quantity[i]});
            getCartItems();
            if(data){
                // alert("Quantity updated");
                setMessageSuccess("Quantity updated");
                setTimeout(()=>{
                    setMessageSuccess("");
                },5000);
            }
        }catch(err){
            setMessageSuccess("");
            console.log("There was some error: ",err)
        }

    }

    const getCartItems = async()=>{
        let user = JSON.parse(localStorage.getItem('user'));
        try{
            const response = await Cart_Service.getCartItems(params.id, user.token);
            if(response.status === 200){
                setShowLoader(false);
                const cartResponse = await response.json(); 
                // console.log("CART: ",cartResponse);
                let stockArr=[];
                cartResponse.forEach(async(item)=>{
                    let response = await Stock_Service.getStockDetails(item.book.book_code);
                    if(response.status === 200){
                        const stock=await response.json();
                        stockArr.push(stock.count_in_stock);
                    }
                });
                // console.log("Stock:",stockArr);
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
                // alert(data.message);
                setMessageSuccess(data.message);
                setTimeout(()=>{
                    setMessageSuccess("");
                },5000);
                getCartItems();
            }catch(err){
                console.log("There was some error: ",err)
            }  
    }
    
    
    const handleBack =()=>{
        navigate(-2);
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
            {messageSuccess !== "" && (
                <PopUp messageSuccess={messageSuccess}/> 
            )} 
            <h3 className='cart-heading'>Your Cart Items</h3>
            <div className='cart-div-inner'>
                <div className='cart-items-div'>
                    <div className='cart-items-heading'>
                        <div className='width-15 image-heading'>
                            Book
                        </div>
                        <div className='width-30 name-heading'>
                            Name
                        </div>
                        <div className='width-25 qty-heading'>
                            Qty
                        </div>
                        <div className='width-15 price-heading'>
                            Price
                        </div> 
                        <div className='width-15 amount-heading'>
                            Amount
                        </div>
                        <div className='width-15 remove-heading'>
                            Remove
                        </div>
                    </div>  
                    <div className='cart-items'>
                        { cartItems.map((item,index) => {     
                        return (
                            <div className='cart-item' key={item._id}>
                                <div className='image-mobile'>
                                <div className='width-15 book_image'>
                                    {(item.book.discount>0) && (
                                        <span className='discount-badge' >{Math.floor(item.book.discount*100)}%</span>
                                    )}
                                   {item.book.book_image &&  <img src={require(`../../public/assets/images/${item.book.book_image}`)} alt={item.book.book_name} />}
                                   {!item.book.book_image &&  <img src={require(`../../public/assets/images/${bookDummyImage}`)} alt={item.book.book_name} />}
                                </div>
                                </div>
                                <div className='details-mobile'>
                                    <div className='width-30  book_name'>
                                        {item.book.book_name}
                                    </div>
                                    <div className='width-25 book_qty'>
                                        {quantity[index]>0 && ( 
                                        <div className='qty'>
                                            {/* <input className='qty-input' type="number" step={1} min={1} max={stockArray[index]} value={quantity[index]} name="quantity"  onChange={(e)=>handleQuantity(e,index)}/> */}
                                            <button  className = "btn-qty btn-quantity-minus" onClick={()=>handleDecrement(index)}>
                                                <FaMinus/>
                                            </button>
                                            <input min={1} max={stockArray[index]} type="text" disabled name="quantity"  value={quantity[index]}/>
                                            <button className = "btn-qty btn-quantity-plus"  onClick={()=>handleIncrement(index)}>
                                                <FaPlus/>
                                            </button>
                                            <button className='qty-btn' title='Update' onClick={() =>updateQty(item._id,index) }><BiRefresh/></button> 
                                        </div> 
                                        )}    
                                        {quantity[index]===0 && (
                                            <p style={{color:'#db0c0c', marginTop:'15px', fontSize:'14px'}}>Out of Stock!</p>
                                        )}
                                    </div>
                                    <div className='width-15 book_price'>
                                      <span className='price-sub'>Price:</span> &#8377;{(item.price-item.price*item.book.discount).toFixed(2)}
                                      {item.book.discount > 0 && <span className='old-price'> &#8377;{item.price}</span>}
                                    </div>
                                    
                                    <div className='width-15 book_amount'>
                                     <span className='price-sub'>Subtotal:</span> &#8377;{item.quantity*((item.price-item.price*item.book.discount).toFixed(2))}
                                    </div>
                                    <div className='width-15 remove-item'>
                                        <button className='remove-item-btn' onClick={() => handleRemoveItem(item._id,index) }>Remove</button> 
                                    </div>
                                </div>        
                            </div>
                        )})
                        }
                        <div className='amt-charges'>
                            Delivery Charges: &#8377;{deliveryCharges}
                        </div>
                        <div className='amt-total'>
                            <strong>Total Amount: </strong><b>&#8377;{totalAmount+deliveryCharges}</b>
                        </div>
                    </div>
                 
                </div>    
        
                {/* Buttons */}
                <div className='checkout-btns'>
                    <button className='btns' onClick={handleBack}>Continue Shopping</button>
                    <button className='btns' onClick={()=> hanldeCheckout(cartItems[0].user_id)}>Proceed to Checkout</button>
                </div>
            </div>
            </>
        )}
      </CartCard>
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
            margin-top: -10px;
    }
    
    .qty{
        margin-top:5px;
        margin-bottom: 5px;
        input{
            height: 2.27rem;
            width: 2rem;
            text-align: center;
            color: teal;
            font-size: 19px;
            border-top: 1px solid #bbbbbb;
            border-bottom: 1px solid #bbbbbb;
            border-left: none;
            border-right: none;
        }
        .btn-qty{
            cursor: pointer;
            border: 1px solid #bbbbbb;
            width:2rem;
            padding: 6px;
            padding-top: 10px;
            border: 1px solid #bbbbbb;
            background: #dfdfdfb3;
        }
        .btn-quantity-minus{
            border-radius: 7px 0 0 7px;
        }
        .btn-quantity-plus{
            border-radius:0 7px 7px 0;
        }
    }
    .cart-items-div{

    }
    .cart-items-heading{
        display: flex;
        width: 100%;
        padding: 10px;
        border-bottom: 2px solid grey;
        justify-content: space-between;
        font-size: 1rem;
        font-weight: 700;
        @media (max-width:650px){
            display: none;
        }
    }
    .cart-items{
        display: flex;
        width: 100%;
        flex-direction: column;
    }
    .cart-item{
        display: flex;
        justify-content: space-between;
        width: 100%;
        border-bottom: 1px solid grey;
        padding: 5px;
    }
    .width-15{
        width:15%;
    }
    .width-30{
        width:30%;
    }
    .width-25{
        width:25%;
    }
    .old-price{
        text-decoration: line-through;
        opacity: 0.8;
        color: #b10505;
        font-size: 0.9rem;
        @media (max-width:650px){
            font-size: 0.8rem;
        }
    }
    .amt-total{
        font-size: 1.1rem;
        margin-top: 5px;
        @media (max-width:650px){
            font-size: 1rem;
        }
    }
    .amt-charges{
        font-weight: 500;
        @media (max-width:650px){
            margin-top: 5px;
        }
    }
    .image-mobile{
        display: flex;
        width: 15%;
        @media (max-width:650px){
            width:32%;
        }
    }
    .book_image{
        @media (max-width:650px){
            width:100%;
        }
    }
    .book_name{
        @media (max-width:650px){
            width: 100%;
            text-align: left;
            padding-left: 10px;
        }
    }
    .details-mobile{
        display: flex;
        align-items: center;
        width: 85%;
        font-weight: 500;
        @media (max-width:650px){
            width: 68%;
            flex-direction: row;
            flex-wrap: wrap;
            font-size: 0.9rem;
        }
    }

    .book_qty{
        text-align: -webkit-center;
        @media (max-width:650px){
            width: 100%;
            transform: scale(0.8);
        }
    }
    .book_price{
        @media (max-width:650px){
            width: 42%;
            font-weight: 700;
            text-align: left;
            padding-left: 10px;
            font-size: 0.8rem;
        }
    }
    .book_amount{
        @media (max-width:650px){
            font-weight: 700;
            width: 58%;
            text-align: left;
            padding-left: 10px;
            font-size: 0.8rem;
        }
    }
    .cart-items-div img{
        height:150px;
        width:100px;
        @media(max-width:650px){
            height:140px;
            width:100px;
        }
    }
    .remove-item-btn{
        border:1px solid red;
        color:red;
        padding: 8px 10px;
        border-radius: 3px;
        font-size: 1rem;
        @media (max-width:650px){
            padding: 5px 6px;
            font-size: 0.9rem;
            width: 90%;
        }
    }

    .remove-item-btn:hover{
        background:red;
        color:white;
        cursor: pointer;
    }
    .remove-item{
        margin-top: 10px;
        @media (max-width:650px){
            width:100%;
            margin-top:0px;
        }
    }
    .price-sub{
        @media (min-width:650px){
            display:none;
        }
    }
    .checkout-btns{
        margin-top:2rem;
        display: flex;
        justify-content: space-between;
        @media (max-width:650px){
            width: 95%;
            margin: 0 auto;
            margin-top: 2rem;
            margin-bottom: 1rem;
        }
    }

    .checkout-btns .btns{
        border:1px solid blue;
        color:blue;
        padding: 10px 12px;
        border-radius: 3px;
        font-size: 1rem;
        margin-bottom: 0px;
        @media (max-width:650px){
            padding: 5px 6px;
            border-radius: 3px;
            font-size: 0.8rem;
        }
    }
    .checkout-btns .btns:hover{
        background:blue;
        color:white;
        cursor: pointer;
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
        padding:15px;
        @media (max-width:650px){
            padding:5px;
        }
        @media (max-width:360px){
            padding:2px;
        }
    }
    
`;


export default Cart
