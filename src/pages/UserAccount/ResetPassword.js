import React, {useState, useEffect} from 'react';
import { useNavigate,useParams,Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import styled from "styled-components";
// import { mobileMenuService} from "../../services/LocalService";
import { Auth_Service } from '../../services/Service';
import Loader from "../../components/Loader";
import PopUp from "../../components/PopUp";

function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword,setConfirmNewPassword ] = useState('');
    const [isMatched, setIsMatched] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError]= useState("");
    const [isInvalid, setIsInvalid] = useState(false);
    const [registeredSuccess, setRegisteredSuccess] = useState(false);
    const [errorMsg, setErrorMsg]= useState("");
    const [responseNotReturned, setResponseNotReturned] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState("");
    let params = useParams();
    useEffect(()=>{
      console.log(params.id);
      setMessageSuccess("Email verification successful!");
      setTimeout(()=>{
        setMessageSuccess("");
      },6000)

    },[])
    const handleConfirmNewPassword=(e)=>{
        setConfirmNewPassword(e.target.value);
        setIsMatched(true);
        setIsInvalid(false);
      }
      const handlePasswordError = (e)=>{
        const value= e.target.value;
        console.log(value.length);
        if(value.length < 6){
            setIsInvalid(true);
            setPasswordError("Password must be at least 6 characters");
        }else{
            setIsInvalid(false);
            setPasswordError("");
        }
     }
      const handleNewPassword=(e)=>{
        setPasswordError("");
        setErrorMsg("");
        setIsMatched(true);
        setIsInvalid(false);
        setNewPassword(e.target.value);
      }
      const handleConfirmPasswordMatch=(e)=>{
        let inputPassword=document.getElementById("newPassword");
        if(inputPassword.value === e.target.value){
            setIsMatched(true);
            setIsInvalid(false);
        }else{
            setIsMatched(false);
            setIsInvalid(true);
        }
    }
   
    const showHidePassword = ()=>{
      let confirm_Password=document.getElementById("confirmNewPassword");
           if(confirm_Password.type === 'password'){
                setShowPassword(true);
                confirm_Password.type='text';
           }else{
                setShowPassword(false);
                confirm_Password.type='password';
           }
      }

      const onPasswordReset = async(e)=>{
        e.preventDefault();
        setResponseNotReturned(true);
        setShowLoader(true);
        let passwordObj = {
          password:newPassword
        }
        console.log("New password: ",newPassword);
        console.log("Id: ", params.id);
        const response = await Auth_Service.changePassword(params.id, passwordObj);
        console.log(response);
        if(response.status === 200){
            const updatedPassword = await response.json();
            console.log(updatedPassword);
            setRegisteredSuccess(true);
            setConfirmNewPassword("");
            setNewPassword(""); 
            setResponseNotReturned(false);
            setShowLoader(false);
   
        }else{ 
          console.log("error!");
            setRegisteredSuccess(false);
            setResponseNotReturned(false);
            setShowLoader(false); 
            setConfirmNewPassword("");
            setNewPassword("");  
            setErrorMsg("password reset unsuccessful");
        }     
      }
      const eyeStyle = {
        position:'absolute', 
        marginLeft:'-30px', 
        marginTop:'10px', 
        fontSize:'1.1rem',
        color:'#686464'
      }
  return (
    <ResetPasswordOuter>
      {messageSuccess !== "" && (
            <PopUp messageSuccess={messageSuccess}/> 
         )}
       {registeredSuccess && (
                <div className='password-reset-success'>
                    <p>Password Reset Successful! 
                        <Link className='login-link' to={"/login"}>
                            Click here to login
                        </Link>
                    </p>
                </div>
            )}
    <ResetPasswordInner>
         {/* {messageSuccess !== "" && (
            <PopUp messageSuccess={messageSuccess}/> 
        )} */}
       
            {showLoader && (< Loader/>)} 
        <h4>Reset Password</h4>
          <form className={responseNotReturned?"stockformDim":""}  onSubmit={onPasswordReset}>
            {errorMsg !=="" && (
             <p className='error-msg'>
                {errorMsg} 
             </p>) }
            
              <label><strong>New Password:</strong></label><br/>
              <input
                    className='form-control'
                    id="newPassword"
                    placeholder='Password'
                    type="password"
                    name="password"
                    min={6}
                    value={newPassword || ""}
                    required
                    onChange={handleNewPassword}
                    onBlur={handlePasswordError}
                />
                {passwordError !== "" && (
                    <div className='pass-match-error'>
                        <p>{passwordError}!</p>
                    </div>  
                )} 
               <label ><strong>Confirm New Passowrd:</strong></label><br/> 
                <input
                    className={!isMatched?'password-error form-control':'form-control'}
                    id="confirmNewPassword"
                    placeholder='Confirm New Password'
                    type="password"
                    name="confirm-new-password"
                    min={6}
                    value={confirmNewPassword || ""}
                    required
                    onChange={handleConfirmNewPassword}
                    onBlur={handleConfirmPasswordMatch}
                    
                />
                {showPassword && (
                    <FaEye onClick={showHidePassword} style={eyeStyle}/>
                )}
                {!showPassword && (
                    <FaEyeSlash onClick={showHidePassword} style={eyeStyle}/>
                )}
                {!isMatched && (
                    <div className='pass-match-error'>
                        <p>Password does not match!!!</p>
                    </div>
                   
                )}
              <div className='update-details-div'>
                <button type='submit' className={isInvalid?"disableUpdateBtn":"UpdateBtn"}  disabled={isInvalid}>Reset Password</button>
              </div>
          </form>  
          {/* 627be03216b7c7109836bee9 */}
      </ResetPasswordInner>
      </ResetPasswordOuter>
  )
}

