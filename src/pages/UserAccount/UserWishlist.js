import React, {useEffect, useState} from 'react'
import styled from "styled-components";
import {Wishlist_Service} from "../../services/Service";
import Loader from "../../components/Loader";
import { useNavigate, Link } from 'react-router-dom';
import {FaTrash} from "react-icons/fa";
import {mobileMenuService} from "../../services/LocalService";
import PopUp from "../../components/PopUp";

let curr_user = {};
function UserWishlist() {
  const [userWishlistItems, setUserWishlistItems ] = useState([]);
  const [bookDummyImage, setBookDummyImage]= useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [messageSuccess, setMessageSuccess] = useState("");
  let navigate = useNavigate();
  curr_user = JSON.parse(localStorage.getItem('user'));

  useEffect(()=>{
    setShowLoader(true);
    setBookDummyImage(['dummy_book_img.png']);
    mobileMenuService.setMobileMenuIndicies(null);
    if(curr_user){
      getUserWishlist(curr_user.token, curr_user._id);
    }else{
      navigate("/");
    }
  },[]);

  const getUserWishlist = async (token, userId)=>{
    const response = await Wishlist_Service.getUserWishlist(token,userId);
    if(response.status === 200){
      setShowLoader(false); 
      const returnedWishlist = await response.json();
      // console.log(returnedWishlist);
      // Date.parse("2019-01-01T12:30:00.000Z")
      returnedWishlist.forEach((item)=>{
        const dateFormat = new Date(item.date);
        const dateOnly = dateFormat.toDateString();  //e,g Wed May 11 2022
        const timeOnly = dateFormat.toLocaleTimeString();  // e,g 3:30:03 PM
        item.date = dateOnly;
        item.time = timeOnly;
      });
      setUserWishlistItems(returnedWishlist);
    }else if (response.status === 204){
      setShowLoader(false);
      setUserWishlistItems(null);
    }else if (response.status === 400){
      console.log("Bad Request");
    }
  }
  const handleDeleteItem = async(token, itemId) =>{
    const confirmation = window.confirm("Do you want to deleted this item?");
    if(confirmation){
      const response = await Wishlist_Service.deleteWishlistItem(token,itemId);
      if(response.status === 200){
        const deleteItem = await response.json();
        // console.log(deleteItem.message);
        setMessageSuccess(deleteItem.message);
        setTimeout(()=>{
            setMessageSuccess("");
        },5000);
        getUserWishlist(token, curr_user._id);
      }else{
        alert("Item not deleted there was some error!");
    }
    }else{
      console.log("Cancelled")
    }
    
  }
  return (
    <>
    {showLoader && (<Loader/>)}
    
    {!showLoader && (
      <WishlistOuter>
        {messageSuccess !== "" && (
                <PopUp messageSuccess={messageSuccess}/> 
            )}
        <h3 className='wishlist-main-heading'>Your Wishlist</h3>
        <WishlistInner>
        {userWishlistItems && userWishlistItems.map((item,index)=>{
        return (
          <div className='orders' key={item._id}  >
          <Link to={"/book/"+item.book._id} >
            <div className='orderItems'>
              <div className='orderPlacedAt'>
                <span>Date: </span> &nbsp;{item.date}
                &nbsp;&nbsp;<span style={{fontSize:'12px',color: 'darkblue'}}>{item.time}</span>
              </div>
              <div className="individual-book">
                  <div className='book-details'>
                    <div className='book-image'>
                    {item.book.book_image && <img src={require(`../../../public/assets/images/${item.book.book_image}`)} alt={item.book.book_name} />}
                    {!item.book.book_image && <img src={require(`../../../public/assets/images/${bookDummyImage}`)} alt={item.book.book_name} />}
                    </div>
                    <div className='book-description'>
                      <p><span>Book Name: </span>{item.book.book_name}</p>
                      <p><span>Book Author: </span>{item.book.book_author}</p>
                      <p><span>Price: </span>&#8377;{item.book.price}</p>
                      <p><span>Discount: </span>{item.book.discount*100}%</p>
                      {item.count_in_stock===0 && (
                         <p className="stock-msgs outofstock">Out of Stock</p>
                      )}
                      {item.count_in_stock>0 && (
                        <p className="stock-msgs instock">In Stock</p>
                      )}
                    </div> 
                  </div>
              </div>
            </div>
          </Link>
              <div className='deleteItem'>
                  <button className='deleteItem-btn' onClick={() => handleDeleteItem(curr_user.token,item._id) }>
                  <FaTrash />  Delete</button> 
              </div> 
          </div>
          )
        })}
        </WishlistInner>
          {!userWishlistItems && (
                <h4 className="no-wishlist-item" >Your Wishlist is empty.</h4>
            )}
      </WishlistOuter>
    )}
    </>
  )
}
 
