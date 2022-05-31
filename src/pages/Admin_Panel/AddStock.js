import React, { useState, useEffect } from 'react'
import styled from "styled-components";
import {Stock_Service} from "../../services/Service"; 
import Loader from "../../components/Loader";
import PopUp from "../../components/PopUp";

let Admin = {};
function AddStock() {
    const [bookCode, setBookCode]= useState("");
    const [totalCount, setTotalCount]=useState("");
    const [countInStock, setCountInStock]=useState("");
    const [errorMsg, setErrorMsg]= useState("");
    const [responseNotReturned, setResponseNotReturned ] = useState();
    const [showLoader, setShowLoader] = useState(false);
    const [messageSuccess, setMessageSuccess] = useState("");
    const [invalidInput, setInvalidInput] = useState(false);
    let curr_user = JSON.parse(localStorage.getItem('user'));
    
    useEffect(()=>{
        window.scrollTo(0,0);
        if(curr_user && curr_user.role === "admin"){
            Admin = curr_user;
        }else{
            Admin=null;
        }
        localStorage.removeItem("OrderId")
    },[])
    const handleBookCode = (e)=>{
        const value = e.target.value;
        setBookCode(value);
        setErrorMsg("");
    }
    const handleTotalCount = (e)=>{
        const value= e.target.value;
        setTotalCount(Number(value));
    }
    const handleCountInStock = (e)=>{
        const value= e.target.value;
        setCountInStock(Number(value));
    }
    const handleAddStock = async(e)=>{
        setResponseNotReturned(true);
        setShowLoader(true);
        e.preventDefault();
        let stockObj = {
            book_code:bookCode,
            total_count:totalCount,
            count_in_stock:countInStock
        }
        // console.log(stockObj);
        const response = await Stock_Service.addStockDetails(Admin.token,stockObj);
        if(response.status === 201){
            const addedStock = await response.json();
            // console.log(addedStock);
            setMessageSuccess("Stock Details Added");
            setTimeout(()=>{
                setMessageSuccess("");
            },5000)
            setResponseNotReturned(false);
            setShowLoader(false);
        }else if(response.status === 422){
            const error = await response.json();
            setErrorMsg(error.message);
            // console.log(error.message);
            setResponseNotReturned(false);
            setShowLoader(false);
        }else if(response.status === 400){
            const error = await response.json();
            setErrorMsg(error.message);
            // console.log(error.message);
            setResponseNotReturned(false);
            setShowLoader(false);
        }
    }
    const handleKeys = (e) => {
        if (e.which === 32) {
          // console.log('Space Detected');
          setInvalidInput(true);
          return false;
        } else {
          setInvalidInput(false);
        }
      }
  return (
      <AddStockDiv >
        {messageSuccess !== "" && (
            <PopUp messageSuccess={messageSuccess}/> 
        )} 
        {showLoader && (< Loader/>)}
          <h4>Add Stock Details</h4>
            <form className={responseNotReturned?"stockformDim":""} onSubmit={handleAddStock}>
             {errorMsg !=="" && (
             <p className='error-msg'>
                {errorMsg} 
             </p>) }   
            <label htmlFor="book_code"><strong>Book Code<span >*</span>:</strong></label><br/>
                <input
                    className='form-control'
                    placeholder="Book Code"
                    type="text"
                    name="book_code"
                    value={bookCode || ""}
                    required
                    onKeyDown={handleKeys}
                    onChange={handleBookCode}
                />
                {invalidInput && (
                    <div className='error-msg'>
                    <p>White Spaces are not allowed</p>
                    </div>
                )}
                <label htmlFor="total_count"><strong>Total Count<span >*</span>:</strong></label><br/>
                <input className='form-control'
                    placeholder="Total Count"
                    type="number"
                    name="total_count"
                    min={0}
                    value={totalCount}
                    required
                    onChange={handleTotalCount}
                />
                <label htmlFor="count_in_stock"><strong>Count In Stock<span >*</span>:</strong></label><br/>
                <input
                    className='form-control'
                    placeholder='Count In Stock'
                    type="number"
                    name="count_in_stock"
                    min={0}
                    value={countInStock}
                    required
                    onChange={handleCountInStock}
                />
                <div className="add-stock-div">
                    <button  className='add-stock-btn' type="submit" disabled={invalidInput} >ADD STOCK </button>
                </div>
            </form>
    </AddStockDiv>
  )
}

const AddStockDiv = styled.div`
    width:50%;
    margin:0 auto;
    border-left: 1px solid grey;
    margin-top: 1rem;
    box-shadow: 2px 2px 2px grey;
    @media (max-width:650px){
      width: 100%;
      font-size: 0.9rem;
    }
    /* .dxuhqf .lds-spinner */
    .lds-spinner{
        transform: translate(220px,140px);
        position: absolute;
        @media (max-width:650px){
            transform: translate(150px,140px); 
        }
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
    span{
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
          width:90%;
      }
    }
    .add-stock-div{
      text-align: center;
      margin-top:10px;
    }
    .add-stock-btn{
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
    .stockformDim{
        opacity: 0.6;
    }
`;

export default AddStock
