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

    const handleChange = (event) => {
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
            console.log(data)
            if(data){
                navigate("/login");
            } 
        }
        if (response.status === 400) {
            console.log("There was some error: ",response.statusText)
        } 
    }

    const handleConfirmPassword=(e)=>{
        let inputPassword=document.getElementById("password");
        if(inputPassword.value === e.target.value){
            console.log("Yes");
            setIsMatched(true);
        }else{
            setIsMatched(false);
            console.log("No");
        }
    }

    const handleConfirmPass=(e)=>{
        setConfirmPass(e.target.value);
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
            <FaUserPlus style={{fontSize: '8rem', marginTop:'2rem',color:'grey' }}/>
            <form className="form_" onSubmit={registerUser}>
                <input
                    placeholder="Name"
                    type="text"
                    name="name"
                    value={inputs.name || ""}
                    required
                    onChange={handleChange}
                />

                <input
                    placeholder="Email"
                    type="email"
                    name="email"
                    value={inputs.email || ""}
                    required
                    onChange={handleChange}
                />

                <input
                    id="password"
                    placeholder='Password'
                    type="password"
                    name="password"
                    value={inputs.password || ""}
                    required
                    onChange={handleChange}
                />
                <input
                    className={!isMatched?'password-error':''}
                    id="confirmPassword"
                    placeholder='Confirm Password'
                    type="password"
                    name="confirmPassword"
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
                
                <input className="RegisterBtn" disabled={!isMatched} type="submit" value="Register" /><br/>

                <div className="notReg">
                    <p className="notregtext">Already Registered?</p> 
                    <Link className="login" to={"/login"}>Please login!</Link>
                </div>
            </form>
        </div>
    )
}

export default Register
