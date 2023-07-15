import React, {useEffect} from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Order_Service } from '../../services/Service';
import Loader from "../../components/Loader";
import PopUp from "../../components/PopUp";

// let Admin = {};
function SearchOrder() {
  const [orderId, setOrderId] = useState("");
  const [orderPlaced, setOrderPlaced] = useState({});
  const [notFoundMsg, setNotFoundMsg] = useState("");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [editOrderDetails, setEditOrderDetails] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");
  const [bookDummyImage, setBookDummyImage]= useState([]);
  let navigate = useNavigate();
  let curr_user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    let order_id = JSON.parse(localStorage.getItem("OrderId"));
    setBookDummyImage(['dummy_book_img.png']);
    if(order_id){
      getOrder(curr_user,order_id);
    }
    // return ( ()=>{ localStorage.removeItem("OrderId")} )
  }, []);
  

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    // console.log(orderId.length);
    let value = orderId;
    value = value.trim();
    // storing in localstorage for remeberance
    localStorage.setItem("OrderId",JSON.stringify(value));
    if (value.includes(" ")) {
      // console.log("space found");
      setInvalidInput(true);
      setNotFoundMsg(false);
      return;
    }
    await getOrder(curr_user, value);    
  }

  const getOrder = async(curr_user,value)=>{
    if (curr_user && curr_user.role === "admin") {
      const response = await Order_Service.searchOrderById(curr_user.token, value);
      if (response.status === 204) {
        setShowLoader(false);
        setIsOrderPlaced(false);
        setEditOrderDetails(false);
        setNotFoundMsg("No order found with the given Order Id");
      } else if (response.status === 400) {
        setShowLoader(false);
        setEditOrderDetails(false);
        setIsOrderPlaced(false);
        setNotFoundMsg("Invalid Order ID!");
      }
      else if (response.status === 200) {
        const returnedOrder = await response.json();
        // console.log(returnedOrder);
        setOrderPlaced(returnedOrder);
        setShowLoader(false);
        setNotFoundMsg(false);
        setIsOrderPlaced(true);
      }
    }
  }
  const handleSearch = (evt) => {
    setShowClose(true);
    setOrderId(evt.target.value);
    if (evt.target.value === "") {
      setShowClose(false);
      setEditOrderDetails(false);
    }
  }
  const handleKeys = (e) => {
    if (e.which === 32) {
      // console.log('Space Detected');
      setInvalidInput(true);
      setNotFoundMsg(false);
      return false;
    } else {
      setInvalidInput(false);
    }
  }
  const handleCloseIcon = () => {
    setOrderId("");
    setNotFoundMsg("");
    setIsOrderPlaced(false);
    setOrderPlaced({});
    setEditOrderDetails(false);
    setShowClose(false);
    setInvalidInput(false);
  }

  const handleDeliveryStatus =(e)=>{
    const value = e.target.value;
    setDeliveryStatus(value);
    // console.log(value);
  }

  const handlePaymentStatus = (e)=>{
    const value = e.target.value;
    setPaymentStatus(value);
    // console.log(value);
  }
  const onEditDetailsSubmit = async(e)=>{
    e.preventDefault();
    let detailsObj = {
      payment_status:paymentStatus,
      delivery_status:deliveryStatus
    }
    const response = await Order_Service.updateOrder(curr_user.token,orderPlaced._id,detailsObj);
    if(response.status === 200){
      // const updatedOrder = await response.json();
      // alert("Order Updated");
      setMessageSuccess("Order Updated");
      setTimeout(()=>{
          setMessageSuccess("");
      },5000)
      getOrder(curr_user,orderId);
      setEditOrderDetails(false);
    }else{
      alert("Order not updated!")
    }
   
  }
  const handleEditOrder = ()=>{
    setEditOrderDetails(!editOrderDetails);
    setDeliveryStatus(orderPlaced.delivery_status);
    setPaymentStatus(orderPlaced.payment_status)
  }

  const handleGenerateInvoice = ()=>{
    // setShowInvoice(true);
    navigate("invoice/"+orderId);
  }
  return (
    <SearchedOrders>
       {messageSuccess !== "" && (
            <PopUp messageSuccess={messageSuccess}/> 
        )}
      <FormStyle onSubmit={submitHandler}>
        <div className='form-div'>
          <FaSearch></FaSearch>
          <input placeholder='Search by Order ID'
            className='search-bar'
            onKeyDown={handleKeys}
            onChange={handleSearch}
            type="text" 
            value={orderId}
            required />
          {showClose && (
            <span className='close-icon'>
              <FaTimes onClick={handleCloseIcon} title="clear" />
            </span>
          )}
          <button type="submit"><FaSearch></FaSearch></button>
          {invalidInput && (
            <div className='error-msg'>
              <p>White Spaces are not allowed</p>
            </div>
          )}
        </div>

      </FormStyle>
      <hr/>
      {showLoader && (< Loader/>)}
      {isOrderPlaced && (
        <>
        <OrderedItem onClick={handleEditOrder}>
          {orderPlaced.user_name && <h4 style={{marginLeft:'5px'}}>Order Placed by {orderPlaced.user_name}</h4>}
          {!showLoader && (      
          <div className='orders' key={orderPlaced._id} >
            <div className='dateOrderPlacedAt'>
              <h4 className='order-heading'>Date</h4>
                {/* {orderPlaced.date} */}
                {/* &nbsp;&nbsp;<span style={{fontSize:'12px',color: 'darkblue'}}>{orderPlaced.time}</span> */}
              {orderPlaced.date.split("T")[0]}
            </div>
            <div className='orderID'>
              <h4 className='order-heading'>Order ID</h4>
              {orderPlaced._id}
            </div>
            <div className='orderItems'>
            <h4 className='order-heading'>Order Info</h4>
              {
                orderPlaced.order.map((item) => {
                  return (
                    <div key={item._id} className="individual-book">
                      <div className='book-details'>
                        <p><span>Book Name:</span>{item.book.book_name}</p>
                        <p><span>Book Author:</span>{item.book.book_author}</p>
                        <p><span>Quantity:</span> {item.quantity}</p>
                        <p><span>Price: </span>&#8377;{item.price.toFixed(2)} 
                        {item.discount>0 && (<span> (with discount)</span>)}  </p>
                        <p><span>Discount:</span>{item.discount * 100}%</p>
                        
                      </div>
                      
                      <div className='book-image'>
                       {item.book.book_image && <img src={require(`../../../public/assets/images/${item.book.book_image}`)} alt={item.book.book_name} />}
                       {!item.book.book_image && <img src={require(`../../../public/assets/images/${bookDummyImage}`)} alt={item.book.book_name} />}
                      </div>
                    </div>
                  )
                })
              }
              <p className='total-amt'>Delivery Charges: &#8377;{orderPlaced.shipping_charges}</p>
              <p className='total-amt'>Total Amount: &#8377;{orderPlaced.total_amount}</p>
              <p className='total-amt'><span>Payment Status: </span>{orderPlaced.payment_status}</p>
              <p className='total-amt'><span>Delivery Status: </span>{orderPlaced.delivery_status}</p>
            </div>
          </div>
          )}
         
        </OrderedItem>
         <div className='generate-invoice'>
          <button onClick={handleGenerateInvoice}>Generate Invoice</button>
        </div>
        </>
      )}
      {notFoundMsg && (
        <h3 className='not-found'>{notFoundMsg}</h3>
      )} 

      {editOrderDetails && (
      <EditDetails>
        <h4>Edit Order Details</h4>
          <form className="editDetailsForm" onSubmit={onEditDetailsSubmit}>
              <label htmlFor="delveryStatus"><strong>Delivery Status<span >*</span>:</strong></label>
              <select  className="form-control" 
                value={deliveryStatus  } 
                onChange={handleDeliveryStatus}
                required>
                <option value="Not Delivered">Not Delivered</option>
                <option value="Delivered">Delivered</option>
              </select><br/>
             
              <label htmlFor="paymentStatus"><strong>Payment Status<span >*</span>:</strong></label>
             <select  className="form-control" 
                value={paymentStatus } 
                onChange={handlePaymentStatus}
                required>
                <option value="Not Paid">Not Paid</option>
                <option value="Paid">Paid</option>
              </select><br/>

              <div className='update-details-div'>
                <button type='submit' className='update-details-btn'>UPDATE</button>
              </div>
          </form>  
          {/* 627be03216b7c7109836bee9 */}
      </EditDetails>
      )} 
    </SearchedOrders>
  )
}

