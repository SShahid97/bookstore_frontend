import React from 'react'
import { useState,useEffect, useCallback} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./styles.css";
import {userService, cartService,mobileMenuService} from "../../services/LocalService";
import {Auth_Service,Cart_Service} from "../../services/Service";
// icon imports
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";


function Login() {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({email:"",password:""});
    const [showPassword, setShowPassword] = useState(false);
    const [invalidCredentails,setInvalidCredentials] = useState(false);
    const [emailExists,setEmailExists] = useState(false);
    const [invalidPassword,setInvalidPassword] = useState(false);
    const [loginSuccessMessage, setLoginSuccessMessage] = useState("");

    useEffect(()=>{
      let isMounted = true;
        if (isMounted){
          mobileMenuService.setMobileMenuIndicies(null);
        }
        return () => { isMounted = false }; 
    },[])
    const handleChange = (event) => {
      setInvalidPassword(false);
      setEmailExists(false);
      setInvalidCredentials(false);
      const name = event.target.name;
      const value = event.target.value;
      setInputs(values => ({...values, [name]: value}))

    }

    const showHidePassword = ()=>{
      let inputPassword=document.getElementById("password");
           if(inputPassword.type === 'password'){
                setShowPassword(true);
                inputPassword.type='text';
           }else{
                setShowPassword(false);
                inputPassword.type='password';
           }
    }
    
  //  function sendUser(user) {
  //   // send message to subscribers via observable subject
  //   userService.sendUser(user);
  // }

    const loginForm = useCallback(async (event) => {
      event.preventDefault();
        const response = await Auth_Service.onLogin(inputs);
        if(response.status === 200){
          //  console.log(response);
            setInvalidCredentials(false);
            setEmailExists(false);
            setInvalidPassword(false);
            setLoginSuccessMessage("Login Success");
            setTimeout(()=>{
              setLoginSuccessMessage("");
            },5000)
            const user = await response.json();
            // sendUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            if(user.role === "admin"){
              // console.log("admin")
              userService.sendUser(user);  //subject
              navigate("/admin-panel/dashboard");
              return;
            }else{
              userService.sendUser(user);  //subject
              getCartItems();
              navigate("/");
              return;
            }
            // if()
            // navigate(-1);   //redirect back to previous page (url/link)   
        }else if(response.status === 400){
            setInvalidCredentials(true);
            console.log("There was some error: ",response.statusText);
        }else if(response.status === 401){   //invalid password
          setInvalidPassword(true);
          setEmailExists(false);
          console.log(response);
        }else if (response.status === 204) { //email doesn't exist
          setEmailExists(true);
          setInvalidPassword(false);
          console.log(response);
        }
    },[inputs,navigate]);  

    const getCartItems = async()=>{
      let user = JSON.parse(localStorage.getItem('user'));
      try{
          const response = await Cart_Service.getCartItems(user._id, user.token);
          if(response.status === 200){
            const cartResponse = await response.json(); 
            cartService.updateCartItems(cartResponse.length);
            localStorage.setItem("cart",JSON.stringify(cartResponse));            
          }else if(response.status === 204){
            console.log("No Cart Items saved");
          }
      }catch(err){
          console.log("There was some error: ",err)
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
    <div className="loginForm"> 
    <FaUserCircle className='userIconLogin'/>
    {loginSuccessMessage !== "" && (
        <div className='login-success'>
            <p>{loginSuccessMessage}</p>
        </div>
    )}
    <form className="form_" onSubmit={loginForm}>
      {/* <input
        placeholder="Email"
        type="email" 
        name="email" 
        value={inputs.email || ""} 
        required
        onChange={handleChange}
      /> */}
      {/* <input
        id="password"
        placeholder='Password' 
        type="password" 
        name="password" 
        value={inputs.password || ""}
        required 
        onChange={handleChange}
      /> */}
      <div className='inputBox'>
        <input
          placeholder="Email"
          id="email"
          type="email" 
          name="email" 
          value={inputs.email || ""} 
          required
          onChange={handleChange}
        />
       {inputs.email !== "" && <span>Email</span>}
      </div>

      <div className='inputBox'>
      <input
        id="password"
        placeholder='Password' 
        type="password" 
        name="password" 
        value={inputs.password || ""}
        required 
        onChange={handleChange}
      />
      
       {inputs.password !== "" && <span>Password</span>}
        {showPassword && (
          <FaEye onClick={showHidePassword} style={eyeStyle}/>
        )}
        {!showPassword && (
           <FaEyeSlash onClick={showHidePassword} style={eyeStyle}/>
        )}
      </div>
        
        
        {emailExists && (
          <div className='pass-match-error'>
              <p>Email not registered!</p>
          </div>
        )}
        {invalidPassword && (
          <div className='pass-match-error'>
              <p>Incorrect Password!</p>
          </div>
        )}
        {invalidCredentails && (
          <div className='pass-match-error'>
              <p>Please enter valid Login Credentials!</p>
          </div>
        )}
        
        <input className="loginBtn" type="submit" value="Login" /><br/>
        <span className="forgot"><Link to={"/user/verify-email"}>forgot password?</Link></span><br/><br/>
        <div className="notReg">
            <p className="notregtext">Don't have an account?</p> 
            <Link className="login" to={"/register"}>Create One</Link>
        </div>
       
    </form>
    </div>
  )
}

export default Login
