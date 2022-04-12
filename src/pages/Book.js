import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useParams, useNavigate} from 'react-router-dom';
import Latest from "../components/Latest";
import {User_Service, Cart_Service} from '../services/Service';
import {cartService} from "../services/LocalService";
import "./styles.css";


function Book() {
    let params = useParams();
    const navigate = useNavigate();
    let cartArray = [];
    const [bookDetails, setDetails]=useState({});
    // const [imageName, setImageName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [bookImage, setBookImage] = useState([]);

    // const [showCart, setShowCart] = useState([]);
    useEffect(()=>{
        window.scrollTo(0, 0);
        let isMounted = true;   
        if (isMounted) getBookDetails(params.id);
        return () => { isMounted = false };
    },[params.id]);
    
    const getBookDetails = async (bookId)=>{
        const bookDetails = await User_Service.getBookDetails(bookId);
        
        if(bookDetails.discount>0){
            bookDetails.discountPercent = bookDetails.discount*100 + "%";
            bookDetails.newPrice = bookDetails.price - (bookDetails.price* bookDetails.discount);
        }
        setDetails(bookDetails);
        let itmImageName = [{id:bookDetails._id ,image: bookDetails.book_image, name:bookDetails.book_name}];
        console.log(itmImageName);
        setBookImage(itmImageName);
        // setImageName(bookDetails.book_image)
    }

    const handleQuantity = (e)=>{
        e.preventDefault();
        setQuantity(e.target.value);
    }

    const handleAddToCart = async(id, price)=>{

        let cart;
        let user = JSON.parse(localStorage.getItem('user'));
        if(!user){
            alert("Please login to add items to cart.");
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
        try{
            const data = await Cart_Service.addToCart(token,cartObj)  
            alert("Item Added to Cart Successfully");
            let cart = JSON.parse(localStorage.getItem("cart"));
            updateCartItems(cart.length)
            setQuantity(1);
            console.log(data);
        }catch(err){
            console.log("There was some error: ",err)
        }
    }
    const updateCartItems = (cartDataLength)=>{
        cartService.updateCartItems(cartDataLength);
    }

    const handleBuyNow=(item)=>{
        item.qty = Number(quantity); //adding qty to item object
        // console.log(item);
        localStorage.setItem("itemToBuy",JSON.stringify(item))
        navigate("/checkout");
    }
    return (
           <Wrapper>
            <DetailWrapper>
                <BookImg>
                    {(bookDetails.discount>0) && (
                        <span className='discount-badge' >{bookDetails.discountPercent}</span>
                    )}

                    {bookImage.map((item)=>{   
                       return ( 
                        <img key={item.id} src={require(`../../public/assets/images/${item.image}.jpg`)} alt={item.name}/>
                       )
                    })} 
                    {/* <img src={require("./css_0004_img.jpg")} alt={bookDetails.book_name}/> */}
                    {/* {imageName} */}
                </BookImg>
                <Info>
                    <BookDetail>
                        <h2 className='heading-2'>{bookDetails.book_name}</h2>
                        <h5 style={{color:'#cb4e05'}}>by {bookDetails.book_author}</h5>
                        {/* <h3 className='heading-3'> <span>Rs. </span>{bookDetails.price}</h3> */}
                        {(bookDetails.discount===0)  && (
                            <>
                            <h3 className='heading-3'>&#8377;{bookDetails.price}</h3>
                            </>
                        )}
                        {(bookDetails.discount>0) && (
                            <>
                                <h3 className='heading-3' style={{textDecoration: 'line-through', opacity:'0.8' }}>&#8377;{bookDetails.price}</h3>
                                <h3 className='heading-3' >&#8377; {bookDetails.newPrice}</h3>
                            </>
                        )}
                    </BookDetail>
                    <BuyCartBtns >
                        <div className='buy-btn'>
                            <Button onClick={() => handleBuyNow(bookDetails)}>Buy Now</Button>
                        </div>     
                        <div >
                            <Button onClick={() => handleAddToCart(bookDetails._id,bookDetails.price)}>Add to Cart</Button>
                        </div>
              
                        <div className='quantity'>
                            {/* <span> */}
                                <strong><p style={{fontSize: '0.9rem'}}>Quantity</p></strong>
                            {/* </span> */}
                            <input type="number" min={1} value={quantity} name="quantity" onChange={handleQuantity}/>
                        </div> 
                    </BuyCartBtns>  
                    
                </Info>  
            </DetailWrapper>
            
                {/* Book Details */}
                <div  style={{background:'red', marginBottom:'1.5rem',textAlign:'center'}}>
                   <div style={{float:'left',width:'50%'}}>
                       <h3 >Author</h3>
                       <hr/>
                       <p>{bookDetails.book_author}</p>
                   </div>
                   <div style={{float:'right',width:'50%'}}>
                       <h3 >Language</h3>
                       <hr/>
                       <p>English</p>
                   </div>
                </div>
                <div style={{marginTop:'7rem'}}>
                    <h3>Description</h3>
                    <hr/>
                       <p>{bookDetails.book_description}</p>
                </div>

                <div  style={{marginTop:'5rem'}}>
                    <h2>Recommended Books</h2>
                    <Latest category={bookDetails.category}/>
                </div>
            </Wrapper>
            
          )
    // }
    
}

const Wrapper = styled.div`
    width:80%;
    margin:0 auto;
`;
const DetailWrapper = styled.div`
    margin-top:3rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction:row;
    @media (max-width:850px) {
        flex-direction:column;
        margin-top:2rem;
    }

`;
const BuyCartBtns = styled.div`
    display:flex;
    flex-wrap: wrap;
    @media (max-width:650px) {
        .buy-btn{
            margin-bottom: 5px;
        }
    }
    input{
        width: 60px;
        padding: 2px;
        font-size: 1rem;
        outline:none;
        border:1px solid black;
    }
`;

const Button = styled.button`
    padding:0.8rem 1.8rem;
    color:#313131;
    background: white;
    border: 2px solid black;
    margin-right: 1.8rem;
    font-weight:600;
    &:hover{
        color:white;
        background: #313131;
        cursor: pointer;
    }
    @media (max-width:950px) {
        padding:0.6rem 1.6rem;
        border: 1px solid black;
        width: 8rem;
    }
    @media (max-width:650px) {
        width: 8rem;
        padding:0.4rem 1.2rem;
        border: 1px solid black;
    }
`;
const Info = styled.div`
    margin: 0 auto;
    @media (max-width:650px) {
        width: 48%;
    }
`;

const BookImg = styled.div`
    box-shadow: 3px 6px 4px 2px #00000050;
    margin: 0 auto;
    padding:10px;
    height: 22rem;
    border-radius: 5px;
    .discount-badge{
        position: absolute;
        background: #e30606;
        padding: 10px 5px;
        border-radius: 50%;
        color: white;
        font-size: 1.1rem;
        font-weight: 600;
    }
    @media (max-width:950px) {
        height:265px;
    }
    @media (max-width:650px) {
        height:215px;
    }
    img{
        height: 20rem;
        border-radius:5px;
        @media (max-width:950px) {
            height:250px;
        }
        @media (max-width:650px) {
            height:200px;
            border-radius:5px;
        }
    }

    
`;
const BookDetail = styled.div`
    margin-bottom: 4rem;
    h3{
        margin-top:2rem;
    }
    @media (max-width:950px) {
        margin-bottom: 2rem;
        .heading-2{
            font-size:1.1rem;
        }
        .heading-3{
            font-size:1rem;
        }
    }
    @media (max-width:650px) {
        .heading-2{
            font-size:1rem;
        }
    }
    
    /* background: yellow; */
`;
export default Book