const ResetPasswordOuter = styled.div`
  width:100%;
  height:100%;
  padding-top: 3rem;
  @media (max-width:650px){
    padding-top:1rem;
  }
  .back-arrow-span{
    margin-left: 170px;
    position: relative;
    @media (max-width:650px){
      display:none;
    }
  }
  .password-reset-success{
  width: 40%;
  text-align: center;
  margin: auto;
  color: rgb(8, 112, 8);
  margin-bottom: 8px;
  font-size: 16px;
  padding: 5px 2px;
  border: 1px solid green;
  border-radius: 3px;
  box-shadow: inset 0 0 20px rgba(4, 117, 4, 0.322);
  @media (max-width:650px){
      width: 100%;
  }
  .login-link{
    padding-left:10px;
    color:blue;
    font-size: small;
    text-decoration: underline;
  }
}
`;

const ResetPasswordInner = styled.div`
    width: 40%;
    height: auto;
    margin: 0 auto;
    border-left: 1px solid grey;
    margin-top: 1rem;
    margin-bottom: 1rem;
    box-shadow: 2px 2px 2px grey;
    @media (max-width:650px){
      width: 95%;
      font-size: 0.9rem;
    }
    .logout-msg{
        padding:10px;
        color:red;
    }
    h4 {
      padding: 5px;
      text-align: center;
      background: grey;
      color: white;
    }
    form{
      width: 70%;
      margin: 0 auto;
      padding: 15px;
      @media (max-width:650px){
          width:80%;
      }
    }
    .update-details-div{
      text-align: center;
    }
    .update-details-btn{
      width: 70%;
      margin: 0 auto;
      padding: 10px;
      border-radius: 3px;
      border:none;
      opacity: 0.9;
      cursor: pointer;
      background-color: blue;
      color:white;
      &:hover{
        opacity: 1;
      }
      @media (max-width:650px){
        padding:8px;
      }
    }
    .password-error{
      border-color: #fb1919f0 !important;
      box-shadow: inset 0 0 13px rgb(221 20 20 / 59%);
    }
    .pass-match-error{
        margin:auto;
        color:#b91111c4;
        width: 80%;
        margin-bottom: 8px;
        font-size: 14px;
        padding: 5px 2px;
        border: 1px solid #b91111c4;
        border-radius: 3px;
        @media (max-width:650px){
          width: 100%;
        }
    }
    .UpdateBtn{
        width:50%;
        background-color: blue;
        color:white;
        font-weight: 600;
        padding:8px 10px;
        border:none;
        border-radius:3px;
        cursor:pointer;
        @media (max-width:650px){
          width: 65%;
          margin-top: 5px;
        }
    }
    .disableUpdateBtn{
      opacity: 0.7;
      padding:8px 10px;
      width:50%;
      background-color: blue;
      color:white;
      font-weight: 600;
      border-radius:3px;
      @media (max-width:650px){
          width: 65%;
          margin-top: 5px;
        }
    }
    .lds-spinner{
        transform: translate(220px,140px);
        position: absolute;
        @media (max-width:650px){
            transform: translate(150px,140px); 
        }
    }
    .stockformDim{
        opacity: 0.6;
    }
    .error-msg{
        margin:auto;
        color:#ed1111f2;
        width: 90%;
        margin-bottom: 8px;
        font-size: 15px;
        padding: 5px 5px;
        border: 1px solid #ed1111f2;
        border-radius: 3px; 
        text-align: center;
    }
`;

export default ResetPassword
