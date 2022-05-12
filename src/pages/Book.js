import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useParams, useNavigate, Link} from 'react-router-dom';
import Latest from "../components/Latest";
import {User_Service, 
    Cart_Service, 
    Review_Service, 
    Pincode_Service,
    Stock_Service,
    Wishlist_Service} from '../services/Service';
import {cartService} from "../services/LocalService";
import ReviewAndRating from "../components/ReviewAndRating";
import Rating from "../components/Rating";
import "./styles.css";
import Loader from '../components/Loader';
import {FaCartArrowDown,FaArrowLeft,FaHeart,FaStar,FaRegStar } from "react-icons/fa";
// import {FaUserCircle, FaStar,FaStarHalfAlt,FaRegStar} from "react-icons/fa";


function Book() {
    const ratingArray = [{name:"0",value: 0},{name:"0.5",value: 0.5},
    {name:"1",value: 1}, {name:"1.5",value:1.5},{name:"2",value:2},{name:"2.5",value:2.5}, 
    {name:"3",value:3},{name:"3.5",value:3.5},{name:"4",value:4},{name:"4.5",value:4.5},
    {name:"5",value:5}];
  
    const [urating, setUrating] = useState(null);
    const [hover, setHover] = useState(null);
    const [ureview, setUreview]=useState("");
    const [uuser, setUser]= useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [totalRating, setTotalRating]= useState(0);
    const [pincode, setPincode]=useState(""); 
    const [deliveryAvailable,setDeliveryAvailable] = useState(false);
    const [deliveryNotAvailable,setDeliveryNotAvailable] = useState(false);
    const [invalidPincode, setInvalidPincode] = useState(false);
    const [shippingCharges, setShippingCharges] = useState(0);
    const [stockDetails, setStockDetails] = useState({});
    const [itemAddedToCartMsg, setItemAddedToCartMsg] = useState("");
    const [itemAddedToWishlistMsg, setItemAddedToWishlistMsg] = useState("");

    let params = useParams();
    let navigate = useNavigate();
    let cartArray = [];
    const [bookDetails, setDetails]=useState({});
    // const [imageName, setImageName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [bookImage, setBookImage] = useState([]);
    const [reviewAlreadySubmitted, setReviewAlreadySubmitted] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [notFound, setNotFound] = useState("");


    // const [showCart, setShowCart] = useState([]);
    useEffect(()=>{
        window.scrollTo(0, 0);
        let isMounted = true;
        if (isMounted){
            setShowLoader(true);
            let curr_user = JSON.parse(localStorage.getItem('user'));
            if(!curr_user){
                setLoggedIn(false);
            }else{
                setLoggedIn(true);
                setUser(curr_user);
                checkIfSubmitted(curr_user.token,curr_user._id, params.id);
            }
            getBookDetails(params.id);
            getReviews(params.id);
        } 
        return () => { isMounted = false };

    },[params.id]);
    
    const checkIfSubmitted = async(token, userId,bookId)=>{
        let Ids = {
            book_id: bookId,
            user_id: userId
        };
        // console.log(Ids);
        const response = await Review_Service.checkIfSubmitted(token,Ids);
        if(response.status === 200){
            const submittedReview = await response.json();
            console.log(submittedReview);
            setReviewAlreadySubmitted(true);
        }else if(response.status === 204){
            setReviewAlreadySubmitted(false);
        }
        // // console.log(reviewSubmitted);
        // if(reviewSubmitted.length>0){
        //     setReviewAlreadySubmitted(true);
        // }else{
        //     setReviewAlreadySubmitted(false);
        // } 
    }

    const getStockDetails = async(bookId)=>{
        const response = await Stock_Service.getStockDetails(bookId);
        if(response.status === 200){
            const stock = await response.json();
            if(stock.count_in_stock === 0){
                setQuantity(0);
            }
            setStockDetails(stock);
        }else if(response.status === 204){
            console.log("No stock details found");
        }else {
            console.log("There was some error");
        }
    }

    const getBookDetails = async (bookId)=>{
        const response = await User_Service.getBookDetails(bookId);
        if(response.status === 200){
            const bookDetails = await response.json();
            if(bookDetails.discount>0){
                bookDetails.discountPercent = bookDetails.discount*100 + "%";
                bookDetails.newPrice = bookDetails.price - (bookDetails.price* bookDetails.discount);
            }
            setDetails(bookDetails);
            let itmImageName = [{id:bookDetails._id ,image: bookDetails.book_image, name:bookDetails.book_name}];
            setBookImage(itmImageName);
            setNotFound("");
            getStockDetails(bookDetails._id);
            setShowLoader(false);
        }else if(response.status === 204){
            setShowLoader(false);
            setNotFound("No Content");
            // console.log(response);
            navigate("*");
        }else if(response.status === 400){
            setShowLoader(false);
            setNotFound("Invalid Book ID");
            // console.log("Bad Request");
            navigate("*");
        }
    }

    const getReviews = async(bookId)=>{
            const response = await Review_Service.getReviews(bookId);
            if(response.status === 200){
                let ratingSum=0;
                let ratingAvg=0;
                const reviewsReturned = await response.json();
                setReviews(reviewsReturned);
                reviewsReturned.forEach((item)=>{
                    ratingSum = ratingSum+item.rating;
                })
                ratingAvg = ratingSum/reviewsReturned.length;
                let rounded = Math.round(ratingAvg);
                let fraction = (ratingAvg - Math.floor(ratingAvg)).toFixed(1);
                let finalRating;
                if(fraction > 0.1 && fraction < 0.3 ){
                    finalRating = rounded;
                }else if(fraction >= 0.3 && fraction < 0.5 ){
                    finalRating = rounded+0.5;
                }else if(fraction >= 0.5 && fraction < 0.8){
                    finalRating = rounded-0.5;
                }else if(fraction >= 0.8){
                    finalRating = rounded;
                }else{
                    finalRating = ratingAvg;
                }
                setTotalRating( finalRating);
            }else if(response.status === 204){
                setReviews(null);
                console.log("No Reviews");
            }else if(response.status === 400){
                console.log("Bad Request");
            }
    }

    const handleQuantity = (e)=>{
        e.preventDefault();
        setQuantity(e.target.value);
    }
    const handleAddToWishlist = async(bookId)=>{
        let user = JSON.parse(localStorage.getItem('user'));
        if(!user){
            navigate("/login");
            return;
        }else{
            let wishlistItemObj = {
                user_id:user._id,
                book_id:bookId
            }
            const response = await Wishlist_Service.addWishlistItem(user.token,wishlistItemObj);
            if(response.status === 201){
                const addedItem = await response.json();
                console.log(addedItem);
                setItemAddedToWishlistMsg("Item Added to Wishlist!");
                setTimeout(()=>{
                    setItemAddedToWishlistMsg("");
                },6000);
            }else{
                alert("There was some error!");
            }
        }
    }
    const handleAddToCart = async(id, price)=>{
        if(quantity===0){
            alert("Item currently out of Stock");
            return;
        }
        let cart;
        let user = JSON.parse(localStorage.getItem('user'));
        if(!user){
           navigate("/login");
           return;
        }
        cart = JSON.parse(localStorage.getItem('cart'));
        let cartItemObj =  {
            user_id:user._id,
            book_id:id,
            price:price,
            quantity:quantity
        }
        // when cart is empty
        if(!cart){
            cartArray.push(cartItemObj);
            localStorage.setItem("cart",JSON.stringify(cartArray));
            updateCartItems(cartArray.length);
            addItemToCart(user.token,cartItemObj);
        }else{  // when cart is not empty
            let flag = false;
            cartArray = cart;
            cartArray.forEach(element => {
                // console.log("Book Id:", element.book_id);
                if( element.book_id === id){
                    flag=true;
                    alert("This Item is already added to cart");
                    // navigate("/cart/"+user._id);
                }
            });
            // when item is not already added
            if(flag === false){
                cartArray.push(cartItemObj);
                localStorage.setItem("cart",JSON.stringify(cartArray));
                updateCartItems(cartArray.length);
                addItemToCart(user.token,cartItemObj);
            }
        }
        
    }
    const addItemToCart = async(token,cartObj)=>{
            const response = await Cart_Service.addToCart(token,cartObj);
            if(response.status === 201){
                const data = await response.json();
                // alert("Item Added to Cart Successfully");
                setItemAddedToCartMsg("Item Added to cart!");
                setTimeout(()=>{
                    setItemAddedToCartMsg("");
                },6000)
                let cart = JSON.parse(localStorage.getItem("cart"));
                updateCartItems(cart.length)
                setQuantity(1);
                console.log(data);
            }else if (response.status === 400 ){
                alert("There was some error");
                console.log("There was some error", response);
            }  
    }

    const updateCartItems = (cartDataLength)=>{
        cartService.updateCartItems(cartDataLength);
    }

    // const handleBuyNow=(item)=>{
    //     item.qty = Number(quantity); //adding qty to item object
    //     // console.log(item);
    //     localStorage.setItem("itemToBuy",JSON.stringify(item))
    //     navigate("/checkout");
    // }
    // const handleURating = (e)=>{
    //     let value=e.target.value;
    //     setUrating(Number(value));
    // }
    // const handleUReview = (e)=>{
    //     let value=e.target.value;
    //     setUreview(value);
    // }

    const handleUReview = (e)=>{
        let value=e.target.value;
        setUreview(value);
    }
    
    // const handleAddReview = (e)=>{
    //     e.preventDefault();
    //     let reviewObj = {
    //         urating : urating,
    //         ureview : ureview
    //     }
    //     console.log(reviewObj);
    //     setUreview("");
    // }

    const handleAddReview = async (e)=>{
        e.preventDefault();
        // only logged in users can give review
        if(uuser){
            let reviewObj =  {
                user_id:uuser._id,
                book_id:bookDetails._id,
                rating:urating,
                review:ureview
            }
            console.log(reviewObj);
            const response = await Review_Service.addReview(uuser.token, reviewObj);
            if(response.status === 201){
                const reviewAddResponse = await response.json();
                console.log(reviewAddResponse);
                // setReviewAlreadySubmitted(true);
                setReviewSubmitted(true);
                setReviewAlreadySubmitted(true);
                // resetting input fields
                setUrating("");
                setUreview("");
                setTimeout(()=>{
                    setReviewSubmitted(false);
                },3000);
                getReviews(params.id);
            }else{
                alert("There was some error in submitting the review");
                setReviewSubmitted(false);
                setReviewAlreadySubmitted(false);
            }
        }
        
    }
    const handleCheckPincode = (e)=>{
        const val = e.target.value;
        if (e.target.validity.valid) 
            setPincode(e.target.value);
        else if (val === '') 
            setPincode(val);
    }
    const handleDelivery = async ()=>{
        const pin = pincode;
        if(pin.length === 0){
            alert("Please Enter Pincode");
            return;
        }
        if (pin.length !== 6 ){
            // console.log("yep",pin.length)
            setInvalidPincode(true);
            setDeliveryAvailable(false);
            setDeliveryNotAvailable(false);
            return;
        }else{
            setInvalidPincode(false);
        }
        // checks availability
       try{
            const pincodeReturned = await Pincode_Service.getPincodes(Number(pin));
            // saving returned area code details in localstorage
            localStorage.setItem("area_code_details",JSON.stringify(pincodeReturned));
            if(pincodeReturned.length>0){
                // console.log(pincodeReturned);
                setShippingCharges(pincodeReturned[0].shipping_charges);
                setDeliveryAvailable(true);
                setDeliveryNotAvailable(false);
            }else{
                // console.log(pincodeReturned);
                setDeliveryAvailable(false);
                setDeliveryNotAvailable(true);  
            }
       }catch(err){
           console.log("There was some errror: ",err)
       }
    }
    const handleBack = ()=>{
        navigate(-1);
    }
    return (
        <> 
        {showLoader && (<Loader/>)} 
        {!showLoader && (  
            <>
           <Wrapper>
            {/* <span style={{marginLeft: '-40px'}} className='hide-back back-arrow-span' title="back" onClick={handleBack}>
                <FaArrowLeft className='back-arrow'/>
            </span> */}
               
            <DetailWrapper>
                <DetailWrapperInner>
                <BookImg>
                    {(bookDetails.discount>0) && (
                        <span className='discount-badge' >{bookDetails.discountPercent}</span>
                    )}

                    {bookImage.map((item)=>{   
                       return ( 
                        <img key={item.id} src={require(`../../public/assets/images/${item.image}`)} alt={item.name}/>
                       )
                    })} 
                    {/* <img src={require("./css_0004_img.jpg")} alt={bookDetails.book_name}/> */}
                    {/* {imageName} */}
                </BookImg>
                <Info>
                    <BookDetail>
                        <h3 style={{marginTop:'0px'}}>{bookDetails.book_name}</h3>
                        <h5 style={{color:'#cb4e05'}}>by {bookDetails.book_author}</h5>
                        <div style={{marginTop:'5px'}}>
                        {reviews && (
                            <>
                             <Rating rating={totalRating}/> <span className='total-reviews'>({reviews.length} Reveiws)</span>
                            </>
                        )}
                        </div>
                        {/* <h3 className='heading-3'> <span>Rs. </span>{bookDetails.price}</h3> */}
                        {(bookDetails.discount===0)  && (
                            <>
                            <span className='price'>&#8377;{bookDetails.price}</span>
                            </>
                        )}
                        {(bookDetails.discount>0) && (
                            <div className='discounted-prices'>
                                <span className='new-price' >&#8377; {bookDetails.newPrice}</span>
                                <span className='old-price'>&#8377;{bookDetails.price}</span>
                                <span className='percent-off'>({bookDetails.discount*100}% off)</span>
                            </div>
                        )}
                        <div className='availability'>
                            <span> <strong>Availability:</strong> </span>
                            <span className='stock-count'>{
                               stockDetails.count_in_stock===0?<span style={{color:'#b10505'}}>Currently Out of Stock</span>:(
                                stockDetails.count_in_stock<5?<span style={{color:'#c98e0',fontSize: '15px'}}>In Stock (only {stockDetails.count_in_stock} left, hurry up! )</span>:(
                                        <span style={{color:'green', fontSize: '15px'}}>In Stock </span>
                                    ) 
                                )
                            }</span>
                        </div>
                        <div className='delivery-pincode'>
                            <span><strong>Delivery:</strong></span>
                            <div className='check-status'>
                                <input type="tel"  
                                placeholder="Enter Pincode" 
                                value={pincode}
                                pattern="^-?[0-9]\d*\.?\d*$"
                                onChange={handleCheckPincode}/>
                                <button type="button" onClick={handleDelivery}>Check</button>

                                {deliveryAvailable && (
                                    <div className='delivery-status'>
                                        <p>Delivery Available to pincode <strong>{pincode}</strong></p>
                                        <p>Delivery Charges: <strong>&#8377;{shippingCharges}</strong> </p>
                                    </div>
                                )}
                                {deliveryNotAvailable && (
                                    <div className='not-delivery-status'>
                                        <p>Delivery Not Available</p>
                                    </div>
                                )}
                                {invalidPincode && (
                                    <div className='not-delivery-status'>
                                        <p>Invalid Pincode</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </BookDetail>
                   <></>
                        {itemAddedToCartMsg !== "" && (
                            <div className='item-added'>
                                <p>{itemAddedToCartMsg}  &nbsp;&nbsp;<Link to={"/cart/"+uuser._id}>View Cart</Link> </p>
                            </div>
                        )}
                        {itemAddedToWishlistMsg !== "" && (
                            <div className='item-added'>
                                <p>{itemAddedToWishlistMsg}  &nbsp;&nbsp;<Link to={"/user/wishlist"}>View Wishlist</Link> </p>
                            </div>
                        )}
                    <BuyCartBtns > 
                        <Quantity >
                                {/* <span> */}
                                <strong><p style={{fontSize: '0.9rem'}}>Qty:</p></strong>
                                {/* </span> */}
                                <input type="number" disabled={stockDetails.count_in_stock === 0} min={1} step={1}  max={stockDetails.count_in_stock} value={quantity} name="quantity" onChange={handleQuantity}/>
                        </Quantity> 
    
                        <div className='cart-btns'>
                            {/* disabled={!deliveryAvailable} className={!deliveryAvailable?"disableCartbtn":""} */}
                           
                            <Button  onClick={() => handleAddToCart(bookDetails._id,bookDetails.price)}>
                                <FaCartArrowDown className='wish-cart-btn'/> Add to Cart
                            </Button>
                            <Button style={{background:'rgb(247 57 163)'}} onClick={() => handleAddToWishlist(bookDetails._id)}>
                                <FaHeart className='wish-cart-btn' /> Add to Wishlist
                            </Button>
                        </div>
                    </BuyCartBtns>  
                    
                </Info>  
                </DetailWrapperInner>
            </DetailWrapper>
            
                {/* Book Details */}
                <BookAuthorDetails>
                    <div  className='author-lang-div'>
                        <div className='author' >
                            <h4 >Author</h4>
                            <p>{bookDetails.book_author}</p>
                        </div>
                        <div className='lang'>
                            <h4 >Language</h4>
                            <p>English</p>
                        </div>
                        <div className='desc'>
                            <h4>Description</h4>
                            <p>{bookDetails.book_description}</p>
                        </div>
                    </div>
                </BookAuthorDetails>

                {/*Display reviews and ratings*/}
                {reviews && (
                    <>
                        <h3 className='reviews-heading'>Reviews and Ratings</h3>
                        <ReviewAndRating  reviews={reviews}/>
                    </>
                )}  

                {/* Review Component */}
                {(loggedIn && !reviewAlreadySubmitted) && (
                    <ReviewRating>
                    <div className='review-component'>
                        <h4>Review & Rate the Book</h4>
                        <hr/>
                        <form className="review-form" onSubmit={handleAddReview}>
                            <div>
                                <label ><strong>Rating:</strong></label><br/>
                                <div className='rating-inner'>
                                <span>
                                {[...Array(5)].map((star, i) =>{

                                    const ratingValue = i + 1;
                                    return <label key={i}>
                                        <input type="radio" 
                                        name = "rating" 
                                        value={ratingValue} 
                                        onClick={()=> setUrating(ratingValue)}>

                                        </input>
                                        <FaStar 
                                            className='star'
                                            size={16}
                                            color={ratingValue <= (hover || urating) ? "#ffc107" : "#e4e5e9"}
                                            onMouseEnter={()=>setHover(ratingValue)}
                                            onMouseLeave={()=>setHover(null)}
                                        />
                                        </label>
                                })}
                                {urating && <span>({urating}/5)</span>}
                                    </span>
                                </div>
                            </div>
                            <div style={{marginTop:'10px'}}>
                                <label ><strong>Review:</strong></label><br/>
                                <textarea
                                    name="review"
                                    placeholder='Your Review...'
                                    value={ureview}
                                    required
                                    onChange={handleUReview}
                                    rows={5}
                                />
                            </div>
                            <button className="review-submit-btn" type="submit">Submit Review </button>
                            </form>
                            {/* {reviewSubmitted && (
                                <div style={{color:'green', fontWeight:'600'}}>
                                    Thank you for rating our product.
                                </div>
                            )} */}
                        </div>
                    </ReviewRating>
                )}

                <div  style={{marginTop:'2rem'}}>
                    <h3>Recommended Books</h3>
                    <Latest category={bookDetails.category}/>
                </div>
            </Wrapper>
            </>
            )}
            </>
          )
    // }
    
}

const Wrapper = styled.div`
    width:80%;
    margin:0 auto;
    @media (max-width:650px){
        width:95%;
        margin:0 auto;
    }
    .hide-back{
        @media (min-width:650px){
            display:none;
        }
    }

    .review-submit-btn{
        padding: 8px 12px;
        border: none;
        color: blue;
        cursor: pointer;
        border-radius:3px;
        background: #e3e2e2fa;
    }
    .review-submit-btn:hover{
        background-color: blue;
        color:white;
    }
    .review-component{
        margin-top: 1rem;
        width:40%;
        @media (max-width:650px){
            width:98%;
        }
    }
    .review-form{
        /* padding:20px; */
        padding-left:0px;
        padding-top:10px;
        width:100%;
    }
    .review-form select{
        padding:5px;
        font-size:15px;
        outline: none;
    }
    .review-form textarea{
        width: 95%;
        margin-bottom: 8px;
        font-size: 15px;
        padding: 8px 5px;
        border: 1px solid #9e9e9e73;
        border-radius: 3px;
        outline: none;
    }
    .display-reviews-outer{
        margin-top:1rem;
        width:50%;
        border-radius:5px;
    }
    .book-reviews{
        margin-bottom: 10px;
        padding: 10px 0px;
        border-bottom: 1px solid black;
    }
    .reviews-heading{
        color: #0404cf;
        padding: 5px 0px;
        border-bottom: 2px solid #0404cf;
        margin-bottom: 5px;
        width: 36%;
    }
    .review-user{
        display: flex;
        padding: 5px;
        width: 40%;
        border-bottom: 1px solid grey;
    }
    .review-user-icon{
        padding: 1px;
        transform: scale(1.5);
        background: darkgrey;
        color: white;
        border-radius: 2px;
        margin-right: 12px;
    }
    .review-username{
        color:grey;
    }
    .review-date{
        color:#0404cf;
        font-size:13px;
    }
    .rating-div span{
        color:#ffcb0e;
    }
    .rating-div .rating{
        padding-left:3px;
        color:black;
        font-size:14px;
    }
    .review-text{
        font-size: 14px;
        text-align: justify;
    }
    @media (max-width:850px){
        .display-reviews-outer{
            width:100%;
            font-size: 0.8rem;
            h4{
                font-size: 0.8rem;
            }
        }
        .review-user{
            width:50%;
        }
        .reviews-heading{
            width:50%;
        }
    }
    @media (max-width:650px){
        margin-top:-16px ;
    }
    @media (max-width:500px){
        .review-user{
            width:60%;
        }
        .reviews-heading{
            width:60%;
        }
    }

`;
const DetailWrapper = styled.div`
    margin-top:3rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction:row;
    @media (max-width:850px) {
        flex-direction:column;
        margin-top:1rem;
    }
`;
const DetailWrapperInner = styled.div`
    /* margin:0 auto; */
    width:60%;
    display: flex;
    @media (max-width:850px){
        width:95%;
    }    
    @media (max-width:650px) {
        flex-direction:column;
        width: 100%;
    }
`;

const BookImg = styled.div`
    box-shadow: 3px 6px 4px 2px #00000050;
    border-radius: 5px;
    height: 22rem;
    margin-right: 2rem;
    width: 100%;
    display: flex;
    .discount-badge{
        position: absolute;
        background: #e30606;
        font-size: 1.1rem;
        padding: 10px 5px;
        border-radius: 50%;
        color: white;
        font-weight: 600;
        @media (max-width:650px){
            font-size: 1rem;
            padding: 6px 3px;
        }
    }
    @media (max-width:850px) {
        height:265px;
        width: 320px;
        margin-right:1rem;

    }
    @media (max-width:650px) {
        height:230px;
        width: 320px;
    }
    @media (max-width:360px) {
        height:250px;
        width: 100%;
    }
    img{
        height: 21rem;
        border-radius: 5px;
        width: 95%;
        margin: auto auto;
        @media (max-width:850px) {
            height:250px;
        }
        @media (max-width:650px) {
            height:225px;
            border-radius:3px;
            width: 70%;
        }
        @media (max-width:360px) {
            width: 60%;
            height:245px;
        }
    }
`;
const Info = styled.div`
    width:100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .item-added{
        margin:auto;
        color:rgb(8, 112, 8);
        width: 100%;
        margin-bottom: 8px;
        font-size: 17px;
        padding: 5px 2px;
        border: 1px solid green;
        border-radius: 3px;
        box-shadow: inset 0 0 20px rgba(4, 117, 4, 0.753);
    }
    .item-added p{
        padding: 2px 10px;
        font-size: 15px;
    }
    .item-added p a{
        text-decoration: underline;
        font-size: small;
        color: blue;
    }
    .item-added p a:active{
        color: red;
    }
    @media (max-width:650px) {
        width: 95%;
    }
    @media (max-width:360px) {
        width: 100%;
        margin-top:1rem;
    }
`;
const BookDetail = styled.div`
    h3{
        margin-top:2rem;
    }
    .availability{
        margin-top:5px;
    }
    .delivery-pincode{
        margin-top: 5px;
    }
    .delivery-status{
        color: rgb(8,112,8);
        margin-top: 5px;
        /* width: 79%; */
        /* text-align: center; */
        font-size: 16px;
        /* padding: 3px 2px; */
        /* border: 1px solid green; */
        /* border-radius: 3px; */
        /* box-shadow: inset 0 0 11px rgb(4 117 4 / 75%); */
    }
    .not-delivery-status{
        color:#b91111c4;
        width: 79%;
        margin-top:5px;
        text-align: center;
        font-size: 16px;
        padding: 5px 2px;
        border: 1px solid #b91111c4;
        border-radius: 3px;
        box-shadow: inset 0 0 11px rgb(221 20 20 / 59%);
    }
    .check-status{
        margin-top: 3px;
    }
    .check-status input{
        padding:5px;
        outline: none;
        border:1px solid grey;
        border-radius: 3px;
        width: 80%;
    }
    .check-status input[type=number]::-webkit-inner-spin-button {
        opacity: 0;
    }
    .check-status button{
        margin-left: 5px;
        padding:5px 8px;
        border-radius: 3px;
        border:1px solid blue;
        outline:none;
        cursor: pointer;
        color:blue;
        background-color: white;
    }

    .check-status button:hover{
        background-color: blue;
        color:white;
    }
    .price{
        font-size: 1.3rem;
        margin-top:10px;
    }
    .discounted-prices{
        margin-top:1rem;
    }
    .old-price{
        text-decoration: line-through;
        opacity: 0.8;
        color: #b10505;
        font-size: 1.1rem;
        margin-left: 15px;
    }
    .new-price{
        font-size: 1.3rem;
    }
    .percent-off{
        color:green;
        font-size: 15px;
        padding-left:20px;
        font-weight: 500;
    }
    .total-reviews{
        font-size: 14px;
        color: #179917;
        font-weight: 500;
    }
    @media (max-width:850px) {

        .old-price{
            text-decoration: line-through;
            opacity: 0.8;
            color: #b10505;
            font-size: 1.2rem;
            margin-right: 15px;
        }
        .new-price{
            font-size: 1.4rem;
        }
        .percent-off{
            color:green;
            font-size: 15px;
            padding-left:20px;
            font-weight: 500;
        }
    }

    @media (max-width:650px) {
        .old-price{
            text-decoration: line-through;
            opacity: 0.8;
            color: #b10505;
            font-size: 1rem;
            margin-right: 15px;
        }
        .new-price{
            font-size: 1.1rem;
        }
        .percent-off{
            color:green;
            font-size: 13px;
            padding-left:20px;
            font-weight: 500;
        }
    }
`;

const Quantity = styled.div`
    input{
        width: 60px;
        padding: 2px;
        font-size: 1rem;
        outline:none;
        border:1px solid black;
        margin-bottom: 5px;
    }
`;
const BuyCartBtns = styled.div`
    display:flex;
    flex-wrap: wrap;
    .wish-cart-btn{
        transform: scale(1.5);
        margin-right: 5px;
    }
    .cart-btns{
        width:100%;
        display:flex;
        justify-content:space-between ;
    }
    @media (max-width:650px) {
        
    }
    .disableCartbtn{
        opacity: 0.6;
        cursor: auto;
    }
`;

const Button = styled.button`
    width: 48%;
    padding: 0.7rem 0.8rem;
    color: white;
    background: #0d43d9;
    font-weight: 600;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    opacity: 0.9;
    &:hover{
        opacity: 1;
    }
    @media (max-width:850px) {
        padding:0.7rem 1.3rem;
    }
    @media (max-width:650px) {
        padding:0.6rem 1rem;
        width:49%;
    }
`;
const BookAuthorDetails = styled.div`
    width:60%;
    display: flex;
    
    .author-lang-div{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: stretch;
        flex-grow:inherit ;
        margin-bottom:5px;
        margin-top:1rem;
    }
    .author{
        width:40%;
    }
    .lang{
        width:40%;
    }
    .desc{
        text-align: justify;
    }
    h4{
        width: fit-content;
        color: #5c5b5b;
        border-bottom: 1px solid gray;
        padding: 5px 0px;
    }
    @media (max-width:500px){
        width:95%;
        .author-lang-div{
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        h4{
            font-size:14px;
        }
        
    }
`;
const ReviewRating = styled.div`
    width: 100%;
    margin: 0 auto;
    input[type="radio"]{
        display:none;
    }
    .rating-inner{
        margin-top: 10px;
        @media (max-width:650px){
            margin-left:10px;
        }
    }
    .star{
        cursor: pointer;
        transition: color 200ms;
        transform: scale(1.5);
        margin-right: 15px;
        @media (max-width:650px){
            transform: scale(2);
            margin-right: 45px;
        }
        @media (max-width:360px){
            transform: scale(2);
            margin-right: 35px;
        }
    }
`;
export default Book
