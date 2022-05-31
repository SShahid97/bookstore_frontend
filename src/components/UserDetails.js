import React, { useEffect } from 'react';
import styled from "styled-components";
import {Link} from "react-router-dom";

function UserDetails({user}) {
    // let cust = {user};
    useEffect(()=>{
        // console.log(cust);
    },[])
  return (
    <UserOuter>
      <h3 className='user-name'>Hi, {user.name}</h3>
      <Orders>
          <div className='user-home-links your-orders'>
              <Link to={"/user/orders"}>
                  Your Orders
              </Link>
          </div>
          <div className='user-home-links your-wishlist'>
              <Link to={"/user/wishlist"}>
                  Your Wishlist
              </Link>
          </div>
      </Orders>
    </UserOuter>
  )
}

const UserOuter = styled.div`
    padding:10px;
    margin-bottom:1.4rem;
    margin-left: -6px;
    margin-right: 4px;
    background: gainsboro;
    display: flex;
    flex-direction: row;
    @media (max-width:650px){
        padding: 8px;
        margin-bottom: 1.7rem;
        margin-left: 4px;
        margin-right: 4px;
        font-size: 0.9rem;
        flex-direction: column;
    }
    @media (max-width:360px){
        padding: 5px;
        margin-bottom: 1.5rem;
        margin-left: 2px;
        margin-right: 2px;
        font-size: 0.8rem;
    }
    .user-name{
        margin-right:10px;
        color:black;
    }

`;
const Orders = styled.div`
    display:flex;
    @media (max-width:650px){
        margin-top:5px;
    }
    .user-home-links{
        padding:4px 8px;
        border-radius: 16px;
        border: 1px solid grey;
        background-color: whitesmoke;
        color:black;
        margin-right:10px;
        cursor: pointer;
        a{
            font-weight: 500;
        }
        &:hover{
            a{
                color:white;
            }
            background-color:blue;
            border:1px solid blue;
        }
    }
    .your-orders{

    }
    .your-wishlist{

    }
`;
export default UserDetails
