import React, {useEffect, useState} from 'react'
import {useParams,useNavigate} from "react-router-dom";
import {Address_Service} from "../../services/Service";
import styled from "styled-components";
import {FaArrowLeft} from "react-icons/fa";
import Loader from "../../components/Loader";
function UserAddress() {
    const [userAddress, setUserAddress] = useState({});
    const [showLoader, setShowLoader]= useState(false);
    let params = useParams();
    let navigate = useNavigate();
    useEffect(()=>{
        window.scrollTo(0,0);
        // console.log(params.id);
        setShowLoader(true);
        let curr_user = JSON.parse(localStorage.getItem('user'));
        getUserAddress(curr_user.token, params.id);
    },[]);

    const getUserAddress = async(token, userId)=>{
        const response = await Address_Service.getUserAddress(token,userId);
        if(response.status === 200){
            const returnedAddress = await response.json();
            setUserAddress(returnedAddress);
            setShowLoader(false);
        }else if (response.status === 204){
            setUserAddress(null);
            setShowLoader(false);
        }else if (response.status === 400){
            console.log("Bad Request");
        }
    }
    const handleBack = ()=>{
        navigate(-1);
    }
  return (
    <UserAdd >
        <span className='back-arrow-span' title="back" onClick={handleBack}>
            <FaArrowLeft className='back-arrow'/>
        </span>
        {showLoader && (<Loader/>)}
        {!showLoader && (
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
            <>
                <h4 className='card-headings'>User Address</h4>
                <h4 className='no-address'>No Address Saved</h4>
            </>
            )}
            </Card>
        )}
    </UserAdd>
  )
}

const UserAdd = styled.div`
    width: 100%;
    margin: auto auto;
    
    .no-address{
        margin: auto auto;
        margin-top:1rem;
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
    color: black;
    background: white;
    min-height:13rem;
    min-width:17rem;
    border-radius:3px;
    overflow:hidden;
    position:relative;
    width: 60%;
    margin: auto auto;
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
        width: 80%;
    }
    @media (max-width:650px){
        margin-bottom:10px;
        margin-top:10px;
        width: 95%;
    }
`;
export default UserAddress
