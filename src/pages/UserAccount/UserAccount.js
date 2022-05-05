import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import OrderHistory from '../../components/OrderHistory';
import {Address_Service, Order_Service} from "../../services/Service";

function UserAccount() {
  const [user, setUser]= useState({});
  const [userAddress, setUserAddress] = useState({});
  const [orderHistory, setOrderHistory] = useState([]);
    useEffect(()=>{
        let curr_user = JSON.parse(localStorage.getItem('user'));
        setUser(curr_user);
        getUserAddress(curr_user.token, curr_user._id);
        getOrderHistory(curr_user.token, curr_user._id);
    },[]);

    const getUserAddress = async(token,userId)=>{
      const returnedAddress = await Address_Service.getUserAddress(token,userId);
      console.log(returnedAddress);
      setUserAddress(returnedAddress[0]);
    }
    const getOrderHistory = async (token, userId)=>{
      const returnedHistory = await Order_Service.getOrderHistory(token,userId);
      console.log(returnedHistory);
      setOrderHistory(returnedHistory);
    }
  return (
    <AccountOuter>
      <p className='account-heading'>Hello <strong>{user.name}</strong>, Welcome to your Account Dashboard.</p>
      <hr/>
      <AccountInner>
          <Card>
              <h4 className='card-headings'>User Info</h4>
              <div className='details'>
                <p><strong>Name: </strong> {user.name}</p>
                <p><strong>email: </strong> {user.email}</p>
                <p><strong>Contact: </strong> {userAddress.contact}</p>
              </div>
          </Card>
          <Card>
              <h4 className='card-headings'>User Address</h4>
              <div className='details'>
                <p><strong>Country: </strong> {userAddress.country}</p>
                <p><strong>State: </strong> {userAddress.state}</p>
                <p><strong>City: </strong> {userAddress.city}</p>
                <p><strong>Pincode: </strong> {userAddress.pincode}</p>
                <p><strong>Address: </strong> {userAddress.address}</p>
              </div>
          </Card>
      </AccountInner>
      <OrderHistory orderHistory={orderHistory}/>
    </AccountOuter>
  )
}


const AccountOuter = styled.div`
    /* display: flex; */
    background-color: #e9e9e9;
    width:80%;
    margin:0 auto;
    margin-bottom: 2rem;
    height: auto;
    box-shadow: 2px 4px 4px 1px #0000007a;
    text-align: center;
    padding-bottom: 2rem;
    padding-top: 2rem;
    padding: auto auto;
    
    .account-heading{
        margin-bottom:0.8rem ;
        font-size: 1.2rem;
    }
    @media (max-width:850px){
      width:90%;
    }
    @media (max-width:650px){
        width: 96%;
    }
`;
const AccountInner = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width:90%;
    margin:0 auto;
    margin-top:1rem;
    @media (max-width:1080px){
        justify-content: flex-start;
    }
    @media (max-width:950px){
        justify-content: flex-start;
        width:95%;
    }
    @media (max-width:650px){
        flex-direction: column;
    }
`;

const Card = styled.div`
    color: black;
    background: white;
    padding: 0.8rem;
    min-height:13rem;
    min-width:17rem;
    border-radius:5px;
    overflow:hidden;
    position:relative;
    margin-right:10px;
    
    .details{
      text-align: left;
      margin-top: 0.8rem;
    }
    .card-headings{
      border-bottom: 2px solid black;
    }
    @media (max-width:850px){
        margin-bottom:10px;
    }
    
`;

export default UserAccount
