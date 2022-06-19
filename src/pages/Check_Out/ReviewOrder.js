import React, {useState, useEffect} from 'react';
import {Cart_Service} from "../../services/Service";
import {useNavigate} from 'react-router-dom';
import styled from "styled-components";


function ReviewOrder() {
    let deliveryCharges = 50;
    // let params = useParams();
    let navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [cusInfo, setCusInfo] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    const [bookDummyImage, setBookDummyImage]= useState([]);
    // const [bookImage, setBookImage] = useState([]);
    useEffect(() => {
        window.scrollTo(0,0);
        setBookDummyImage(['dummy_book_img.png']);
        getCartItems();
        let customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
        if (customerInfo)
            setCusInfo(customerInfo);
        // console.log(customerInfo);
    }, []);

    const getCartItems = async()=>{
        let user = JSON.parse(localStorage.getItem('user'));
        const response = await Cart_Service.getCartItems(user._id, user.token);
        if(response.status === 200){
            const cartResponse = await response.json();
            // console.log(cartResponse);
            setCartItems(cartResponse);
            let tAmount=0;
            cartResponse.forEach((item)=>{
                tAmount +=item.quantity*(item.price-(item.book.discount*item.price));
            })
            setTotalAmount(tAmount);
        }else if(response.status === 204){
            console.log(response.statusText)
        }else if(response.status === 404 ){
            console.log("Bad Request");
        }
        
    }   
    const handleNext = () => {
        navigate("/checkout/payment");
    }

    const handlePrev = () => {
       navigate(-1);
    }
    return (
        <ReviewOrderOuter >
            <h3 className="review-order-heading" >Review Order</h3>
            <ReviewOrderInner>
                <h3 style={{ marginBottom: '5px' }}>Order Information</h3>
                <div className='order-info'>
                    <div className='cart-items-heading'>
                        <div className='width-25 image-heading'>
                            Book
                        </div>
                        <div className='width-30 name-heading'>
                            Name
                        </div>
                        <div className='width-25 qty-heading'>
                            Qty
                        </div>
                        <div className='width-25 price-heading'>
                            Price
                        </div> 
                        <div className='width-25 amount-heading'>
                            Amount
                        </div>
                    </div>  
                    <div className='cart-items'>
                        { cartItems.map((item,index) => {     
                        return (
                            <div className='cart-item' key={item._id}>
                                <div className='image-mobile'>
                                <div className='width-15 book_image'>
                                    {(item.book.discount>0) && (
                                        <span className='discount-badge' >{Math.floor(item.book.discount*100)}%</span>
                                    )}
                                   {item.book.book_image && <img src={require(`../../../public/assets/images/${item.book.book_image}`)} alt={item.book.book_name} />}
                                   {!item.book.book_image && <img src={require(`../../../public/assets/images/${bookDummyImage}`)} alt={item.book.book_name} />}

                                </div>
                                </div>
                                <div className='details-mobile'>
                                    <div className='width-30  book_name'>
                                        {item.book.book_name}
                                    </div>
                                    <div className='width-25 book_qty'>
                                        <span className='price-sub'>Quantity:</span> {item.quantity}
                                    </div>
                                    <div className='width-25 book_price'>
                                      <span className='price-sub'>Price:</span> &#8377;{Math.floor(item.price-item.price*item.book.discount)}
                                    </div>
                                    <div className='width-25 book_amount'>
                                     <span className='price-sub'>Subtotal:</span> &#8377;{Math.floor(item.quantity*(item.price-item.price*item.book.discount))}
                                    </div>
                                </div>        
                            </div>
                        )})
                        }
                        <div className='final-total'>
                            <div className='amt-charges'>
                                Delivery Charges: &#8377;{deliveryCharges}
                            </div>
                            <div className='amt-total'>
                                <strong>Total Amount: </strong><b>&#8377;{totalAmount+deliveryCharges}</b>
                            </div>
                        </div>
                    </div>
                </div>

                <AddressInfo >
                    <h3>Customer Information</h3>
                    <p><strong>Name: </strong>{cusInfo.fullName}</p>
                    <p><strong>Email: </strong>{cusInfo.email}</p>
                    <p><strong>Contact: </strong>{cusInfo.contact}</p>

                    <h4 style={{ marginTop: '5px' }}>Billing Adrress</h4>
                    <address>
                        {cusInfo.address}, &nbsp;
                        {cusInfo.city} &nbsp;
                        {cusInfo.postalCode},&nbsp;
                        {cusInfo.state},&nbsp;
                        {cusInfo.country}
                    </address>
                </AddressInfo>

                <div className="btns-div" style={{ marginTop: '1.5rem' }}>
                    <button type="button" name="pre" className="review-btns btn-prev " onClick={handlePrev} >Previous</button>
                    <button type="button" name="next" className="review-btns btn-next" onClick={handleNext} >Next</button>
                </div>
            </ReviewOrderInner>
        </ReviewOrderOuter>
    )
}


