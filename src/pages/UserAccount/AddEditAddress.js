import React,{useEffect, useState} from 'react';
import {useParams,useNavigate} from "react-router-dom";
import styled from "styled-components";
import { Address_Service } from '../../services/Service';
import Loader from "../../components/Loader";
import PopUp from "../../components/PopUp";
import {FaArrowLeft} from "react-icons/fa";


function AddEditAddress() {
    const states=['Jammu & Kashmir','Delhi','Rajasthan','Maharashtra','Gujrat','Assam','Andhra Pradesh','Madhya Pradesh'];
    // input fields
    const [contact, setContact]=useState('');
    const [country, setCountry]=useState('India');
    const [state, setState]=useState('');
    const [city, setCity]=useState('');
    const [postalCode, setPostalCode]=useState('');
    const [address, setAddress]=useState('');
    const [addEditHead, setAddEditHead]=useState('');
    const [saveUpdate, setSaveUpdate]=useState('');
    const [messageSuccess, setMessageSuccess] = useState("");
    const [addressExits, setAddressExits]=useState(false);
    const [responseNotReturned, setResponseNotReturned] = useState(false);
    const [alreadySavedAddress, setAlreadySavedAddress] = useState({});
    const [notTouched, setNotTouched] = useState(true);
    const [showLoader, setShowLoader] = useState(false);
    let params = useParams();
    let navigate = useNavigate();
    let curr_user = JSON.parse(localStorage.getItem("user"));
    useEffect(()=>{
        // console.log(params.type);
        if(curr_user){
            getUserAddressIfAny(curr_user.token,curr_user._id);
            
            if(params.type === "add"){
                setAddEditHead("Add");
                setSaveUpdate("Save Address");
            }else if(params.type==="edit"){
                setAddEditHead("Edit");
                setSaveUpdate("Update Address");
            }
        }
       
    },[]);
    const getUserAddressIfAny = async(token, userId) =>{
        const response = await Address_Service.getUserAddress(token,userId);
        if(response.status === 200){
           const  addressReturned = await response.json();
        //    setRegisteredUserAddress(addressReturned);
            // console.log(addressReturned);
            setAlreadySavedAddress(addressReturned);
            //set form input values to the returned address values
            setContact(addressReturned.contact);
            setPostalCode(addressReturned.pincode);
            setAddress(addressReturned.address);
            setCountry(addressReturned.country);
            setState(addressReturned.state);
            setCity(addressReturned.city);
            setAddressExits(true);
        }else if (response.status === 204){
            setAddressExits(false);
            // console.log("No address saved");
        }
    }
    const handleContact = (e) => {
        setContact(e.target.value);
        setNotTouched(false);
    }
    const handlePostalCode = (e) => {
        setPostalCode(e.target.value);
        setNotTouched(false);
    }
    const handleAddress = (e) => {
        setAddress(e.target.value);
        setNotTouched(false);
    }
    const handleState = (e)=>{
        setState(e.target.value);
        setNotTouched(false);
    }
    const handleCountry = (e)=>{
        setCountry(e.target.value);
        setNotTouched(false);
    }
    const handleCity = (e) =>{
        setCity(e.target.value);
        setNotTouched(false);
    }
    const handleSubmitAddress = async(e)=>{
        e.preventDefault();
        setResponseNotReturned(true);
        setShowLoader(true);
        let addressObj = {
            user_id: curr_user._id,
            contact:contact,
            country:country,
            state:state,
            city:city,
            pincode:postalCode,
            address:address
        }
        if(!addressExits){
            // Add new address
            // console.log(addressObj);
            const response = await Address_Service.addAddress(curr_user.token,addressObj);
            if(response.status === 201){
                // const savedAddress = await response.json();
                setMessageSuccess("Address Saved!");
                setTimeout(()=>{
                    setMessageSuccess("");
                },4000);
                // console.log(savedAddress);
                setShowLoader(false);
                setResponseNotReturned(false);
            }else if(response.status === 204){
                setResponseNotReturned(false);
                setShowLoader(false);
                // console.log("Address not saved");
            }else if(response.status===400){
                setResponseNotReturned(false);
                setShowLoader(false);
                console.log("There was some",response);
            }
        }else{
            let addressUpdatedObj = {
                contact:contact,
                country:country,
                state:state,
                city:city,
                pincode:postalCode,
                address:address
            }
            //change existing address
            const response =await Address_Service.updateAddress(curr_user.token,alreadySavedAddress._id,addressUpdatedObj);
            if(response.status===200){
                const updatedAddress = await response.json();
                // console.log(updatedAddress);
                setMessageSuccess(updatedAddress.message);
                setTimeout(()=>{
                    setMessageSuccess("");
                },4000);
                setShowLoader(false);         
                setResponseNotReturned(false);
                setNotTouched(true);
            }else if(response.status===204){
                setResponseNotReturned(false);
                setShowLoader(false); 
                // console.log("Address not updated");
            }else if(response.status===400){
                    setShowLoader(false); 
                setResponseNotReturned(false);
                console.log("There was some");
            }
        }
    }
    const handleBack=()=>{
        navigate(-1); 
    }
  return (
     <EditAddAddressOuter>
        <span className='back-arrow-span' title="back" onClick={handleBack}>
            <FaArrowLeft className='back-arrow'/>
        </span>
        <EditAddAddressInner>
        {messageSuccess !== "" && (
            <PopUp messageSuccess={messageSuccess}/> 
        )}
         {showLoader && (< Loader/>)} 
            <h3 className='add-edit-address-heading'>{addEditHead } Address</h3>
                <form onSubmit={handleSubmitAddress} className={responseNotReturned?"stockformDim add-edit-address-form":"add-edit-address-form"} > 
                    <div className='country-state-fields'>
                        <div className='country-div'>
                            <label htmlFor="country"><strong>Country<span >*</span>:</strong></label><br/>
                            <input type="text" className="form-control" name="country" 
                                    onChange={handleCountry}
                                    value={country || ""}
                                    disabled
                                    required
                            />
                        </div>
                        <div style={{width:'2%'}}></div>
                        <div className='state-div'>
                            <label htmlFor="state"><strong>State/UT<span >*</span>:</strong></label><br/>
                            <select  className="form-control" 
                                    value={state  || ""} 
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
                                    value={city || ""}
                                    required
                            />
                        </div>
                        <div style={{width:'2%'}}></div>
                        <div className='code-div'>
                            <label htmlFor="postalCode"><strong>Postal Code<span >*</span>:</strong></label><br/>
                            <input type="text" maxLength={6} className="form-control" 
                                    placeholder="Postal code" 
                                    onChange={handlePostalCode}
                                    value={postalCode || ""}
                                    required/>
                        </div>
                    </div>
                    <label htmlFor="contact"><strong>Contact<span >*</span>:</strong></label><br/>
                    <input type="tel" className="form-control" name="contact" maxLength={10} 
                            placeholder="Contact Number" 
                            onChange={handleContact}
                            value={contact}
                            required/>
                    <br/> 
                    <label htmlFor="contact"><strong>Address<span >*</span>:</strong></label><br/>
                    <textarea name="textarea"  rows="3" className="form-control"
                              placeholder='Address'
                              onChange={handleAddress}
                              value={address || ""}
                              required/><br/>
                    <br/>
                    <div className='btns-div' >  
                        <input type="submit"  name="next"  disabled={notTouched} className={notTouched?"disableSaveBtn save-btn":"save-btn"} value={saveUpdate}/>
                    </div>
                    
                </form>
         </EditAddAddressInner>
     </EditAddAddressOuter>   
  )
}


