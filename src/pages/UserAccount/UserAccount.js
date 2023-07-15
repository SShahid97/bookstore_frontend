import React, { useEffect, useState } from 'react';
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {Address_Service, Auth_Service, Upload_Service} from "../../services/Service";
import Loader from "../../components/Loader";
import PopUp from '../../components/PopUp';
import PopupFailure from "../../components/PopupFailure";
import {mobileMenuService, userService} from "../../services/LocalService";
import { FaEdit, FaAngleDown, FaAngleUp, FaUpload, FaUserCircle } from "react-icons/fa";
import ProfilePicModal from '../../components/ProfilePicModal';

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

  const [imageFile, setImageFile]= useState(null);
  const [imagePrevFile, setImagePrevFile] = useState(null);
  const [previewImageURL, setPreviewImageURL] = useState(null);
  const [imageChoosen, setImageChoosen] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [messageFailure, setMessageFailure] = useState("");
  const [existingProfilePic, setExistingProfilePic] = useState([]);
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [imageForModal, setImageForModal] = useState("");
  let navigate = useNavigate();
    useEffect(()=>{
      mobileMenuService.setMobileMenuIndicies(null);
        
        let curr_user = JSON.parse(localStorage.getItem('user'));
        if(curr_user){
          setUser(curr_user);
          setUserName(curr_user.name);
          getUserAddress(curr_user.token, curr_user._id);

          if (curr_user.hasOwnProperty("profile_pic")){
            let profilePicture = [{id:1 ,image: curr_user.profile_pic, name:curr_user.name}];
            // console.log(profilePicture);

            try{
              let profileImageName  = require(`../../../public/assets/images/${profilePicture[0].image}`);
              profilePicture[0].image = profileImageName;
              console.log("profileImageName: ",profileImageName);
            }catch(err){
              profilePicture[0].image = "dummyProfilePic.png";
              profilePicture[0].image =  require(`../../../public/assets/images/${ profilePicture[0].image}`);
              // setProfilePic(profilePicture);
              console.log(err);
            }
            // setProfilePic(profilePicture);
            setImageForModal(profilePicture[0].image);
            setExistingProfilePic(profilePicture);
          }
          
        }
    },[])

    useEffect(()=>{
        // setShowLoader(true);
        if(imagePrevFile){
          const reader = new FileReader();
          reader.onload = ()=>{
              if(reader.readyState === 2){
                  setPreviewImageURL(reader.result);
              }         
          };
          reader.readAsDataURL(imagePrevFile);
          // for Storing imageName in database
          setProfilePic(imagePrevFile.name);    
        }else{
            setPreviewImageURL(null);
        }
    },[imagePrevFile]);
    const handleImageUpload = (e)=>{
      const file = e.target.files[0];
      // console.log(file);
      if(!file.type.includes("image") ){
        setMessageFailure("Only Images are allowed!");
          setTimeout(()=>{
              setMessageFailure("");
          },5000);
        return;
      }
      // console.log(file);
      setImageFile(file);
      setImagePrevFile(file);
      setImageChoosen(true);
  }
  const sumbitProfilePic  = async(e)=>{
      e.preventDefault();
      setResponseNotReturned(true);
      setShowLoader(true);
      let profileObj = {
          profile_pic:profilePic
      }
      // console.log(profileObj);

      const response = await Auth_Service.uploadProfilePic(user.token, user._id,profileObj);
      if(response.status === 200){
        const updatedProfilePic = await response.json();
        console.log(updatedProfilePic.message);
        await sumbitImageUpload();
        //   setMessageSuccess(updatedProfilePic.message);
        //   setTimeout(()=>{
          //     setMessageSuccess("");
          //   },5000)
          let updatedUser = {...user};
          updatedUser.profile_pic = profilePic;
          console.log(updatedUser);

          setUser(updatedUser);
          // userService.sendUser(updatedUser); 
          localStorage.setItem("user", JSON.stringify(updatedUser));
      }else{
        console.log("pic not uploaded");
      }
  }

  const sumbitImageUpload = async ()=>{
      
      const formData = new FormData();
      formData.append('photo', imageFile);
      const response = await Upload_Service.uploadImage(user.token,formData);
      if (response.status === 200){
          const data = await response.json();
          console.log(data);
          // console.log("Image Uploaded");
         
          setResponseNotReturned(false);
          setShowLoader(false);
          // window.location.reload();
          userService.sendUser(user);
          setMessageSuccess("Picture uploaded successfully");
          setTimeout(()=>{
            setMessageSuccess("");
          },5000)
          
          // alert("Image Uploaded Successfully");
          
      }else{
          setResponseNotReturned(false);
          setShowLoader(false);
          // setImageNotUploaded(true);
          setMessageFailure("Image not uploaded, try again later.");
          setTimeout(()=>{
              setMessageFailure("");
          },5000);
          return false;
      }
    }
    const handleProfilePic = (e)=>{
      console.log(e.target.value);
    }
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
  const handleOpenImage = ()=>{
    setShowProfilePicModal(true);
  }
  const handleOpenPreviewImage = ()=>{
    setImageForModal(previewImageURL);
    setShowProfilePicModal(true);
  }
  return (
    <>
    {messageFailure !== "" && (
        <PopupFailure messageFailure={messageFailure}/> 
     )}

     {messageSuccess !== "" && (
        <PopUp messageSuccess={messageSuccess}/> 
     )}
     {showProfilePicModal && (
            <ProfilePicModal setShowProfilePicModal={setShowProfilePicModal} pic={imageForModal}/>
      )} 
    {showLoader && (<Loader/>)}
    {!showLoader && (
      <>
    <AccountOuter>
      <p className='account-heading'>Hello <strong>{user.name}</strong>, Welcome to your Account Dashboard.</p>
      <hr/>
      <AccountInner>
      <div className='profile-pic-outer'>
                {/* <div className='image-upload-form'> */}
                <form className={responseNotReturned?"formDim":""} onSubmit={sumbitProfilePic}>
                    
                    {/* <div className='image-preview'> */}
                        <div className='profile-pic-inner' >
                        {!previewImageURL && existingProfilePic.map((item)=>{   
                            return ( 
                              // require(`../../../public/assets/images/${item.image}`)
                            <img key={item.id} onClick={handleOpenImage} className='previewImg' src={item.image} alt={item.name}/>
                            )
                        })}
                            {previewImageURL ? 
                                <img className='previewImg' onClick={handleOpenPreviewImage} src={previewImageURL}  alt="Preview"/>:
                                (<div >
                                  {existingProfilePic.length===0 &&  <FaUserCircle className='dummy-pic'/>}
                                </div>)
                            } 
                        </div> 
                    {/* </div> */}
                        <input
                            type="text"
                            name="profile_pic"
                            value={profilePic}
                            required
                            hidden={true}
                            onChange={handleProfilePic}
                        />
                    <div className="picture-btns" >
                        <button className='choose-image-btn' type="button" onClick={()=>document.getElementById('getFile').click()}>{existingProfilePic.length===0?"Choose Profile Picture":"Change Profile Picture"}</button>
                        <input type="file" id="getFile" accept='image/*' style={{display:'none'}} name="photo" onChange={handleImageUpload}/>
                        <button disabled={!imageChoosen}   className={!imageChoosen?"disable-upload-btn":"upload-btn"}  type="submit" title="Upload">
                            <FaUpload/>
                        </button>
                    </div>
                </form>
                {/* </div> */}
            
          </div>
          

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
    background-color: #fbfbfb;
    width: 60%;
    margin: 0 auto;
    margin-bottom: 1rem;
    min-height:auto;
    overflow-y: auto;
    box-shadow: 2px 4px 4px 1px #0000007a;
    text-align: center;
    padding-bottom: 1rem;
    padding-top: 1rem;
    .lds-spinner{
        transform: translate(480px,140px);
        position: absolute;
        z-index:1;
        @media (max-width:650px){
            transform: translate(150px,140px); 
        }
    }
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
    .formDim{
        opacity:0.6;
    }
    form{
      width: 70%;
      margin:auto;
      padding: 5px;
      border: 1px solid #b5b3b3;
      border-radius: 3px;
      /* margin-top: 5px; */
      box-shadow: 2px 2px 2px grey;
      margin-bottom: 5px;
      @media (max-width:650px){
        width: 80%;
      }
    }
    .picture-btns{
        display: flex;
        justify-content: space-between;
        width: 75%;
        margin: auto;
        @media (max-width:650px){
            width:95%;
        }
    }
    .disable-btn{
        opacity: 0.5;
        background-color: blue;
        cursor: auto;
        color:white;
    }
    .error-msg{
        color:#ed1111f2;
        width: 85%;
        margin-bottom: 8px;
        font-size: 15px;
        padding: 5px 5px;
        border: 1px solid #ed1111f2;
        border-radius: 3px; 
        text-align: center;
    }
    .previewImg{
        height: 100%;
        width: 100%;
        padding: 5px;
        border-radius: 10px;
        &:hover{
          cursor: zoom-in;
        }
    }

    .image-preview-text{
        color: #605151;
        margin: auto auto;
        font-size: larger;
        font-weight: 700;
    }
    .choose-image-btn{
        display:inline-block;
        width:75%;
        background-color: #3caf4d;
        color:white;
        font-size: 15px;
        padding: 8px 5px;
        border: 1px solid #9e9e9e73;
        border-radius: 3px;
        outline:none;
    }

    .choose-image-btn:hover{
        cursor: pointer;
        background-color: #22a736;
        color: white;
    }
    .upload-btn{
        display:inline-block;
        width:20%;
        background-color: blue;
        color:white;
        font-size: 15px;
        padding: 6px 3px;
        border: 1px solid #9e9e9e73;
        border-radius: 3px;
        outline:none;
    }
    .disable-upload-btn{
        opacity: 0.5;
        cursor: auto;
        display:inline-block;
        width:20%;
        background-color: blue;
        color:white;
        font-size: 15px;
        padding: 6px 3px;
        border: 1px solid #9e9e9e73;
        border-radius: 3px;
        outline:none;
    }
    .upload-btn:hover{
        cursor: pointer;
        background-color: rgb(12 12 194 / 90%);
    }
    .profile-pic-outer{
      width: 60%;
      @media (max-width:650px){
        width: 100%;
      }
    }
    .profile-pic-inner{
        width: 250px;
        height: 170px;
        display: block;
        /* border-radius: 75px; */
        padding: 5px;
        margin: auto auto;
        text-align: center;
        .dummy-pic{
            transform: scale(9);
            margin-top: 60px;
            color: lightgray;
        }
    }
    .details svg{
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