const ReviewOrderOuter = styled.div`
    border:1px solid #808080b5;
    border-radius: 5px;;
    width: 60%;
    margin: 0 auto;
    box-shadow: 3px 4px 5px grey;
    margin-bottom:1rem;

    @media (max-width:1100px) {
            width: 90%;
    }
    @media (max-width:850px) {
            width: 95%;
    }
    @media (max-width:650px){
        margin-top:-15px;
    }
    .review-order-heading{
        text-align: center;
        background: grey;
        padding: 10px;
        color: white;
        @media (max-width:650px){
            padding:5px;
        }
    }

`;

const ReviewOrderInner = styled.div`
    padding:20px;
    @media (max-width:650px){
        padding:5px;
    }
    .order-info{
       
    }
    h3{
        font-size: 1.1rem;
    }
    .order-info img{
        height:150px;
        width:100px;
        @media(max-width:650px){
            height:140px;
            width:100px;
        }
    }
    .cart-items-heading{
        display: flex;
        width: 100%;
        padding: 10px;
        border-bottom: 2px solid grey;
        justify-content: space-between;
        font-size: 1rem;
        font-weight: 700;
        @media (max-width:650px){
            display: none;
        }
    }
    .cart-items{
        display: flex;
        width: 100%;
        flex-direction: column;
    }
    .cart-item{
        display: flex;
        justify-content: space-between;
        width: 100%;
        border-bottom: 1px solid grey;
        padding: 5px;
    }
    .width-30{
        width:30%;
    }
    .width-25{
        width:25%;
    }
    .amt-total{
        font-size: 1.1rem;
        margin-top: 5px;
        @media (max-width:650px){
            font-size: 1rem;
        }
    }
    .amt-charges{
        font-weight: 500;
        @media (max-width:650px){
            margin-top: 5px;
        }
    }
    .image-mobile{
        display: flex;
        width: 15%;
        @media (max-width:650px){
            width:35%;
        }
    }
    .book_image{
        @media (max-width:650px){
            width:100%;
        }
    }
    .book_name{
        @media (max-width:650px){
            width: 100%;
            text-align: left;
            padding-left: 10px;
        }
    }
    .details-mobile{
        display: flex;
        align-items: center;
        width: 85%;
        font-weight: 500;
        @media (max-width:650px){
            width: 65%;
            flex-direction: row;
            flex-wrap: wrap;
            font-size: 0.9rem;
        }
    }

    .book_qty{
        text-align: -webkit-center;
        @media (max-width:650px){
            width: 100%;
            text-align: left;
            padding-left: 10px;
        }
    }
    .book_price{
        @media (max-width:650px){
            width: 100%;
            font-weight: 700;
            text-align: left;
            padding-left: 10px;
            font-size: 0.8rem;
        }
    }
    .book_amount{
        @media (max-width:650px){
            font-weight: 700;
            width: 100%;
            text-align: left;
            padding-left: 10px;
            font-size: 0.8rem;
        }
    }
    .cart-items-div img{
        height:150px;
        width:100px;
        @media(max-width:650px){
            height:140px;
            width:100px;
        }
    }
    .price-sub{
        @media (min-width:650px){
            display:none;
        }
    }
    .final-total{
        display: flex;
        margin: 0 auto;
        flex-direction: column;
        /* @media (max-width:650px){
            flex-direction: column;
            align-items: center;
        } */
    }
    .discount-badge{
        position: absolute;
        background: #e30606;
        padding: 5px 3px;
        border-radius: 50%;
        color: white;
        font-size: 0.7rem;
        font-weight: 500;
        @media (max-width:650px){
            font-size: 0.7rem;
        }
    }
    .btns-div{
        display:flex; 
        justify-content:space-between;
    }
    .review-btns{
        background-color: #e3e3e3;
        padding: 8px 12px;
        border-radius: 3px;
        width:20%;
        font-size: 1rem;
        border:none;
        @media (max-width:650px){
            width:35%;
        }
    }
    .btn-prev, .btn-next {
        font-size: 1rem;
        color: blue;
        border-radius: 3px;   
    }

    .btn-prev:hover, .btn-next:hover {
        cursor: pointer;
        background:rgba(0, 0, 255, 0.788);
        color:white;
    }
    
`;

const AddressInfo = styled.div`
    h3{
        margin-bottom: 5px;
        @media (max-width:650px){
            margin-top:10px;
        }
    }

`;
export default ReviewOrder
