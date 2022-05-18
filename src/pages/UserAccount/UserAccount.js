import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {Address_Service, Auth_Service} from "../../services/Service";
import Loader from "../../components/Loader";
import PopUp from '../../components/PopUp';
import {mobileMenuService} from "../../services/LocalService";
import { FaEdit, FaAngleDown, FaAngleUp  } from "react-icons/fa";

function UserAccount() {
  const [user, setUser]= useState({});
  const [userAddress, setUserAddress] = useState({});
  const [showLoader, setShowLoader] = useState(false);
  const [currentPassword,setcurrentPassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editName, setEditName] = useState(false);
  const [passwordNotCorrect, setPasswordNotCorrect] = useState("");
  const [userName, setUserName] = useState("");
  const [nameError, setNameError] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [responseNotReturned, setResponseNotReturned] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");
  let navigate = useNavigate();
 
    useEffect(()=>{
        setShowLoader(true);
        mobileMenuService.setMobileMenuIndicies(null);
        
        let curr_user = JSON.parse(localStorage.getItem('user'));
        if(curr_user){
          setUser(curr_user);
          setUserName(curr_user.name);
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
   const handleEditName = ()=>{
     setEditName(!editName);
   }
   const handleUserName = (e)=>{
     const value = e.target.value;
     const re = /^[ A-Za-z ]+$/;   //only alphabets are allowed
     if (value === "" || re.test(value)){
       setUserName(value);     
       setNameError("");
     }
     
   } 
   const handleNameError = (e)=>{
      const value= e.target.value;
      // console.log(value.length);
      if(value.length < 3){
          setIsInvalid(true);
          setNameError("Name must be at least 3 characters");
      }else{
          setIsInvalid(false);
          setNameError("");
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
  const onNameChange = async(e)=>{
    e.preventDefault();
    console.log(userName);
    let userObj = {
      name:userName
    }
    const response = await Auth_Service.updateUserName(user.token, user._id,userObj);
    if(response.status === 200){
      const updatedName = await response.json();
      console.log(updatedName);
      setMessageSuccess(updatedName.message);
      setTimeout(()=>{
        setMessageSuccess("");
      },5000)
      setResponseNotReturned(false);
      setEditName(false);
      let updatedUser = {...user};
      updatedUser.name = userName;
      setUser(updatedUser);
      console.log(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }else{
      setResponseNotReturned(false);
      console.log("Name not changed");
    }

  }
  return (
    <> 
     {messageSuccess !== "" && (
        <PopUp messageSuccess={messageSuccess}/> 
     )}
    {showLoader && (<Loader/>)}
    {!showLoader && (
      <>
    <AccountOuter>
      <p className='account-heading'>Hello <strong>{user.name}</strong>, Welcome to your Account Dashboard.</p>
      <hr/>
      <AccountInner>
          <Card>
              <h4 className='card-headings'>Your Account Info</h4>
              <div className='details'>
                <p><strong>Name: </strong> {user.name} <FaEdit onClick={handleEditName}/></p>
                 {editName && (
                    <form className={responseNotReturned?"stockformDim":""}  onSubmit={onNameChange}>
                         <input
                          className="form-control"
                          type="text"
                          name="name"
                          min={3}
                          value={userName || ""}
                          required
                          onChange={handleUserName}
                          onBlur={handleNameError}
                          /><br/>
                          {nameError !=="" && (
                            <div className='name-error'>
                              <p>{nameError}!</p>
                            </div>  
                          )}
                          <button type="submit" disabled={isInvalid} className={isInvalid?"update-name-btn disableNameBtn":"update-name-btn"}>Update</button>
                    </form>
                 )}
                <p><strong>email: </strong> {user.email}</p>
                <button className="user-btns change-password-btn" onClick={handleChangePassword}>
                  Change Password
                 {!showChangePassword && (<FaAngleDown/>)} 
                 {showChangePassword && (<FaAngleUp/>)}
                </button>
                    {showChangePassword && (
                      <form onSubmit={handleCheckPrevPass}>
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
                  <h4 className='card-headings'>Your Address</h4>
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
                  <h4 className='card-headings'>Your Address</h4>
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
    svg{
      margin-left: 15px;
      color: white;
      cursor: pointer;
      padding: 1px 3px;
      transform: scale(1.7);
      background: blue;
      border-radius: 50%;
      &:active{
        background:#3434ed;
      }
    }

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
      border: 1px solid #b5b3b3;
      border-radius: 3px;
      margin-top: 5px;
      box-shadow: 2px 2px 2px grey;
    }
    .pass-error{
      margin: auto;
      color: #b91111c4;
      font-size: 14px;
      border: 1px solid #b91111c4;
      border-radius: 3px;
      text-align: center;
      width: 70%;
      font-weight: 500;
    }
    .name-error{
        margin:auto;
        color:#b91111c4;
        width: 100%;
        margin-bottom: 8px;
        font-size: 14px;
        border: 1px solid #b91111c4;
        border-radius: 3px;
        @media (max-width:650px){
            width: 100%;
        }
    }
    .update-name-btn {
      width: 30%;
      background-color: blue;
      color: white;
      font-weight: 600;
      padding: 5px 10px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
    .disableNameBtn{
      opacity: 0.7;
      cursor:none;
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
    .details p{
      padding:5px;
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