const EditAddAddressOuter = styled.div`
    display:block;
    width: 70%;
    margin: 0 auto;
    margin-top:1rem;
    margin-bottom: 1rem;
    @media (max-width:850px){
        width:80%;
    }
    @media (max-width:650px){
        width: 95%;
        margin-top: -15px;
    }
    .back-arrow-span{
        position:relative;
        @media (max-width:650px){
        display:none;
        }
    }
`;

const EditAddAddressInner = styled.div`
    box-shadow: 3px 4px 5px grey;
    width:70%;
    margin: 0 auto;
    border:1px solid #808080b5;
    border-radius: 5px;
    @media (max-width:850px){
        width:80%;
    }
    @media (max-width:650px){
        width: 95%;
        font-size: 0.9rem;
    }
    .add-edit-address-heading{
        text-align: center;
        background: gray;
        padding: 10px;
        color: white;
    }
    .add-edit-address-form{
        padding:30px;
        @media (max-width:650px){
            padding:15px;
        }
    }

    span{
        color:red;  
    }
    .form-control{
        width: 100% !important;
        height:inherit !important;
        margin-bottom: 8px;
        font-size: 15px;
        padding: 8px 5px;
        border: 1px solid #9e9e9e73;
        border-radius: 3px;
        outline:none;
    }

    .disableSaveBtn{
      opacity: 0.7;
    }
    .save-btn{
        background-color: blue;
        padding: 8px 12px;
        border-radius: 3px;
        width:30%;
        font-size: 1rem;
        border:none;
        color:white;
        cursor: pointer;
        @media (max-width:650px){
            width:40%;
        }
    }

    .btn-cancel{
        color: red;
    }
    .btn-cancel:hover{
        cursor: pointer;
        color:white;
        background: rgba(255, 0, 0, 0.842);
    }

    .btns-div{
        display:flex; 
    }

    .country-state-fields{
        display: flex;
        width:100%;
    }
    .country-div{
        width:100%;
    }

    .state-div{
        width:100%;
    }

    .city-code-fields{
        display: flex;
        width:100%;
    }
    .city-div{
        width:60%;
    }

    .code-div{
        width:40%;
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
`;
export default AddEditAddress