const SearchedOrders = styled.div`
  width: 100%;
  .not-found{
      color:#b91111c4;
      width: 50%;
      margin: auto auto;
      margin-top: 15px;
      margin-bottom: 15px;
  }
  .generate-invoice{
      display: flex;
      justify-content: flex-end;
      margin-top:10px;
    }
    .generate-invoice button{
      background-color: blue;
      padding: 8px 10px;
      border: none;
      border-radius: 3px;
      color: white;
      cursor: pointer;
      width: 20%;
      font-size: 1rem;
      @media (max-width:650px){
        width:50%;
      }
    }
`;

const FormStyle = styled.form`
    width: 50%;
    margin: 0 auto;
    margin-bottom: 10px;
    display:flex;
    .close-icon{
      position: relative;
      margin-left: -22px;
      margin-top: 10px;
      cursor: pointer;
      color:grey;
      @media (max-width:650px){
        margin-top: 7px;
      }
    } 
    .close-icon svg:hover{
      color:black !important;
    } 
    
    .error-msg{
      color:#b91111c4;
      margin-top:5px;
      font-size: 15px;
      padding: 5px 10px;
      border: 1px solid #b91111c4;
      border-radius: 3px;
      position: absolute;
      top: 65px;
      width: auto;
    }

    .form-div{
        width: 70%;
        display:inline-flex; 
        margin:0 auto;
        @media (max-width: 1000px){
            text-align:center;
        }
        @media (max-width: 850px){
            width:70%; 
        }
        @media (max-width: 650px){
            width:100%; 
            margin:0 auto;
        }
    }
    .form-div>svg{
        position:absolute;
        color:grey;
        margin-top: 10px;
        margin-left: 10px;
        @media (max-width:650px){
          margin-top:8px;
        }        
    }

    input{
        font-size:1.2rem;
        background:white;
        color:grey;
        padding:0.5rem 2rem;
        border:1px solid grey;
        outline:none;
        width:100%;
        border-radius: 3px;
        box-shadow: 2px 2px 2px grey;;
        @media (max-width: 850px){
            font-size:1rem;
            width:80%;
        }
        @media (max-width: 650px){
            font-size:0.9rem;
            padding: 0.3rem 2rem;
            width: 85%;
            /* margin:0 auto; */
        }   
    }
    button{   //search button
      padding: 5px;
      color: white;
      background-color: blue;
      width: 50px;
      border-radius: 3px;
      border: none;
      cursor: pointer;
      margin-left: 10px;
      box-shadow: 2px 2px 2px grey;
      @media (max-width:650px){
        margin-left: 15px;
        width:40px;
      }
    }
    button>svg{
      transform: scale(1.3);
    }
    button:hover {
      background-color: #0404e5db;
    }
    
    @media (max-width: 1000px){
        width:inherit;
    }
    @media (max-width: 650px){
        font-size:smaller;
        width:90%;
    }
`;

