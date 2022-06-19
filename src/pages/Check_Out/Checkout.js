import React, { useEffect, useState } from 'react'
import Billing from './Shipping';
import PaymentMode from './PaymentMode';
import {useParams} from 'react-router-dom';
import ReviewOrder from './ReviewOrder';

function Checkout() {
    const [isBilling, setIsBilling]=useState(false);
    const [isReviewOrder, setIsReviewOrder] = useState(false);
    const [isPayment, setIsPayment]=useState(false);

    // const [itemToBuy, setItemToBuy]=useState({});
    const params = useParams();
    useEffect(()=>{
        // console.log(params.name);
        if(params.name === "billing"){
            setIsBilling(true);
            setIsReviewOrder(false);
            setIsPayment(false);
        }else if(params.name === "revieworder"){
            setIsReviewOrder(true);
            setIsBilling(false);
            setIsPayment(false);
        }else if(params.name === "payment"){
            setIsPayment(true);
            setIsReviewOrder(false);
            setIsBilling(false);
        }
        // console.log(params.userId);
        // let cart = JSON.parse(localStorage.getItem("cart"));
        // setItemToBuy(cart)
        // console.log(cart);
    },[params])

    return (
    <div>
        {isBilling && (<Billing/>)}
        {isReviewOrder && (<ReviewOrder/>)}
        {isPayment && (<PaymentMode />)}        
        {/* {isReviewOrder && (<ReviewOrder setIsPayment={setIsPayment} setIsReviewOrder={setIsReviewOrder} setIsBilling={setIsBilling} itemToBuy={itemToBuy}/>)} */}
    </div>
    )
}

export default Checkout