const WishlistOuter = styled.div`
    color: black;
    background: white;
    width: 55%;
    margin:0 auto;
    border-radius:3px;
    position:relative;
    box-shadow: 5px 4px 5px grey;
    border:1px solid grey;
    margin-bottom: 1rem;
    @media (max-width:650px){
      width: 95%;
      margin-top: -20px;
      box-shadow:none;
      border:none;
    }
    @media (max-width:360px){
      width: 98%;
    }

    .no-wishlist-item{
      padding-bottom: 10px;
      font-weight: 500;
      text-align: center;
    }
    .wishlist-main-heading{
      text-align: center;
      color: white;
      background: grey;
      padding: 7px;
      font-weight: 500;
      @media (max-width:650px){
        padding: 2px;
        font-size: 1rem;
        width: 100%;
        margin: 0 auto;
        box-shadow: 5px 4px 5px grey;
      }
    }
`;

const WishlistInner = styled.div`
  max-height:90vh;
  overflow-y: auto;
  margin-bottom: 1rem;
  @media (max-width:650px){
    font-size: 0.9rem;
    max-height:100%;
    overflow-y:hidden;
  }
  @media (max-width:360px){
    font-size: 0.8rem;
  }

  .deleteItem-btn{
      border:1px solid red;
      color:red;
      padding: 8px 10px;
      border-radius: 3px;
      font-size: 1rem;
      width:100%;
      @media (max-width:650px){
        padding: 4px 6px;
        font-size:0.9rem;
      }
  }


  .deleteItem-btn:hover{
      background:red;
      color:white;
      cursor: pointer;
  }
  .deleteItem{
    width: 100%;
    margin: 0 auto;
    margin-top: 5px;
  }
  .orders{
      width:100%;
      padding:8px;
      display:flex;
      flex-direction: column;
      flex-wrap: wrap;
      @media (max-width:650px){
        padding: 0px;
        padding-top: 3px;
        margin-bottom: 1rem;
      }
  }
  .orderItems{
      width: 100%;
      margin: auto auto;
      border-radius: 3px;
      box-shadow: 2px 3px 5px grey;
      &:hover{
        box-shadow: 5px 4px 5px grey;
        outline: 1px solid grey;
      }
    }
    .stock-msgs {
      margin-top:5px; 
      font-size:14px; 
      font-weight:500;
      @media (max-width:650px){
        font-size: 12px;
      } 
    }
    .outofstock{
      color:#db0c0c; 
    }
    .instock{
      color:green;
    }
    .orderPlacedAt{
        background: lightgrey;
        padding: 5px;
        font-weight: 700;
        border-radius: 2px;
        padding-left: 20px;
    }
  .total-amt{
      padding: 5px;
      padding-left: 20px;
      font-weight: 500;
    }
    .individual-book{
      display: flex;
      margin-top: 5px;
      border-radius: 3px;

    }
    .book-description span{
      font-weight: 500;
    }
    .book-details{
      display: flex;
      width: 100%;
    }
    
    .book-image{
      width: 25%;
      padding: 5px;
      background: #f1f1f1;
      text-align: center;
      @media (max-width:360px){
        width: 30%;
        padding: 2px;
      }
    }
    .book-image img {
      width: 130px;
      height: 170px;
      @media (max-width:650px){
        width: 110px;
        height: 130px;
      }
      @media (max-width:360px){
        width: 90px;
        height: 100px;
        width: 100px;
        height: 100px;
        object-fit: contain;
      }
    }
    .book-description{
      width: 75%;
      padding: 5px;
      background: gainsboro;
      color:black;
      @media (max-width:360px){
        width: 70%;
        padding: 3px;
      }
    }
    
`;
export default UserWishlist
