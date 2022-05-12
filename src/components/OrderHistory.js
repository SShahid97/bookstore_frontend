import React from 'react';
import styled from "styled-components";


function OrderHistory({orderHistory}) {
  return (

    <Orders >
      <h3 className='order-main-heading'>Order History</h3>
    <OrdersInner>
    {orderHistory && (
       <>
        <div className='orders-heading' >
            <div className='SNO'>
                <h4 className='order-heading'>S.No.</h4>
            </div>
            <div className='dateOrderPlacedAt'>
              <h4 className='order-heading'>Date</h4>
            </div>
            <div className='orderID'>
              <h4 className='order-heading'>Order ID</h4>
            </div>
            <div className='orderItems'>
              <h4 className='order-heading'>Order Info</h4>
            </div>
        </div>
        {orderHistory.map((orderInfo,index)=>{
        return (
          <div className='orders' key={orderInfo._id} >
            <div className='SNO'>
                {++index}
            </div>
            <div className='dateOrderPlacedAt'>
              {orderInfo.date.split("T")[0]}
            </div>
            <div className='orderID'>
              {orderInfo._id}
            </div>
            <div className='orderItems'>
              {
                orderInfo.order.map((order)=>{
                  return (
                    <div key={order._id} className="individual-book">
                      <div className='book-details'>
                        <p><span>Book Name:</span>{order.book.book_name}</p>
                        <p><span>Book Author:</span>{order.book.book_author}</p>
                        <p><span>Quantity:</span> {order.quantity}</p>
                        <p><span>Price: </span>&#8377;{order.price}</p>
                        <p><span>Discount:</span>{order.discount*100}%</p>
                      </div>
                      <div className='book-image'>
                        <img src={require(`../../public/assets/images/${order.book.book_image}`)} alt={order.book.book_name} />
                      </div>
                    </div>
                  ) 
                })
              }
              <p className='total-amt'>Total Amount: &#8377;{orderInfo.total_amount}</p>
            </div>
        </div>
       )
      })}
      
      </>
      
    ) 
  }
  {!orderHistory && (
    <h3 style={{padding:'20px', fontWeight:'500', textAlign:'center' }}>User has no order history.</h3>
  )}
  </OrdersInner>
  
</Orders>
  )
}

const Orders = styled.div`
    height: 95%;
    color: black;
    background: white;
    width:90%;
    margin:0 auto;
    border-radius:3px;
    position:relative;
    min-width:20vw;
    box-shadow: 5px 4px 5px grey;
    border:1px solid grey;
    /* margin-top:10px; */
    .order-main-heading{
      text-align: center;
      color: white;
      background: grey;
      padding: 7px;
    }
    .order-heading{
      padding:3px;
      border-bottom: 2px solid grey;
    }

`;

const OrdersInner = styled.div`
  height: 90%;
  overflow-y: auto;
  
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
    .orders{
      width:100%;
      padding:8px;
      display:flex;
      flex-wrap: nowrap;
      border-bottom: 1px solid grey;
    }
    .orders-heading{
      width:100%;
      padding:8px;
      display:flex;
      flex-wrap:nowrap;
    }
    .SNO{
      width:5%;
      margin-right:0.3rem;
      flex-wrap: nowrap;
    }
    .dateOrderPlacedAt{
      width:10%;
      margin-right:1rem;
      flex-wrap:nowrap;
    }
    .orderID{
      width:25%;
      margin-right:1rem;
      flex-wrap: wrap;
    }
    .orderItems{
      text-align: left;
      width:55%;
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
        margin-right:1rem;
        flex-wrap: nowrap;
      }
      .orderID{
        width:55%;
        flex-wrap: wrap;
      }
    }
`;
export default OrderHistory
