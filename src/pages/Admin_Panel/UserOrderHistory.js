import React, {useEffect, useState} from 'react'
import {useParams,useNavigate} from "react-router-dom";
import {Order_Service} from "../../services/Service";
import styled from "styled-components";
import {FaArrowLeft} from "react-icons/fa";
import OrderHistory from '../../components/OrderHistory';
import Loader from "../../components/Loader";

function UserOrderHistory() {
  const [usersOrderHistoy, setUsersOrderHistoy] = useState([]);
  const [showLoader, setShowLoader]= useState(false);
  let params = useParams();
  let navigate = useNavigate();
  useEffect(()=>{
      setShowLoader(true);
      window.scrollTo(0,0);
      // console.log(params.id);
      let curr_user = JSON.parse(localStorage.getItem('user'));
      getOrderHistory(curr_user.token, params.id);
  },[]);

  const getOrderHistory = async (token, userId)=>{
    const response = await Order_Service.getOrderHistory(token,userId);
      if(response.status === 200){
        setShowLoader(false);
        const returnedHistory = await response.json();
        // console.log(returnedHistory);
        setUsersOrderHistoy(returnedHistory);
      }else if (response.status === 204){
        setShowLoader(false);
        setUsersOrderHistoy(null);
      }else if (response.status === 400){
        console.log("Bad Request");
      }
 
  }
  const handleBack = ()=>{
      navigate(-1);
  }
  return (
    <UsersOrderHistory>
      <span className='back-arrow-span' title="back" onClick={handleBack}>
            <FaArrowLeft className='back-arrow'/>
      </span>
      {showLoader && (<Loader/>)}
      {!showLoader && (
        <OrderHistory orderHistory={usersOrderHistoy} />
      )}  
      </UsersOrderHistory>
  )
}

const UsersOrderHistory = styled.div`
    height: 100vh;
    @media (max-width:650px){
      height: unset;
    }
    .back-arrow-span{
      @media (max-width:650px){
        display:none;
      }
    }
   
`;
export default UserOrderHistory
