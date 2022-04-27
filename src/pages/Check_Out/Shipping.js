import React, { useEffect, useState } from 'react';
import "./styles.css";
import {useParams, useNavigate} from "react-router-dom";

function Billing() {
    const states=['Jammu & Kashmir','Delhi','Rajasthan','Maharashtra','Gujrat','Assam','Andhra Pradesh','Madhya Pradesh'];
    // input fields
    const [fullName, setFullName]=useState('');
    const [email, setEmail]=useState('');
    const [contact, setContact]=useState('');
    const [country, setCountry]=useState('India');
    const [state, setState]=useState('');
    const [city, setCity]=useState('');
    const [postalCode, setPostalCode]=useState('');
    const [address, setAddress]=useState('');

    useEffect(()=>{
        let user = JSON.parse(localStorage.getItem("user"));
        setFullName(user.name);
        setEmail(user.email);
    },[])

    const navigate = useNavigate();
    
    const handleFullName=(e) => {
        setFullName(e.target.value);
    }
    const handleEmail = (e) => {
        setEmail(e.target.value);
    }
    const handleContact = (e) => {
        setContact(e.target.value)
    }
    const handlePostalCode = (e) => {
        setPostalCode(e.target.value)
    }
    const handleAddress = (e) => {
        setAddress(e.target.value)
    }
    const handleState = (e)=>{
        setState(e.target.value);
    }
    const handleCountry = (e)=>{
        setCountry(e.target.value);
    }
    const handleCity = (e) =>{
        setCity(e.target.value);
    }
    const handleBilling = (e)=>{
        e.preventDefault();
        let formObject = {
            fullName:fullName,
            email:email,
            contact:contact,
            country:country,
            state:state,
            city:city,
            postalCode:postalCode,
            address:address
        }
        localStorage.setItem("customerInfo", JSON.stringify(formObject));
        console.log(formObject);
        navigate("/checkout/revieworder");
        // setIsBilling(false);
        // setIsOrderPlaced(true);
        
        // localStorage.setItem("customerInfo", JSON.stringify(formObject));

    }

    const handleCancel = ()=>{
        navigate(-1);
    }

    return (
        <div className="outer-div" >
            <div className="inner-div">
            <h3 className='billing-heading'>Shipping Address</h3>
             {/* <div style={{margin:'0 auto'}}> */}
                <form onSubmit={handleBilling} className="billing-form"> 
                    <label htmlFor="name"><strong>Full Name<span >*</span>:</strong></label><br/>
                    <input type="text" className="form-control" name="name"  
                            placeholder="Enter full name"
                            onChange={handleFullName}
                            value={fullName}
                            required/>
                    <br/>
                    <label htmlFor="email"><strong>Email<span >*</span>:</strong></label><br/>
                    <input type="email" className="form-control" name="email" 
                            placeholder="Enter E-mail" 
                            onChange={handleEmail}
                            value={email}
                            required/>
                    <br/>
                    <label htmlFor="contact"><strong>Contact<span >*</span>:</strong></label><br/>
                    <input type="tel" className="form-control" name="contact" maxLength={12} 
                            placeholder="Contact Number" 
                            onChange={handleContact}
                            value={contact}
                            required/>
                    <br/>
                    <div className='country-state-fields'>
                        <div className='country-div'>
                            <label htmlFor="country"><strong>Country<span >*</span>:</strong></label><br/>
                            <input type="text" className="form-control" name="country" 
                                    onChange={handleCountry}
                                    value={country}
                                    disabled
                                    required
                            />
                        </div>
                        <div style={{width:'2%'}}></div>
                        <div className='state-div'>
                            <label htmlFor="state"><strong>State/UT<span >*</span>:</strong></label><br/>
                            <select  className="form-control" 
                                    value={state} 
                                    onChange={handleState}
                                    required>
                                <option value="">Choose</option>
                                {states.map((stat,index)=>{
                                    return <option key={index} value={stat}>{stat}</option>
                                })}
                            </select><br/>
                        </div>
                   
                    </div>
                    <div className='city-code-fields'>
                        <div className='city-div'>
                            <label htmlFor="city"><strong>City/Town/District<span >*</span>:</strong></label><br/>
                            <input type="text" className="form-control" name="city" 
                                    placeholder='City/Town/District'
                                    onChange={handleCity}
                                    value={city}
                                    required
                            />
                        </div>
                        <div style={{width:'2%'}}></div>
                        <div className='code-div'>
                            <label htmlFor="postalCode"><strong>Postal Code<span >*</span>:</strong></label><br/>
                            <input type="text" maxLength={6} className="form-control" 
                                    placeholder="Postal code" 
                                    onChange={handlePostalCode}
                                    value={postalCode}
                                    required/>
                        </div>
                    </div>
                    
                    <label htmlFor="contact"><strong>Address<span >*</span>:</strong></label><br/>
                    <textarea name="textarea"  rows="3" className="form-control"
                              placeholder='Address'
                              onChange={handleAddress}
                              value={address}
                              required/><br/>
                    <br/>
                <div className='btns-div' >
                    <button className="billing-btns btn-cancel" type="button" onClick={handleCancel}>Cancel</button>    
                    <input type="submit"  name="next" className="billing-btns btn-billingNextBtn" value="Next"/>
                </div>
                  
                </form>
            {/* </div> */}
            </div>
        </div>
    )
}

export default Billing
