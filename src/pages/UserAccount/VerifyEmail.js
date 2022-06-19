import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { Auth_Service } from '../../services/Service';
import emailjs from "@emailjs/browser";

function VerifyEmail() {
    const [email, setEmail]= useState("");
    const [emailErrorDot, setEmailErrorDot] = useState("");
    const [emailErrorRate, setEmailErrorRate] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);
    // const [errorInMail, setErrorInMail] = useState(false);
    const [emailIsNotRegistered, setEmailIsNotRegistered] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    // const [existingUser, setExistingUser] = useState({});
    // let navigate = useNavigate();
    
    useEffect(()=>{

    },[])
    const handleEmail = (e)=>{
        const value = e.target.value;
        setEmail(value);
        setIsInvalid(false);
        setEmailIsNotRegistered(false);
        setEmailErrorRate("");
        setEmailErrorDot("");
    }
    const handleEmailError =(e)=>{
        const value= e.target.value;
        const at_the_rate = "@";
        const dot = ".";
        if( !value.includes(at_the_rate) || !value.includes(dot)){
            if(!value.includes(at_the_rate)){
                setIsInvalid(true);
                setEmailErrorRate("Email must contain '@<domian name>' string");
            }else{
                setEmailErrorRate("");
                setIsInvalid(false);
            }
            if(!value.includes(dot)){
                setIsInvalid(true);
                setEmailErrorDot("Email must contain '.<com or org or in,etc..>' string");
            }else{
                setEmailErrorDot("");
                setIsInvalid(false);
            }
        }
        else{
            setEmailErrorDot("");
            setEmailErrorRate("");
            setIsInvalid(false);
        }
    }
    const onEmailVerify = async(e)=>{
        e.preventDefault();
        let emailObj={
            email:email
        }
        const response = await Auth_Service.verifyEmail(emailObj);
        // console.log(response);
        if(response.status === 200){
            const returnedUser = await response.json();
            // console.log(returnedUser);
            // setExistingUser(returnedUser);
            setEmailIsNotRegistered(false);
            
            let resetPasswordObj = {
                email:email,
                userID:returnedUser._id
            }
             // mail starts here
            emailjs.send("service_2rgz7hq", "template_r4gi8ss", resetPasswordObj, "3DRAqhnj6rTu4Rzmb")
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                setEmailSent(true);
            }, function(error) {
                alert("Verification Email could not be send, try again later!");
                //  setErrorInMail(true);
                console.log('Email FAILED...', error);
            });
            // Mail Ends Here
            // navigate("/user/reset-password/"+returnedUser._id);
        }else if (response.status===204){
            setEmailSent(false);
            // console.log("not registered");
            // setExistingUser(null);
            setEmailIsNotRegistered(true);
            // console.log("Email not registered");
        }else if (response.status === 400){
            // setExistingUser(null);
            alert("There was some error");
        }
        // console.log(emailObj);
    }
  return (
    <VerifyEmailOuter>
        <VerifyEmailInner>
        <form  onSubmit={onEmailVerify}>
        {emailIsNotRegistered && (
          <div className='email-error'>
              <p>Email is not registered!</p>
          </div>
        )}
        {emailSent && (
              <div className='email-sent'>
                  <p>A password reset link has been sent to your email! Plz check your inbox</p>
              </div>
        )}
            <label ><strong>Enter Registered Email:</strong></label><br/>
            <input
                className='form-control'
                placeholder="Email"
                type="email" 
                name="email" 
                value={email || ""} 
                required
                onChange={handleEmail}
                onBlur ={handleEmailError}
            /><br/>
            {emailErrorRate !=="" && (
                <div className='email-error'>
                    <p>{emailErrorRate}!</p>
                </div>  
            )}
            {emailErrorDot !=="" && (
                <div className='email-error'>
                    <p>{emailErrorDot}!</p>
                </div>  
            )}     
             <button type='submit' disabled={isInvalid} className='email-submit-btn'>Verify Email</button>
      </form>    
      </VerifyEmailInner>  
    </VerifyEmailOuter>
  )
}

const VerifyEmailOuter = styled.div`
    height: 100%;
    width: 100%;
    padding-top: 4rem;
`;
const VerifyEmailInner = styled.div`
    width: 40%;
    margin: auto auto;
    border-radius: 3px;
    border: 1px solid grey;
    padding: 20px;
    box-shadow: 2px 3px 3px grey;
    @media (max-width:650px){
        width:90%;
    }
    form {
        width: 70%;
        margin: auto;
        padding: 15px;
        @media (max-width:650px){
            width:90%;
        }
    }
    .email-submit-btn{
        width:40%;
        background-color: blue;
        color:white;
        font-weight: 600;
        padding:5px 10px;
        border:none;
        border-radius:3px;
        cursor:pointer;
        @media (max-width:650px){
            width:50%;
        }
    }
    .email-error{
        margin:auto;
        color:#b91111c4;
        width: 100%;
        margin-bottom: 8px;
        font-size: 14px;
        border: 1px solid #b91111c4;
        border-radius: 3px;
        font-weight: 700;
        text-align: center;
    }
    .email-sent{
        width: 100%;
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
    }
`;
export default VerifyEmail