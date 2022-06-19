import React, { useState,useEffect, useRef } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import styled from "styled-components";
import {FaCheckCircle} from "react-icons/fa";
import Loader from '../../components/Loader';
import {Order_Service, Address_Service, Cart_Service} from "../../services/Service";
import {cartService} from "../../services/LocalService";
import emailjs from "@emailjs/browser";

function Confirmation({paymentStatus, paymentMethod }) {
    const [orderId, setOrderId] = useState("");
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [user,setUser] = useState({});
    const [errorInMail, setErrorInMail] = useState(false);
    // const [alreadySavedAddress, setAlreadySavedAddress] = useState({});
    let navigate = useNavigate();
    useEffect(()=>{
        let curr_user = JSON.parse(localStorage.getItem("user"));
        if(curr_user)
            setUser(curr_user);
        else{
            alert("There was some error!");
            return;
        }

        let custInfo = JSON.parse(localStorage.getItem("customerInfo"));
        if(custInfo)
            addCustomerAddress(custInfo,curr_user);
        else{
            // alert("There was some error!");
            return;
        } 
        
        let custOrder = JSON.parse(localStorage.getItem("cart"));
        if(custOrder)
            addCustomerOrder(custOrder,curr_user);
        else{
            // alert("There was some error!");
            return;
        }   
        // if(!custInfo || !custOrder){
        //     navigate("/");
        //     return;
        // }
        
    },[]);

    const addCustomerAddress = async(info,curr_user)=>{
        // Check if address already exists 
        let isAddress;
        const response = await Address_Service.getUserAddress(curr_user.token,curr_user._id);
        if(response.status === 200){
            // const addressReturned = await response.json();
            // console.log("Existed Address:", addressReturned);
            // setAlreadySavedAddress(addressReturned);
            isAddress = true;
        }else if (response.status === 204){
            // console.log("Address did not existed");
            isAddress = false;
        }
        //if exists then update older one 
        // if(isAddress){
        //     const response = await Address_Service.deleteAddress(curr_user.token, addressReturned._id);
        //     if(response.status === 200){
        //         const deletedAddress = await response.json();
        //         console.log("Deleted Address:", deletedAddress.message)
        //     }
        // }
        if (isAddress === true){
            //if exists then update older one
            let addressUpdatedObj = {
                contact:info.contact,
                country:info.country,
                state:info.state,
                city:info.city,
                pincode:info.pincode,
                address:info.address
            }
            // console.log("Updated address:(from local)",addressUpdatedObj);
            //change existing address
            const response =await Address_Service.updateAddress(curr_user.token,info._id,addressUpdatedObj);
            if(response.status===200){
                // const updatedAddress = await response.json();
                // console.log("Updated Address ",updatedAddress);     
            }else if(response.status===204){
                // console.log("Address not updated");
            }else if(response.status===400){
                console.log("There was some error");
            }
        }else if(isAddress === false){
             //if not exists then add new address
            let addressObj = {
                user_id: curr_user._id,
                contact: info.contact,
                country: info.country,
                state: info.state,
                city:info.city,
                pincode:info.pincode,
                address: info.address
            }
            // console.log(address);
            const response = await Address_Service.addAddress(curr_user.token,addressObj);
            if(response.status === 201){
                // const savedAddress = await response.json();
                // console.log(savedAddress);
            }else if(response.status===204){
                // console.log("Address not added");
            }else if(response.status===400){
                console.log("There was some");
            }
        }
    }

    const addCustomerOrder = async (order,curr_user)=>{
        // console.log(order);
        let orderArr = [];
        let shipping = 50;
        order.forEach((item)=>{
            orderArr.push({
                book_id:item.book._id,
                price:(item.price - (item.price*item.book.discount)).toFixed(2),   //discounted Prcie
                quantity:item.quantity,
                discount:item.book.discount,

            });
        });
        let totalAmount=0;
        orderArr.forEach((item)=>{
            totalAmount+= item.price*item.quantity;
        })
        let deliveryStatus = "Not Delivered";
        let orderObj = {
            user_id: curr_user._id,
            shipping_charges:shipping,
            total_amount:(totalAmount+shipping),
            payment_status:paymentStatus,
            payment_method:paymentMethod,
            delivery_status:deliveryStatus,
            order:orderArr
        }
        // console.log(orderObj);
         try{
            const response = await Order_Service.addOrder(curr_user.token,orderObj);
            if(response.status === 201){
                const savedOrder = await response.json(); 
                // console.log(savedOrder._id);
                setOrderId(savedOrder._id);
                
                // deleting cart
                const deleted = await Cart_Service.deleteCart(curr_user.token, curr_user._id);
                if(deleted){
                    // console.log(deleted);
                }
                cartService.updateCartItems(0);
                let custAddress = JSON.parse(localStorage.getItem("customerInfo"));
                // console.log(custAddress); 
                let CustomerOrderInfo = {
                    customerAddress:custAddress,
                    orderInfo:savedOrder
                }
                // console.log(CustomerOrderInfo);
                // mail starts here
                emailjs.send("service_2rgz7hq", "template_j3u9mxn", CustomerOrderInfo, "3DRAqhnj6rTu4Rzmb").then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    setErrorInMail(false);
                 }, function(error) {
                     setErrorInMail(true);
                    console.log('FAILED...', error);
                 });
                // Mail Ends Here

                localStorage.removeItem("cart");
                cartService.updateCartItems(0);
                localStorage.removeItem("customerInfo");
                setIsConfirmed(true);
                // setConfirmed(true)
            }
        }catch(err){
            // console.log(err);
            alert("Sorry! There was some error while placing the order: ");
        }
    }
  return (
    <Wrapper >
        <>
        {!isConfirmed  && (<Loader/>)}
        {isConfirmed && (
            <>
            <OrderConfirmation > 
                <FaCheckCircle className='check'/>
                <h3>{user.name}, Thanks for Shopping with us!</h3>
                <p style={{marginTop:'1rem'}}>Your Order with the Order ID <strong>{orderId}</strong> has been successfully placed</p>
                {errorInMail?(
                    <p style={{marginTop:'0.7rem'}}>Confirmation email could not be sent, but you can save your Order ID for future reference.</p>
                ):(
                    <p style={{marginTop:'0.7rem'}}>A Confirmation email has been sent to your mail box.</p> 
                )}
                 <div className='view-order-div'>
                    <Link to={"/user/orders"}>
                        View Order
                    </Link>
                </div>  
            </OrderConfirmation>
               
            </>
        )}
        </>
    </Wrapper>
  )
}

const Wrapper = styled.div`
    width:50%;
    margin:0 auto;
    background-color: #f7f7f7;
    height: auto;
    margin: auto;
    box-shadow: 6px 7px 7px 1px #00000036;
    margin-top: 5px;
    padding:10px;
    @media (max-width:650px){
        width:90%;
    }
    .view-order-div{
        width:110px;
        display:inline-block;
        margin-top: 20px;
        padding:5px 12px;
        border-radius: 3px;
        border: 1px solid grey;
        background: whitesmoke;
        color:black;
        cursor: pointer;
        a{
            font-weight: 500;
        }
        &:hover{
            a{
                color:white;
            }
            border:1px solid #f7f7f7;
            background: linear-gradient(to right, #f27121, #e94057);
        }
    }
`;
const OrderConfirmation = styled.div`
    padding:10px;
    text-align: center;
    .check{
        font-size: 6rem;  
        color:green;
    }
    
    h3{
        @media (max-width:650px){
            font-size: 0.9rem;
        }
    }
`;

export default Confirmation
