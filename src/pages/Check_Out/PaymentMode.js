import React,{useState,useEffect} from 'react'
import {useNavigate} from "react-router-dom"; 
import Confirmation from './Confirmation';
import styled from "styled-components";
import PopupFailure from '../../components/PopupFailure';
function PaymentMode() {
    const navigate = useNavigate();
    const [currentRadioValue, setCurrentRadioValue] = useState();
    const [submitOrderDetails, setSubmitOrderDetails] = useState(false);
    // const [confirmed, setConfirmed] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [messageFailure, setMessageFailure] = useState("");
    // const [user,setUser] = useState({});
    useEffect(()=>{
        window.scrollTo(0,0);
        // let curr_user = JSON.parse(localStorage.getItem("user"));
        // setUser(curr_user);
        // if(confirmed){
        //     navigate("/");
        //     return;
        // }
    },[])

    const handlePrev=()=>{
        navigate(-1);
    }

    const handleConfirm=()=>{
        // console.log(currentRadioValue);
        if(currentRadioValue === undefined){
            // alert("Please select any payment method");
            setMessageFailure("Please select any payment method");
            setTimeout(()=>{
                setMessageFailure("");
            },5000)
            return;
        }
        if(currentRadioValue === "cod"){
            setSubmitOrderDetails(true);
            setPaymentStatus("Not paid");
            setPaymentMethod(currentRadioValue.toUpperCase());
        }
        else if(currentRadioValue === "payonline"){
            setMessageFailure("Online Payment temporarily suspended!! try other options");
            setTimeout(()=>{
                setMessageFailure("");
            },5000)
            return;
        }
    }
    
    const handleRadioChange = (e) => {
        // console.log(e.target.value)
        setCurrentRadioValue(e.target.value);
        if( e.target.value === "payonline"){
            setMessageFailure("Online Payment temporarily suspended!! try other options");
            setTimeout(()=>{
                setMessageFailure("");
            },5000)
            return;
        }
    };
  return (
      <PaymentScreenOuter>
        {messageFailure !== "" && (
            <PopupFailure messageFailure={messageFailure}/> 
         )}
        {!submitOrderDetails && (
        <PaymentMethodScreen >
        <h3 className='payment-heading'>Select Payment Method</h3>
        <div className='payment-method-screen-inner'>
            <div className="form-check" >
            <input className="pay-online-input" 
                 name="pay-olnine"
                 type="radio"
                 value="payonline"
                 onChange={handleRadioChange}
                 checked={currentRadioValue === 'payonline'} 
                 />
                 <label className="pay-online-label" htmlFor="exampleRadios1">
                    Pay Online
                </label>
            </div>
            <div className="form-check">
                <input className="cod-input" 
                     name="cod"
                     type="radio"
                     value="cod"
                     onChange={handleRadioChange}
                     checked={currentRadioValue === 'cod'}
                 />
                <label className="cod-label" htmlFor="exampleRadios2">
                Cash On Delivery
                </label>
            </div>
            <div className="btns-div" style={{marginTop:'1.5rem'}}>
                    <button type="button"  name="pre" className="payment-btns btn-prev " onClick={handlePrev} >Previous</button>
                    <button type="button"  name="next" className="payment-btns btn-next" onClick={handleConfirm} >Confirm</button>
            </div>
        </div>        
        </PaymentMethodScreen>
      )}
      
      {submitOrderDetails && (
          <Confirmation paymentStatus={paymentStatus} paymentMethod={paymentMethod} />
      )}
      </PaymentScreenOuter>
    
  )
}

const PaymentScreenOuter = styled.div`

`;
const PaymentMethodScreen = styled.div`
    
    box-shadow: 3px 6px 7px 4px grey;
    width:40%;
    margin:0 auto;
    border:1px solid #808080b5;
    border-radius:5px;
    @media (max-width:850px){
        width:60%
    }
    @media (max-width:650px){
        width:85%;
    }
    .payment-btns{
        background-color: #e3e3e3;
        padding: 8px 12px;
        border-radius: 3px;
        width:20%;
        font-size: 1rem;
        border:none;
        @media (max-width:650px){
            width:35%;
        }
    }
    .form-check{
        margin-top:1rem;
    }
    .payment-heading{
        text-align: center;
        background: grey;
        padding: 10px;
        color: white;
    }
    .payment-method-screen-inner{
        padding: 30px;
        @media (max-width:650px){
            padding: 20px;
        }
    }
    .pay-online-label{
        margin-left:1rem;
        font-size: 1.2rem;
        font-weight: 600;
    }
    .cod-label{
        margin-left:1rem;
        font-size: 1.2rem;
        font-weight: 600;
    }

    .pay-online-input{
        transform: scale(1.5);
    }
    .cod-input{
        transform: scale(1.5);
    }
    .btns-div{
        display:flex; 
        justify-content:space-between;
    }
    .btn-prev, .btn-next {
        font-size: 1rem;
        color: blue;
        border-radius: 3px;   
    }

    .btn-prev:hover, .btn-next:hover {
        cursor: pointer;
        background:rgba(0, 0, 255, 0.788);
        color:white;
    }
`;
export default PaymentMode
