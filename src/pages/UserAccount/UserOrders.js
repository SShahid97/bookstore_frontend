import React, {useEffect, useState} from 'react'
import styled from "styled-components";
import {Order_Service} from "../../services/Service";
import Loader from "../../components/Loader";
import { useNavigate } from 'react-router-dom';
import {mobileMenuService} from "../../services/LocalService";


function UserOrders() {
  const [orderHistory, setOrderHistory] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  let navigate = useNavigate();
  useEffect(()=>{
    setShowLoader(true);
    mobileMenuService.setMobileMenuIndicies(null);
    let curr_user = JSON.parse(localStorage.getItem('user'));
    if(curr_user){
      getOrderHistory(curr_user.token, curr_user._id);
    }else{
      navigate("/")
    }
  },[]);
  const getOrderHistory = async (token, userId)=>{
    const response = await Order_Service.getOrderHistory(token,userId);
    if(response.status === 200){
      setShowLoader(false); 
      const returnedHistory = await response.json();
      console.log(returnedHistory);
      // Date.parse("2019-01-01T12:30:00.000Z")
      returnedHistory.forEach((item)=>{
        const dateFormat = new Date(item.date);
        const dateOnly = dateFormat.toDateString();  //e,g Wed May 11 2022
        const timeOnly = dateFormat.toLocaleTimeString();  // e,g 3:30:03 PM
        item.date = dateOnly;
        item.time = timeOnly;
      });
      setOrderHistory(returnedHistory);
    }else if (response.status === 204){
      setShowLoader(false);
      setOrderHistory(null);
    }else if (response.status === 400){
      console.log("Bad Request");
    }
  }
  return (
    <>
    {showLoader && (<Loader/>)}
    {!showLoader && (
      <OrderHistOuter>
         <h3 className='order-main-heading'>Your Orders</h3>
        <OrderHistInner>
        {orderHistory && orderHistory.map((orderInfo,index)=>{
        return (
          <div className='orders' key={orderInfo._id} >

            <div className='orderItems'>
              <div className='orderPlacedAt'>
                <span>Date: </span> &nbsp;{orderInfo.date}
                &nbsp;&nbsp;<span style={{fontSize:'12px',color: 'darkblue'}}>{orderInfo.time}</span>
              </div>
              {
                orderInfo.order.map((order)=>{
                  return (
                    <div key={order._id} className="individual-book">
                      <div className='book-details'>
                        <div className='book-image'>
                          <img src={require(`../../../public/assets/images/${order.book.book_image}`)} alt={order.book.book_name} />
                        </div>
                        <div className='book-description'>
                            <p><span>Book Name: </span>{order.book.book_name}</p>
                            <p><span>Book Author: </span>{order.book.book_author}</p>
                            <p><span>Quantity: </span>{order.quantity}</p>
                            <p><span>Price: </span>&#8377;{order.price} {order.discount>0 && <>&nbsp;&nbsp;(discount included)</>}</p> 
                            <p><span>Discount: </span>{order.discount*100}%</p>
                        </div>  
                      </div>
                      
                    </div>
                  ) 
                })
              }
                <div className='total-amt'>
                  <p >Total Amount: &#8377;{orderInfo.total_amount}</p>
                  <p >Delivery Status: Not Delivered!</p>
                </div>
              </div>
            </div>
          )
        })}
          </OrderHistInner>
          {!orderHistory && (
                <h4 className="no-history" >You have no order history.</h4>
            )}
      </OrderHistOuter>
    )}
    </>
  )
}
const OrderHistOuter = styled.div`
    color: black;
    background: white;
    width: 55%;
    margin:0 auto;
    border-radius:3px;
    position:relative;
    box-shadow: 5px 4px 5px grey;
    border:1px solid grey;
    margin-bottom: 1rem;
    @media (max-width:650px){
      width: 95%;
      margin-top: -20px;
      box-shadow:none;
      border:none;
    }
    @media (max-width:360px){
      width: 98%;
    }

    .no-history{
      padding-bottom: 10px;
      font-weight: 500;
      text-align: center;
    }
    .order-main-heading{
      text-align: center;
      color: white;
      background: grey;
      padding: 7px;
      @media (max-width:650px){
        padding: 2px;
        font-size: 1rem;
        width: 95%;
        margin: 0 auto;
        box-shadow: 5px 4px 5px grey;
      }
    }
    
    
`;


const OrderHistInner = styled.div`
  max-height:90vh;
  overflow-y: scroll;
  margin-bottom: 1rem;
  @media (max-width:650px){
    font-size: 0.9rem;
    max-height:100%;
    overflow-y:hidden;
  }
  @media (max-width:360px){
    font-size: 0.8rem;
  }
  .orders{
      width:100%;
      padding:8px;
      display:flex;
      flex-wrap: wrap;
      @media (max-width:650px){
        padding: 0px;
        padding-top: 3px;
        margin-bottom: 1rem;
      }
    }
    /* .orders-heading{
      width:100%;
      padding:8px;
      display:flex;
      flex-wrap:wrap;
    } */
    .total-amt{
      padding: 5px;
      padding-left: 20px;
      font-weight: 500;
    }
    .individual-book{
      display: flex;
      margin-top: 5px;
      border-radius: 3px;
    }
    .book-description span{
      font-weight: 500;
    }
    .book-details{
      display: flex;
      width: 100%;
    }
    
    .book-image{
      width: 25%;
      padding: 5px;
      background: #f1f1f1;
      text-align: center;
      @media (max-width:360px){
        width: 30%;
        padding: 2px;
      }
    }
    .book-image img {
      width: 130px;
      height: 170px;
      @media (max-width:650px){
        width: 110px;
        height: 130px;
      }
      @media (max-width:360px){
        width: 90px;
        height: 100px;
        width: 100px;
        height: 100px;
        object-fit: contain;
      }
    }
    .book-description{
      width: 75%;
      padding: 5px;
      background: gainsboro;
      color:black;
      @media (max-width:360px){
        width: 70%;
        padding: 3px;
      }
    }
    .orderItems{
      width: 95%;
      margin: auto auto;
      border-radius: 3px;
      box-shadow: 5px 4px 5px grey;
    }
    .orderPlacedAt{
        background: lightgrey;
        padding: 5px;
        font-weight: 700;
        border-radius: 2px;
        padding-left: 20px;
    }

`;

export default UserOrders
