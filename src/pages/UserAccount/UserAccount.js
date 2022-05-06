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
      const response = await Address_Service.getUserAddress(token,userId);
      if(response.status === 200){
        const returnedAddress = await response.json();
        // console.log(returnedAddress);
        setUserAddress(returnedAddress[0]);
      }else if (response.status === 204){
        setUserAddress({});
      }else if (response.status === 400){
        console.log("Bad Request");
      }

    }
    const getOrderHistory = async (token, userId)=>{
      const response = await Order_Service.getOrderHistory(token,userId);
      if(response.status === 200){
        const returnedHistory = await response.json();
        console.log(returnedHistory);
        setOrderHistory(returnedHistory);
      }else if (response.status === 204){
        setOrderHistory([]);
      }else if (response.status === 400){
        console.log("Bad Request");
      }
      
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
              </div>
          </Card>
            <Card>
              {userAddress && (
                <>
                  <h4 className='card-headings'>User Address</h4>
                  <div className='details'>
                    <p><strong>Country: </strong> {userAddress.country}</p>
                    <p><strong>State: </strong> {userAddress.state}</p>
                    <p><strong>City: </strong> {userAddress.city}</p>
                    <p><strong>Contact: </strong> {userAddress.contact}</p>
                    <p><strong>Pincode: </strong> {userAddress.pincode}</p>
                    <p><strong>Address: </strong> {userAddress.address}</p>
                  </div>
                </>
              )}
              {!userAddress && (
                <div>
                  <h4 className='card-headings'>User Address</h4>
                  <h4 style={{marginTop:'1rem', fontWeight:'500'}}>Not Address Saved Yet.</h4>
                </div>
              )}
            </Card>
            {orderHistory.length===0 && (
              <Card>
                <h4 className='card-headings'>Order History</h4>
                <h4 style={{padding:'20px', fontWeight:'500'}}>You have not ordered anything yet.</h4>
              </Card>
            )}
      </AccountInner>
      <br/>
      {orderHistory.length>0 && (
        <OrderHistory orderHistory={orderHistory}/>
      )}
    </AccountOuter>
  )
}


const AccountOuter = styled.div`
    /* display: flex; */
    background-color: #e9e9e9;
    width: 80%;
    margin: 0 auto;
    margin-bottom: 1rem;
    height: 100vh;
    min-height:auto;
    overflow-y: auto;
    box-shadow: 2px 4px 4px 1px #0000007a;
    text-align: center;
    padding-bottom: 1rem;
    padding-top: 1rem;
    
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
    /* padding: 0.8rem; */
    min-height:13rem;
    min-width:17rem;
    border-radius:3px;
    overflow:hidden;
    position:relative;
    margin-right:10px;
    box-shadow: 5px 4px 5px grey;
    border: 1px solid grey;
    
    .details{
      text-align: left;
      margin-top: 0.8rem;
      padding-left: 10px;
    }
    .card-headings{
      /* border-bottom: 2px solid black; */
      text-align: center;
      color: white;
      background: grey;
      padding: 7px;
    }
    @media (max-width:850px){
        margin-bottom:10px;
    }
    
`;

export default UserAccount
