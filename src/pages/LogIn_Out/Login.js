import React from 'react'
import { useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./styles.css";
import {userService, cartService} from "../../services/LocalService";
import {Auth_Service,Cart_Service} from "../../services/Service";
// icon imports
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";


function Login() {
    const [inputs, setInputs] = useState({});
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [invalidCredentails,setInvalidCredentials] = useState(false);
    const [loginSuccessMessage, setLoginSuccessMessage] = useState("");

    // useEffect(()=>{

    //   return setLoginSuccess(false);
    // },[])
    const handleChange = (event) => {
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
    
   function sendUser(user) {
    // send message to subscribers via observable subject
    userService.sendUser(user);
  }

    const loginForm = async (event) => {
      event.preventDefault();
        // try{

        // }catch(err){

        // }
        const response = await Auth_Service.onLogin(inputs);

        if(response.status === 200){
            setInvalidCredentials(false);
            setLoginSuccessMessage("Login Success");
            setTimeout(()=>{
              setLoginSuccessMessage("");
            },5000)
            const user = await response.json();
            sendUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            if(user.role === "admin"){
              console.log("admin")
              navigate("/admin-panel/viewallitems")
              return;
            }
            getCartItems();
            // if()
            // navigate(-1);   //redirect back to previous page (url/link)   
        }
        else if (response.status === 400) {
            setInvalidCredentials(true);
            console.log("There was some error: ",response.statusText)
        }
    }  

    const getCartItems = async()=>{
      let user = JSON.parse(localStorage.getItem('user'));
      try{
          const cartResponse = await Cart_Service.getCartItems(user._id, user.token);
          cartService.updateCartItems(cartResponse.length);
          localStorage.setItem("cart",JSON.stringify(cartResponse));
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
        
        {showPassword && (
          <FaEye onClick={showHidePassword} style={eyeStyle}/>
        )}
        {!showPassword && (
           <FaEyeSlash onClick={showHidePassword} style={eyeStyle}/>
        )}
       
       {invalidCredentails && (
          <div className='pass-match-error'>
              <p>Please enter valid Login Credentials!</p>
          </div>
        )}
         <input className="loginBtn" type="submit" value="Login" /><br/>
        <span className="forgot"><Link to={"#"}>forgot password?</Link></span><br/><br/>
        <div className="notReg">
            <p className="notregtext">Don't have an account?</p> 
            <Link className="login" to={"/register"}>Create One</Link>
        </div>
       
    </form>
    </div>
  )
}

export default Login
