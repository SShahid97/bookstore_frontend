import React, {useEffect, useState} from 'react'
import {useParams,useNavigate} from "react-router-dom";
import {Address_Service} from "../../services/Service";
import styled from "styled-components";
import {FaArrowLeft} from "react-icons/fa";
function UserAddress() {
    const [userAddress, setUserAddress] = useState({});
    let params = useParams();
    let navigate = useNavigate();
    useEffect(()=>{
        console.log(params.id);
        let curr_user = JSON.parse(localStorage.getItem('user'));
        getUserAddress(curr_user.token, params.id);
    },[]);

    const getUserAddress = async(token, userId)=>{
        const returnedAddress = await Address_Service.getUserAddress(token,userId);
        console.log(returnedAddress);
        setUserAddress(returnedAddress[0]);
    }
    const handleBack = ()=>{
        navigate(-1);
    }
  return (
    <UserAdd >
        <span className='back-arrow-span' title="back" onClick={handleBack}>
            <FaArrowLeft className='back-arrow'/>
        </span>
       {userAddress && (
           <Card>
           <h4 className='card-headings'>User Address</h4>
           <div className='details'>
             <p><strong>Country: </strong> {userAddress.country}</p>
             <p><strong>State: </strong> {userAddress.state}</p>
             <p><strong>City: </strong> {userAddress.city}</p>
             <p><strong>Contact: </strong> {userAddress.contact}</p>
             <p><strong>Pincode: </strong> {userAddress.pincode}</p>
             <p><strong>Address: </strong> {userAddress.address}</p>
           </div>
       </Card>
       )}
       {!userAddress && (
           <h3 className='no-address'>No Address Saved.</h3>
       )}
    </UserAdd>
  )
}

const UserAdd = styled.div`
    width: 100%;
    margin: auto auto;
    
    .no-address{
        margin:auto auto;
        margin: auto auto;
        width: 60%;
        text-align: center;
    }
    .back-arrow-span{
        border-radius: 50%;
        background: gainsboro;
        color: #5a5a5a;
        padding: 5px 8px;
        cursor: pointer;
        margin-left: 6px;
    }
    .back-arrow-span:hover{
        background: #8f8f8f;
        color: white;
    }
    .back-arrow-span:active{
        background: #b1b1b1;;
    }
    .back-arrow{
        padding-top: 2px;
        transform: scale(1.1);
    }
`;

const Card = styled.div`
    margin-top: 2rem;
    font-size: 1.2rem;
    color: black;
    background: white;
    padding: 0.8rem;
    min-width: 20rem;
    border-radius: 5px;
    width: 50%;
    height: auto;
    margin: 0 auto;
    border-radius: 3px;
    background: gainsboro;
    
    .details{
      text-align: left;
      margin-top: 0.8rem;
    }
    .card-headings{
      border-bottom: 2px solid black;
      font-size: 1.2rem;
    }
    @media (max-width:850px){
        margin-bottom:10px;
    }
    
`;
export default UserAddress
