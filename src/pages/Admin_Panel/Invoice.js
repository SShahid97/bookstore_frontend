import React, { useEffect,useState } from 'react'
import styled from "styled-components";
import {useParams, useNavigate} from "react-router-dom";
import { Order_Service, Address_Service, Auth_Service } from '../../services/Service';
import Loader from "../../components/Loader";
import {FaArrowLeft} from "react-icons/fa";
function Invoice() {
    const [showLoader, setShowLoader] = useState(false);
    const [customerOrder, setCustomerOrder]= useState({});
    const [userAddress, setUserAddress]= useState({});
    const [userInfo, setUserInfo]= useState({});
    const [todayDate, setTodayDate]= useState();
    const [invoiceNumebr, setInvoiceNumebr]= useState();
    let params = useParams();
    let navigate = useNavigate();
    let admin = JSON.parse(localStorage.getItem('user'));
    useEffect(()=>{
        setShowLoader(true);
        if(admin){
            getOrder(admin, params.id); 
            generateDateAndInvoiceNumber();
        }
    },[]);

    const generateDateAndInvoiceNumber = ()=>{
        let today = new Date();
        let todayDate = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        setTodayDate(todayDate);
        let invoiceNum = Math.floor((Math.random() * 1000000) + 1);
        setInvoiceNumebr(invoiceNum);
    } 
    const getOrder = async(admin,order_id)=>{
        if (admin && admin.role === "admin") {
          const response = await Order_Service.searchOrderById(admin.token, order_id);
          if (response.status === 204) {
            setShowLoader(false);
            setCustomerOrder(null);
            alert("Sorry there was some error!");
          } else if (response.status === 400) {
              setShowLoader(false);
              setCustomerOrder(null);
            alert("Sorry there was some error!");
          }
          else if (response.status === 200) {
            const returnedOrder = await response.json();
            console.log(returnedOrder);
            getUserAddress(admin.token,returnedOrder.user_id);
            getUserInfo(admin.token,returnedOrder.user_id);
            setCustomerOrder(returnedOrder);
            setShowLoader(false);
          }
          
        }

    }
    const getUserAddress = async(token, userId)=>{
        const response = await Address_Service.getUserAddress(token,userId);
        if(response.status === 200){
            const returnedAddress = await response.json();
            setUserAddress(returnedAddress);
            console.log(returnedAddress);
            setShowLoader(false);
        }else if (response.status === 204){
            setUserAddress(null);
            setShowLoader(false);
        }else if (response.status === 400){
            setUserAddress(null);
            console.log("Bad Request");
        }
    }
    const getUserInfo = async (token, userId)=>{
        const response = await Auth_Service.getUser(token,userId);
        if(response.status === 200){
            const returnedUserInfo = await response.json();
            setUserInfo(returnedUserInfo)
            console.log(returnedUserInfo);
        }else if (response.status === 204){
            setUserInfo(null);
            setShowLoader(false);
        }else if (response.status === 400){
            setUserInfo(null);
            console.log("Bad Request");
        }

        
    }
    const handleDownloadInvoice = ()=>{
        window.onafterprint = window.close;  //prevents the browser from closing
        window.print();
    }
    const handleBack = ()=>{
        navigate(-1);
    }
  return (
      <>
      {showLoader && (< Loader/>)}
      {!showLoader && (
       <InvoiceOuter className='invoice-bill'>
           <span className='back-arrow-span' title="back" onClick={handleBack}>
            <FaArrowLeft className='back-arrow'/>
            </span>
         <InvoiceInner >
            <div className='invoice-heading'>
                <div className='company-name'>
                    <h2>eBookstore.com</h2>
                </div>
                <div className='invoice-name'>
                    <h4>Invoice/Bill of Supply</h4>
                </div>
            </div>
            <div className='middle-part'>
                <div className='customer-addresses'>
                    <div className='billing-address'>
                        <h4>Billing Address:</h4>
                        <p>{userInfo.name}</p>
                        <p>{userAddress.address}</p>
                        <p>{userAddress.city}</p>
                        <p><span>{userAddress.state}</span> <span>{userAddress.pincode}</span> </p>
                        <p>{userAddress.country}</p>
                    </div>
                    <div className='shipping-address'>
                        <h4>Shipping Address:</h4>
                        <p>{userInfo.name}</p>
                        <p>{userAddress.address}</p>
                        <p>{userAddress.city}</p>
                        <p><span>{userAddress.state}</span>, <span>{userAddress.pincode}</span> </p>
                        <p>{userAddress.country}</p>
                    </div>
                </div>
                <div className='order-invoice'>
                    <div className='orderID-date'>
                        <p><strong>Order Number/ID:</strong> {customerOrder._id}</p>
                        <p><strong>Order Date:</strong> {customerOrder.date && customerOrder.date.split("T")[0]}</p>
                    </div>
                    <div className='invoice-number'>
                        <p><strong>Invoice Number:</strong> {invoiceNumebr}</p> 
                        <p><strong>Invoice Date:</strong> {todayDate}</p> 
                    </div>
                   
                </div>
            </div>
            

            
            <table style={{width:'100%'}}>
                    <thead>
                    <tr className='table-heading'>
                        <th className='description'>Item Description</th>
                        <th>Price</th>
                        <th>Discount</th>
                        <th>Quantity</th>
                        <th>Total Amount</th>
                    </tr>
                    </thead>
                <tbody>
                {/* 'item.price' is the discounted price */}
                    {customerOrder.order && customerOrder.order.map((item)=>{
                    return (
                    <tr key={item._id}>
                        <td className='description' style={{fontWeight:'600'}}><strong>{item.book.book_name}</strong> <br/> <span className='author-desc'> by {item.book.book_author} &nbsp;<span> <br/> {item.book.book_description}</span></span></td>
                        <td>&#8377;{item.book.price}</td>
                        <td>-&#8377;{item.book.price*item.book.discount}</td>
                        <td>{item.quantity}</td>
                        <td>&#8377;{(item.price*item.quantity)}</td>  
                     </tr> 
                    )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={4} className='description ' style={{fontWeight:'600'}}>Shipping Charges</td>
                        <td>&#8377;{customerOrder.shipping_charges}</td>
                    </tr>
                    <tr >
                        <td className='adjust-fonts description '  colSpan={4} >TOTAL:</td>
            
                        <td className='adjust-fonts' >&#8377;{customerOrder.total_amount}</td>
                    </tr>
                </tfoot>

            </table>
            <button className='download-invoice-btn' onClick={handleDownloadInvoice}>Download Invoice</button>
         </InvoiceInner>
     </InvoiceOuter>
     )}
     </>
  )
}

const InvoiceOuter = styled.div`
    width:100%;
    height:auto;
    padding:10px;
    @media (max-width:650px){
        padding:0px;
    }
    @media print {
        .download-invoice-btn{
            display: none;
        }
        .back-arrow-span{
            display:none;
        }
        
        h3, h4{
            break-before: always;
        }
        table{
            break-inside: avoid;
        }
    }
`;
const InvoiceInner = styled.div`
    width:70%;
    height: inherit;
    margin:0 auto;
    padding:10px;
    @media (max-width:650px){
        padding:0px;
        font-size: 0.9rem;
        width:100%;
    }
    .company-name{
        font-size: x-large;
    }
    .middle-part{
        display: flex;
        flex-direction: row;
        @media(max-width:650px){
            flex-direction: column;
        }
    }
    .invoice-heading {
        width:100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
        
    }
    .invoice-name{

        padding-top: 8px;
        h4{
            @media (max-width:650px){
               font-size: 0.8rem;
            }
        }
    }
    .customer-addresses{
        width:50%;
        @media (max-width:650px){
            width:100%;
        }
    }
    .order-invoice{
        width:50%;
         @media (max-width:650px){
            width:100%;
        }
    }

    .customer-addresses p{
        font-weight: 600;
    }
    .shipping-address{
        margin-top: 1rem;
    }
    table{
        margin-top:1rem;
        @media (max-width:650px){
            font-size: 0.8rem;
        }
    }
  table, th, td {
    border: 1px solid black;
    border-collapse: collapse;
    text-align: center;
 }

 table .table-heading{
    background: #cdcdcd;
    color: black;
    th{
        padding:5px !important;

    }
 }
  table .description{
    padding-left: 5px;
    text-align: left;
    width: 40%;
    font-size: 0.9rem;
    @media (max-width:650px){
        font-size: 0.7rem;
    } 
  }
  table .author-desc{
      font-size:0.8rem;
  }
  .adjust-fonts{
    font-size: 1.2rem;
    font-weight: 700;
    @media (max-width:650px){
        font-size: 1rem;
    }
    
  }
  .download-invoice-btn{
    background-color: blue;
    padding: 8px 10px;
    border: none;
    border-radius: 3px;
    color: white;
    cursor: pointer;
    margin-top: 10px;
    font-size: 1rem;
    width: 30%;
    @media (max-width:650px){
        width: 50%;
    }
  }
`;

export default Invoice

