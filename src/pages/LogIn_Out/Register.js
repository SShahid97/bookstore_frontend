import React from 'react'
import { useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import {Auth_Service} from '../../services/Service';
import "./styles.css";

// icon imports
import { FaUserPlus,FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
    const [inputs, setInputs] = useState({});
    const [confirmPass, setConfirmPass] = useState('');
    const [isMatched, setIsMatched] = useState(true);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError]= useState("");
    const [emailErrorDot, setEmailErrorDot] = useState("");
    const [emailErrorRate, setEmailErrorRate] = useState("");
    const [nameError, setNameError] = useState("");
    const [isInvalid, setIsInvalid] = useState(false);
    const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);
    const [registeredSuccess, setRegisteredSuccess] = useState();

    const handleChange = (event) => {
        setEmailAlreadyExists(false);
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({ ...values, [name]: value }))
    }

    const showHidePassword = ()=>{
        let confirm_Password=document.getElementById("confirmPassword");
             if(confirm_Password.type === 'password'){
                  setShowPassword(true);
                  confirm_Password.type='text';
             }else{
                  setShowPassword(false);
                  confirm_Password.type='password';
             }
    }

    const registerUser = async (event) => {
        event.preventDefault();
        const response = await Auth_Service.onRegister(inputs);
         if(response.status === 201){
            const data = await response.json();
            console.log(data);
            setRegisteredSuccess(true);
        }else if (response.status === 400) {
            setRegisteredSuccess(false);
            console.log("There was some error: ",response)
        }else if(response.status === 409){
            setEmailAlreadyExists(true);
        }

    }

    const handleConfirmPassword=(e)=>{
        let inputPassword=document.getElementById("password");
        if(inputPassword.value === e.target.value){
            setIsMatched(true);
            setIsInvalid(false);
        }else{
            setIsMatched(false);
            setIsInvalid(true);
        }
    }

    const handleConfirmPass=(e)=>{
        setConfirmPass(e.target.value);
    }
    const handleNameError = (e)=>{
        const value= e.target.value;
        console.log(value.length);
        if(value.length <6){
            setIsInvalid(true);
            setNameError("Name must be at least 6 characters");
        }else{
            setIsInvalid(false);
            setNameError("");
        }
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
    const handleEmailError =(e)=>{
        const value= e.target.value;
        const at_the_rate = "@";
        const dot = ".";
        if( !value.includes(at_the_rate) || !value.includes(dot)){
            if(!value.includes(at_the_rate)){
                setIsInvalid(true);
                setEmailErrorRate("Email must contain '@' symbol");
            }else{
                setEmailErrorRate("");
                setIsInvalid(false);
            }
            if(!value.includes(dot)){
                setIsInvalid(true);
                setEmailErrorDot("Email must contain '.' symbol");
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
    const eyeStyle = {
        position:'absolute', 
        marginLeft:'-30px', 
        marginTop:'10px', 
        fontSize:'1.1rem',
        color:'#686464'
    }
    return (
        <div className="RegisterForm">
            <FaUserPlus style={{fontSize: '8rem',color:'grey' }}/>
            {registeredSuccess && (
                <div className='register-success'>
                    <p>Successfully Registered!! 
                        <Link className='login-link' to={"/login"}>
                            Click here to login
                        </Link>
                    </p>
                </div>
            )}
            {/* {!registeredSuccess && (
                 <div className='pass-match-error'>
                 <p>There was some error! try again.</p>
             </div>  
            )} */}
            <form className="form_" onSubmit={registerUser}>
                <input
                    placeholder="Name"
                    type="text"
                    name="name"
                    min={6}
                    value={inputs.name || ""}
                    required
                    onChange={handleChange}
                    onBlur={handleNameError}
                />
               {nameError !=="" && (
                    <div className='pass-match-error'>
                        <p>{nameError}!</p>
                    </div>  
               )} 
                <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={inputs.email || ""}
                    required
                    onChange={handleChange}
                    onBlur={handleEmailError}
                />
                {emailErrorRate !=="" && (
                    <div className='pass-match-error'>
                        <p>{emailErrorRate}!</p>
                    </div>  
                )}
                {emailErrorDot !=="" && (
                    <div className='pass-match-error'>
                        <p>{emailErrorDot}!</p>
                    </div>  
                )}       
                <input
                    id="password"
                    placeholder='Password'
                    type="password"
                    name="password"
                    min={6}
                    value={inputs.password || ""}
                    required
                    onChange={handleChange}
                    onBlur={handlePasswordError}
                />
                {passwordError !== "" && (
                    <div className='pass-match-error'>
                        <p>{passwordError}!</p>
                    </div>  
                )} 
                <input
                    className={!isMatched?'password-error':''}
                    id="confirmPassword"
                    placeholder='Confirm Password'
                    type="password"
                    name="confirmPassword"
                    min={6}
                    value={confirmPass || ""}
                    required
                    onChange={handleConfirmPass}
                    onBlur={handleConfirmPassword}
                    
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
                {emailAlreadyExists && (
                    <div className='pass-match-error'>
                        <p>Email Already Registered! Try a different email.</p>
                    </div>
                )}
                <input className={isInvalid?"disableRegisterBtn":"RegisterBtn"} disabled={isInvalid} type="submit" value="Register" /><br/>

                <div className="notReg">
                    <p className="notregtext">Already Registered?</p> 
                    <Link className="login" to={"/login"}>Please login!</Link>
                </div>
            </form>
        </div>
    )
}

export default Register
