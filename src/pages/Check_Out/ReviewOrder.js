import React, {useState, useEffect} from 'react';
import {Cart_Service} from "../../services/Service";
import {useParams,useNavigate} from 'react-router-dom';


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
        try{
            const cartResponse = await Cart_Service.getCartItems(user._id, user.token);
            console.log(cartResponse);
            setCartItems(cartResponse);
            let tAmount=0;
            cartResponse.forEach((item)=>{
                tAmount +=item.quantity*(item.price-(item.book.discount*item.price));
            })
            setTotalAmount(tAmount);
            
        }catch(err){
            console.log("There was some error: ",err)
        } 
    }   
    const handleNext = () => {
        navigate("/checkout/payment");
    }

    const handlePrev = () => {
       navigate(-1);
    }
    return (
        <div className='review-order-outer'>
            <h3 className="review-order-heading" >Review Order</h3>
            <div className='review-order-inner'>
                <div className='order-info'>
                    <h3 style={{ marginBottom: '1rem' }}>Order Information</h3>
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
                                <td></td>
                                <td colSpan="2" style={{ textAlign: 'right' }}><b>Delivery Charges:</b></td>
                                <td>&#8377; 100</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className='tAmount'>
                        <strong>Total Amount: </strong><b>&#8377;{totalAmount+100}</b>
                    </div>

                </div>

                <div className='address-info'>
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
                </div>

                <div className="btns-div" style={{ marginTop: '1.5rem' }}>
                    <button type="button" name="pre" className="review-btns btn-prev " onClick={handlePrev} >Previous</button>
                    <button type="button" name="next" className="review-btns btn-next" onClick={handleNext} >Next</button>
                </div>
            </div>
        </div>
    )
}

export default ReviewOrder
