import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import {useParams, useNavigate, Link} from "react-router-dom";
import {Stock_Service} from "../../services/Service"; 
import Loader from "../../components/Loader";
import PopUp from "../../components/PopUp";
import {FaArrowLeft} from "react-icons/fa";
let Admin ={};
function ViewEditStock() {
    const [totalCount, setTotalCount]=useState("");
    const [countInStock, setCountInStock]=useState("");
    const [errorMsg, setErrorMsg]= useState("");
    const [responseNotReturned, setResponseNotReturned ] = useState();
    const [showLoader, setShowLoader] = useState(false);
    const [valueNotUpdated, setValueNotUpdated] = useState(true);
    const [messageSuccess, setMessageSuccess] = useState("");
    const [stock, setStock]= useState({});
    let curr_user = JSON.parse(localStorage.getItem('user'));
    let params = useParams();
    let navigate = useNavigate();
    useEffect(()=>{
        // console.log(params.code);
        if(curr_user && curr_user.role === "admin"){
            Admin = curr_user;
        }else{
            Admin=null;
        }
        getStockDetails(params.code);
    },[])
    
    const getStockDetails = async (bookcode)=>{
        const response = await Stock_Service.getStockDetails(bookcode);
        if(response.status===200){
            const returnedData = await response.json();
            // console.log(returnedData);
            setTotalCount(returnedData.total_count);
            setCountInStock(returnedData.count_in_stock);
            setStock(returnedData);
        }else if(response.status === 204){
            setStock(null);
            // console.log("No stock details available");
        }else {
            console.log("There was some error");
        }
    }
    const handleTotalCount = (e)=>{
        const value= e.target.value;
        setValueNotUpdated(false);
        setTotalCount(Number(value));
    }
    const handleCountInStock = (e)=>{
        const value= e.target.value;
        setValueNotUpdated(false);
        setCountInStock(Number(value));

    }
    const handleUpdateStock = async(e)=>{
        e.preventDefault();
        setResponseNotReturned(true);
        setShowLoader(true);
        let stockObj = {
            total_count:totalCount,
            count_in_stock:countInStock
        }
        // console.log(stockObj);
        const response = await Stock_Service.editStockDetails(Admin.token,stock._id,stockObj);
        if(response.status === 200){
            // const updatedStock = await response.json();
            // console.log(updatedStock);
            setMessageSuccess("Stock Details Updated");
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
    const handleCancel = ()=>{
        navigate(-1); 
    }
    const handleBack = ()=>{
        navigate(-1);
    }
  return (
    <EditStockOuter>
        <span className='back-arrow-span' title="back" onClick={handleBack}>
            <FaArrowLeft className='back-arrow'/>
        </span>
        {messageSuccess !== "" && (
            <PopUp messageSuccess={messageSuccess}/> 
        )}
    {stock && (
      <EditStockDiv > 
        {showLoader && (< Loader/>)}
          <h4>Edit Stock Details</h4>
            <form className={responseNotReturned?"stockformDim":""} onSubmit={handleUpdateStock}>
             {errorMsg !=="" && (
             <p className='error-msg'>
                {errorMsg} 
             </p>) }   
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
                <div className="edit-stock-div">
                    <button className="btn-cancel" type="button" onClick={handleCancel}>CANCEL</button> 
                    <button  className={valueNotUpdated?"edit-stock-btn disableBtn ":'edit-stock-btn'} type="submit" disabled={valueNotUpdated} >UPDATE STOCK </button>
                </div>
            </form>
    </EditStockDiv>
    )}
    {!stock && (
        <div style={{width:'80%', margin:'0 auto', textAlign:'center'}}>
        <p style={{color:'red',padding:'10px', fontWeight:'600'}}>No stock details available</p>
        <Link className='link-to-addstock' to={"/admin-panel/manage-books/add-item/add-stock/"+params.code}>Click here to add stock details</Link>
        </div>
     )} 
    </EditStockOuter>
  )
}
const EditStockOuter = styled.div`
    width:70%;
    margin:0 auto;
    @media (max-width:650px){
        width: 95%;
    }
    .link-to-addstock{
        padding-left:10px;
        color:blue;
        font-size: small;
        text-decoration: underline;
    }
`;
const EditStockDiv = styled.div`
    width:80%;
    margin:0 auto;
    border-left: 1px solid grey;
    margin-top: 1rem;
    box-shadow: 2px 2px 2px grey;
    @media (max-width:650px){
      width: 100%;
      font-size: 0.9rem;
    }
    
    .disableBtn{
        opacity: 0.6;
        cursor: move;
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
          width:100%;
      }
    }
    .edit-stock-div{
      text-align: center;
      margin-top:10px;
      display:flex;
      justify-content: space-between;
      width:100%;
    }
    .edit-stock-btn{
      width: 40%;
      padding: 10px;
      border-radius: 3px;
      border:none;
      cursor: pointer;
      background-color: blue;
      color:white;
      /* &:hover{
        opacity: 0.9;
      } */
      @media (max-width:650px){
        padding:8px;
      }
    }
    .btn-cancel{
        background-color: red;
        padding: 8px 12px;
        border-radius: 3px;
        width:30%;
        font-size: 1rem;
        border:none;
        color: white;
        &:hover{
            cursor: pointer;
            color:white;
            background: rgba(255, 0, 0, 0.842);
        }
    }
        
    /* .dxuhqf .lds-spinner */
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
export default ViewEditStock
