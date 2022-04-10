import React, { useEffect, useState } from 'react'


function ReviewOrder({setIsPayment, setIsReviewOrder, setIsBilling, itemToBuy}) {
    const [item, setItem] = useState({});
    const [cusInfo, setCusInfo] = useState({});
    const [bookImage, setBookImage] = useState([]);
    useEffect(() => {
        let itm = itemToBuy;
        setItem(itm);
        let itmImageName = [{id:itm._id ,image: itm.book_image, name:itm.book_name}]
        console.log(itmImageName);
        setBookImage(itmImageName);
        let customerInfo = JSON.parse(localStorage.getItem("customerInfo"));
        setCusInfo(customerInfo);
        // console.log(item);
    }, []);

    const handleNext=()=>{
        setIsPayment(true);
        setIsReviewOrder(false);
    }

    const handlePrev=()=>{
        setIsBilling(true);
        setIsReviewOrder(false);
    }
    return (
        <div className='review-order-outer'>
            <h3 className="review-order-heading" >Review Order</h3>
            <div className='review-order-inner'>
                <div className='order-info'>
                <h3 style={{marginBottom:'1rem'}}>Order Information</h3>
                <table>
                <thead>
                <tr>
                <th>Book</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Amount</th>
                </tr>
                </thead>
                    <tbody key={item._id}>
                    <tr>
                    <td>
                    {bookImage.map((itm)=>{
                        return <img key={itm.id} src={require(`../../../public/assets/images/${itm.image}.jpg`)} alt={itm.name} />
                    })}
                    
                    </td>
                    <td>{item.book_name}</td>
                    <td>
                        {item.qty}
                    </td>
                    <td>&#8377; {item.price}</td>
                    <td>&#8377; {item.qty*item.price}</td>
                    </tr>
                    </tbody>
            <tbody>
                    <tr style={{background:'#b3a9346b'}}>
                    <td></td> 
                    <td></td> 
                    <td colSpan="2" style={{textAlign:'right'}}><b>Delivery Charges:</b></td> 
                    <td>&#8377; 100</td>
                    <td></td> 
                    </tr>
                </tbody>
            </table>
            <div className='amount' style={{marginRight:"10%"}}>
                <strong>Total Amount: </strong><b>&#8377; {(item.qty*item.price)+100}</b>
            </div>

                </div>

                <div className='address-info'>
                    <h3>Customer Information</h3>
                    <p><strong>Name: </strong>{cusInfo.fullName}</p>
                    <p><strong>Email: </strong>{cusInfo.email}</p>
                    <p><strong>Contact: </strong>{cusInfo.contact}</p>

                    <h4 style={{marginTop:'5px'}}>Billing Adrress</h4>
                    <address>
                        {cusInfo.address}, &nbsp;
                        {cusInfo.city} &nbsp;
                        {cusInfo.postalCode},&nbsp;
                        {cusInfo.state},&nbsp;
                        {cusInfo.country}
                    </address>
                </div>

                <div className="prev-next-btns" style={{marginTop:'1.5rem'}}>
                        <button type="button"  name="pre" className="btn-prev " onClick={handlePrev} >PREVIOUS</button>
                        <button type="button"  name="next" className="btn-next" onClick={handleNext} >NEXT</button>
                </div>
            </div>       
        </div>
    )
}

export default ReviewOrder
