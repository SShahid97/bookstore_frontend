import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
import { Order_Service } from '../../services/Service';
import Loader from "../../components/Loader";

// let Admin = {};
function SearchOrder() {
  const [orderId, setOrderId] = useState("");
  const [orderPlaced, setOrderPlaced] = useState({});
  const [notFoundMsg, setNotFoundMsg] = useState("");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [invalidInput, setInvalidInput] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  // useEffect(() => {

  // }, [])

  const submitHandler = async (e) => {
    e.preventDefault();
    setShowLoader(true);
    // console.log(orderId.length);
    let value = orderId;
    value = value.trim();
    if (value.includes(" ")) {
      console.log("space found");
      setInvalidInput(true);
      setNotFoundMsg(false);
      return;
    }
    
    // console.log(value);
    let curr_user = JSON.parse(localStorage.getItem('user'));
    if (curr_user && curr_user.role === "admin") {
      const response = await Order_Service.searchOrderById(curr_user.token, value);
      if (response.status === 204) {
        setShowLoader(false);
        setIsOrderPlaced(false);
        setNotFoundMsg("No order found with the given Order Id");
      } else if (response.status === 400) {
        setShowLoader(false);
        setIsOrderPlaced(false);
        setNotFoundMsg("Invalid Order ID!");
      }
      else if (response.status === 200) {
        const returnedOrder = await response.json();
        console.log(returnedOrder);
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
    }
  }
  const handleKeys = (e) => {
    if (e.which === 32) {
      console.log('Space Detected');
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
    setShowClose(false);
    setInvalidInput(false);
  }
  return (
    <SearchedOrders>
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
      {showLoader && (< Loader/>)}
      {isOrderPlaced && (
        <OrderedItem>
          {!showLoader && (      
          <div className='orders' key={orderPlaced._id} >
            <div className='dateOrderPlacedAt'>
              <h4 className='order-heading'>Date</h4>
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
                        <p><span>Price: </span>&#8377;{item.price} 
                        {item.discount>0 && (<span> (with discount)</span>)}  </p>
                        <p><span>Discount:</span>{item.discount * 100}%</p>
                        
                      </div>
                      
                      <div className='book-image'>
                        <img src={require(`../../../public/assets/images/${item.book.book_image}`)} alt={item.book.book_name} />
                      </div>
                    </div>
                  )
                })
              }
              <p className='total-amt'>Total Amount: &#8377;{orderPlaced.total_amount}</p>
              <p className='total-amt'><span>Payment Status: </span>{orderPlaced.payment_status}</p>
            </div>
          </div>
          )}
        </OrderedItem>
      )}
      {notFoundMsg && (
        <h3 className='not-found'>{notFoundMsg}</h3>
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
`;

const FormStyle = styled.form`
    width: 50%;
    margin: 0 auto;
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
      width: 65%;
      margin-top:5px;
      font-size: 15px;
      padding: 5px 10px;
      border: 1px solid #b91111c4;
      border-radius: 3px;
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
            width:95%; 
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
        border:none;
        background: linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131);
        font-size:1.2rem;
        background:white;
        color:grey;
        padding:0.5rem 2rem;
        border:1px solid grey;
        outline:none;
        width:100%;
        border-radius: 3px;
        box-shadow: 3px 4px 3px grey;
        @media (max-width: 850px){
            font-size:1rem;
            width:80%;
        }
        @media (max-width: 650px){
            font-size:0.9rem;
            padding: 0.3rem 2rem;
            width: 70%;
            /* margin:0 auto; */
        }   
    }
    button{
      padding: 5px;
      color: white;
      background-color: blue;
      width: 50px;
      border-radius: 3px;
      border: none;
      cursor: pointer;
      margin-left: 10px;
      box-shadow: 3px 4px 3px grey;
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
    @media (max-width: 550px){
        font-size:smaller;
        width:inherit;
    }
`;

const OrderedItem = styled.div`
    .orders{
      width:100%;
      padding:5px;
      display:flex;
      flex-wrap: wrap;
      margin-top: 15px;
      height:70vh;
      overflow-y: auto;
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
      width:98%;
      .orderItems{
        width:98%;
      }
      .dateOrderPlacedAt{
        width:35%;
        margin-right:2px;
        flex-wrap: wrap;
      }
      .orderID{
        width:55%;
        flex-wrap: wrap;
      }
      .order-heading{  
        padding: 3px;
      }
    }
`;
export default SearchOrder
