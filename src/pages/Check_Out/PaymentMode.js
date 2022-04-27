import React,{useState} from 'react'
import {useEffect, useNavigate} from "react-router-dom"; 
import Confirmation from './Confirmation';
function PaymentMode() {
    const navigate = useNavigate();
    const [currentRadioValue, setCurrentRadioValue] = useState();
    const [submitOrderDetails, setSubmitOrderDetails] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    // const [user,setUser] = useState({});
    // useEffect(()=>{
    //     let curr_user = JSON.parse(localStorage.getItem("user"));
    //     setUser(curr_user);
    // },[])

    const handlePrev=()=>{
        navigate(-1);
    }

    const handleConfirm=()=>{
        if(currentRadioValue === "cod"){
            setSubmitOrderDetails(true);
            setPaymentStatus("not paid");
            setPaymentMethod(currentRadioValue.toUpperCase());
        }
        // else if(currentRadioValue === "payolnine"){

        // }
    }
    
    const handleRadioChange = (e) => {
        console.log(e.target.value)
        setCurrentRadioValue(e.target.value);
    };
  return (
      <>
        {!submitOrderDetails && (
        <div className="payment-method-screen" >
        <h3 className='payment-heading'>Select Payment Method</h3>
        <div className='payment-method-screen-inner'>
            <div className="form-check" style={{marginTop:'1.5rem'}}>
                <input className="pay-online-input" 
                 name="pay-olnine"
                 type="radio"
                 value="payolnine"
                 onChange={handleRadioChange}
                 checked={currentRadioValue === 'payolnine'} />
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
        </div>
      )}
      
      {submitOrderDetails && (
          <Confirmation paymentStatus={paymentStatus} paymentMethod={paymentMethod}/>
      )}
      </>
    
  )
}

export default PaymentMode
