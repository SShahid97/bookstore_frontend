import React, { useEffect, useState } from 'react';
import { FaEdit, FaAngleDown, FaAngleUp  } from "react-icons/fa";
import styled from "styled-components";
import Loader from "../../components/Loader";
import PopUp from '../../components/PopUp';
import {Auth_Service} from "../../services/Service";
import ChangePassword from "../UserAccount/ChangePassword";


function AdminProfile() {
    const [user, setUser]= useState({});
    const [showLoader, setShowLoader] = useState(false);
    const [currentPassword,setcurrentPassword] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [editName, setEditName] = useState(false);
    const [passwordNotCorrect, setPasswordNotCorrect] = useState("");
    const [userName, setUserName] = useState("");
    const [nameError, setNameError] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);
    const [responseNotReturned, setResponseNotReturned] = useState(false);
    const [showChangePasswordComponent, setShowChangePasswordComponent] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState("");
    
    useEffect(()=>{
        // setShowLoader(true);
        let curr_user = JSON.parse(localStorage.getItem('user'));
        if(curr_user){
          setUser(curr_user);
          setUserName(curr_user.name);
        }
    },[]);

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
        //  navigate("/user/change-password");
         setShowChangePasswordComponent(true);
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
    <AdminProfileOuter>
        <AdminProfileInner>
              <h4 className='card-headings'>Your Account Info</h4>
              <div className='details'>
                <p><strong>Name: </strong> {user.name} <FaEdit title="Edit" onClick={handleEditName}/></p>
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
              </AdminProfileInner>
            {showChangePasswordComponent && (
                <ChangePassword/>
            )}
        </AdminProfileOuter>
    </>
    )}
    </>
  )
}

const AdminProfileInner = styled.div`
     color: black;
    background: white;
    height: fit-content;
    width: 50%;
    padding-bottom: 20px;
    border-radius:3px;
    overflow:hidden;
    position:relative;
    margin-right:10px;
    box-shadow: 5px 4px 5px grey;
    border: 1px solid grey;
    margin: auto;
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
      margin-bottom: 5px;
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
const AdminProfileOuter = styled.div`
   .back-arrow-span{
       display: none;
   }
`;


export default AdminProfile
