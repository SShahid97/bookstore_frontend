import React, {useState, useEffect} from 'react';
import {Cart_Service} from "../../services/Service";
import {useNavigate} from 'react-router-dom';
import styled from "styled-components";


function ReviewOrder() {
    let i=1;
    // let params = useParams();
    let navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [cusInfo, setCusInfo] = useState({});
    const [totalAmount, setTotalAmount] = useState(0);
    // const [bookImage, setBookImage] = useState([]);
    useEffect(() => {
        getCartItems();
        let customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
        if (customerInfo)
            setCusInfo(customerInfo);
        console.log(customerInfo);
    }, []);

    const getCartItems = async()=>{
        let user = JSON.parse(localStorage.getItem('user'));
        const response = await Cart_Service.getCartItems(user._id, user.token);
        if(response.status === 200){
            const cartResponse = await response.json();
            console.log(cartResponse);
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
                    <table>
                        <thead>
                            <tr>
                                <th>S.No.</th>
                                <th>Book</th>
                                <th>Name</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        {
                            cartItems.map((item, index) => {
                                return (
                                    <tbody key={item._id}>
                                        <tr>
                                            <td>{i++}</td>
                                            <td>
                                            {(item.book.discount>0) && (
                                                <span className='discount-badge' >{item.book.discount*100}%</span>
                                            )}
                                                <img src={require(`../../../public/assets/images/${item.book.book_image}`)} alt={item.book.book_name} />
                                            </td>
                                            <td>{item.book.book_name}</td>
                                            <td>
                                                {item.quantity} 
                                            </td>
                                             <td>&#8377;{item.price-item.price*item.book.discount}</td>
                                            <td>&#8377;{item.quantity*(item.price-item.price*item.book.discount)}</td>
                                        </tr>
                                    </tbody>
                                )
                            })
                        }
                        <tbody>
                            <tr style={{ background: '#b3a9346b' }}>
                                <td></td>
                                <td></td>
                                {/* <td></td> */}
                                <td colSpan="3" style={{ textAlign: 'right' }}><b>Delivery Charges:</b></td>
                                <td>&#8377; {50}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='tAmount'>
                        <strong>Total Amount: </strong><b>&#8377;{totalAmount+50}</b>
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
    box-shadow: 3px 6px 7px 4px grey;
    margin-bottom:1rem;
    .review-order-heading{
        text-align: center;
        background: grey;
        padding: 10px;
        color: white;
    }

    @media (max-width:1100px) {
            width: 90%;
    }
    @media (max-width:850px) {
            width: 95%;
    }

`;

const ReviewOrderInner = styled.div`
    padding:20px;
    .order-info{
        @media (max-width:630px){
            overflow-x: scroll !important;
            border:1px solid grey;
            border-radius: 3px;
        } 
    }
    .order-info img{
        width:100px;
        height:150px;
        @media(max-width:650px){
            height:100px;
            width:90px;
        }
    }
    table {
        width: 100%;
        height: auto;
        border-collapse: collapse;
        font-weight: 700;
        @media (max-width:650px) {
            font-size: 0.8rem !important;
            width:500px;
            height:200px;
        }
    }
    table thead {
        border-bottom: 1px solid rgb(48, 48, 48);
        font-size: 1rem !important;
        @media (max-width:650px) {
            font-size: 0.9rem !important;
        }
    }
    thead tr th {
        @media (max-width:650px){
            padding: 10px;
        }
    }
    tr td{
        padding:3px;
        padding-left: 0px;
    }
    .tAmount{
        text-align: right;
        margin-right: 6%;
        font-size: 1.2rem;
        margin-top: 5px;
        margin-bottom: 5px;
        @media (max-width:650px){
            font-size: 1rem;

        }
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