const OrderedItem = styled.div`
      box-shadow: 2px 2px 2px grey;
      cursor: pointer;
      &:hover{
        box-shadow: 3px 3px 3px grey;
      }
    .orders{
      width:100%;
      padding:5px;
      display:flex;
      flex-wrap: wrap;
      margin-top: 10px;
      min-width:20vw;
    }
    .order-heading{
      text-align: center;
      color: white;
      background: grey;
      padding: 7px;
    }
    .total-amt{
        font-weight: 500;
    }
    .individual-book{
      display: flex;
      margin-top:5px;
      border:1px solid grey;
      border-radius: 2px;
      padding:5px;
    }
    .individual-book span{
      font-weight: 500;
    }
    .book-details{
      width:75%;
    }
    .book-image{
      width: 25%;
      height: 130px;
      padding: 5px;
    }
    .book-image img {
      height: 100%;
      width: 95%;
    }
    
    .orders-heading{
      width:100%;
      padding:10px;
      display:flex;
      flex-wrap:wrap;
    }
    .dateOrderPlacedAt{
      width:12%;
      margin-right:2px;
      flex-wrap:wrap;
    }
    .orderID{
      width:25%;
      margin-right:2px;
      flex-wrap: wrap;
    }
    .orderItems{
      text-align: left;
      width:62%;
    }

    
    @media (max-width:850px){
      .orderID{
        width:40%;
        margin-right:1rem;
        flex-wrap: wrap;
      }
      .orderItems{
        text-align: left;
        width:98%;
      }
    }
    @media (max-width:650px){
      flex-direction: row;
      width:100%;
      .orderItems{
        width:100%;
      }
      .dateOrderPlacedAt{
        width:34%;
        margin-right:2px;
        flex-wrap: wrap;
      }
      .orderID{
        width:65%;
        flex-wrap: wrap;
        font-size: 0.9rem;
        margin-right: 0px !important;
      }
      .order-heading{  
        padding: 3px;
      }
    }
`;

const EditDetails = styled.div`
    width: 50%;
    margin: 0 auto;
    border-left: 1px solid grey;
    margin-top: 1rem;
    box-shadow: 2px 2px 2px grey;
    @media (max-width:650px){
      width: 100%;
      font-size: 0.9rem;
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
    }
    .update-details-div{
      text-align: center;
    }
    .update-details-btn{
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
`;
export default SearchOrder
