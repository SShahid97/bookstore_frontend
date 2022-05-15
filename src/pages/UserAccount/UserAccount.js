import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {Address_Service, Auth_Service} from "../../services/Service";
import Loader from "../../components/Loader";
import {mobileMenuService} from "../../services/LocalService";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

function UserAccount() {
  const [user, setUser]= useState({});
  const [userAddress, setUserAddress] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [currentPassword,setcurrentPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordNotCorrect, setPasswordNotCorrect] = useState("");
  let navigate = useNavigate();
 
    useEffect(()=>{
        setShowLoader(true);
        mobileMenuService.setMobileMenuIndicies(null);
        
        let curr_user = JSON.parse(localStorage.getItem('user'));
        if(curr_user){
          setUser(curr_user);
          getUserAddress(curr_user.token, curr_user._id);
        }
    },[]);

    const getUserAddress = async(token,userId)=>{
      const response = await Address_Service.getUserAddress(token,userId);
      if(response.status === 200){
        setShowLoader(false);
        const returnedAddress = await response.json();
        setUserAddress(returnedAddress);
        // console.log(returnedAddress);
      }else if (response.status === 204){
        setShowLoader(false);
        setUserAddress(null);
      }else if (response.status === 400){
        console.log("Bad Request");
      }

    }
    // const getOrderHistory = async (token, userId)=>{
    //   const response = await Order_Service.getOrderHistory(token,userId);
    //   if(response.status === 200){
    //     setShowLoader(false);
    //     const returnedHistory = await response.json();
    //     // console.log(returnedHistory);
    //   }else if (response.status === 204){
    //     setShowLoader(false);
    //   }else if (response.status === 400){
    //     console.log("Bad Request");
    //   }
    // }
    const handleChangePassword = ()=>{
      setShowChangePassword(!showChangePassword);
    }
    
    const handlecurrentPassword = (e)=>{
      setPasswordNotCorrect("");
      setcurrentPassword(e.target.value);
    }
   const handleCheckPrevPass = async(e)=>{
     e.preventDefault();
     let userInfoObj = {
       token:user.token,
       email:user.email,
       password:currentPassword
     } 
    //  console.log(userInfoObj);
     const response = await Auth_Service.verifycurrentPassword(userInfoObj);
     if(response.status === 200){
      const successReply = await response.json(); 
      console.log(successReply.message);
      // setPasswordCorrect(true);
      navigate("/user/change-password");
     }else if(response.status === 401) {
      const failureReply = await response.json(); 
      console.log(failureReply.message);
      // setPasswordCorrect(false);
      setPasswordNotCorrect(failureReply.message);
     }else if(response.status === 400){
       console.log("There was some error");
     }

   }
   const handleAddAddress = ()=>{
    // setShowAddAddress(true);
    let type = "add";
    navigate("/user/user-address/"+type);
   }
   const handleChangeAddress = ()=>{
    let type = "edit";
    navigate("/user/user-address/"+type);
  }
  return (
    <> 
    {showLoader && (<Loader/>)}
    {!showLoader && (
      <>
    <AccountOuter>
      <p className='account-heading'>Hello <strong>{user.name}</strong>, Welcome to your Account Dashboard.</p>
      <hr/>
      <AccountInner>
          <Card>
              <h4 className='card-headings'>User Info</h4>
              <div className='details'>
                <p><strong>Name: </strong> {user.name}</p>
                <p><strong>email: </strong> {user.email}</p>
                <button className="user-btns change-password-btn" onClick={handleChangePassword} >Change Password</button>
                    {showChangePassword && (
                      <form  onSubmit={handleCheckPrevPass}>
                      <label ><strong>Enter Current Password:</strong></label><br/>
                      <input
                        className='form-control'
                        placeholder='Current Password'
                        type="password"
                        name="current-password"
                        value={currentPassword || ""}
                        required
                        onChange={handlecurrentPassword}
                        // onBlur={handlePasswordError}
                      /><br/>
                      <button type='submit' className='previous-password-btn'>Submit</button>
                     </form> 
                    )}
                    {passwordNotCorrect !=="" && (
                      <div className='pass-error'>
                          <p>{passwordNotCorrect}</p>
                      </div>
                    )}
                                          
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
                    <button className="user-btns add-edit-btn" onClick={handleChangeAddress}>Change Address</button>
                  </div>
                </>
              )}
              {!userAddress && (
                <div>
                  <h4 className='card-headings'>User Address</h4>
                  <h4 style={{marginTop:'1rem', fontWeight:'500'}}>No Address Saved Yet.</h4>
                  <button className="user-btns add-edit-btn" onClick={handleAddAddress} >Add Address</button>
                </div>
              )}
            </Card>
      </AccountInner>
    </AccountOuter>
    </>
    )}
    </>
  )
}


const AccountOuter = styled.div`
    /* display: flex; */
    background-color: #e9e9e9;
    width: 60%;
    margin: 0 auto;
    margin-bottom: 1rem;
    min-height:auto;
    overflow-y: auto;
    box-shadow: 2px 4px 4px 1px #0000007a;
    text-align: center;
    padding-bottom: 1rem;
    padding-top: 1rem;
    
    .account-heading{
        margin-bottom:0.8rem ;
        font-size: 1.2rem;
        @media (max-width:650px){
          font-size: 0.9rem;
          padding: 5px;
        }
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
    width:95%;
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
    height: fit-content;
    width: 40%;
    padding-bottom: 20px;
    border-radius:3px;
    overflow:hidden;
    position:relative;
    margin-right:10px;
    box-shadow: 5px 4px 5px grey;
    border: 1px solid grey;
    .user-btns{
      margin-top:10px;
      padding:5px 10px;
      border-radius: 3px;
      background: blue;
      color:white;
      border:none;
      opacity: 0.9;
      cursor:pointer;
      &:hover{
        opacity: 1;
      }
    }
    form{
      width: 90%;
      padding: 10px;
    }
    .pass-error{
      margin: auto;
      color: #b91111c4;
      font-size: 14px;
      padding: 4px 2px;
      border: 1px solid #b91111c4;
      border-radius: 3px;
      text-align: center;
      width: 70%;
      font-weight: 500;
    }
    .previous-password-btn{
        width:30%;
        background-color: blue;
        color:white;
        font-weight: 600;
        padding:5px 10px;
        border:none;
        border-radius:3px;
        cursor:pointer;
    }
    .form-control{
      width:70% !important;
    }
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
      @media (max-width:650px){
        font-size: 0.9rem;
        padding:5px;

      }
    }
    @media (max-width:850px){
        margin-bottom:10px;
    }
    @media (max-width:650px){
      width: 98%;
    }
    
`;


export default UserAccount
