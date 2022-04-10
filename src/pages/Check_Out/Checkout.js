import React, { useEffect, useState } from 'react'
import Billing from './Billing';
import ReviewOrder from './ReviewOrder';
import PaymentMode from './PaymentMode';
// import {useParams} from 'react-router-dom';

function Checkout() {
    const [isBilling, setIsBilling]=useState(true);
    const [isReviewOrder, setIsReviewOrder]=useState(false);
    const [isPayment, setIsPayment]=useState(false);
    const [itemToBuy, setItemToBuy]=useState({});
    // const params = useParams();
    useEffect(()=>{
        let item = JSON.parse(localStorage.getItem("itemToBuy"));
        setItemToBuy(item)
        console.log(item);
    },[])

    return (
    <div>
        {isBilling && (<Billing  setIsBilling={setIsBilling} setIsReviewOrder={setIsReviewOrder} />)}
        {isReviewOrder && (<ReviewOrder setIsPayment={setIsPayment} setIsReviewOrder={setIsReviewOrder} setIsBilling={setIsBilling} itemToBuy={itemToBuy}/>)}
        {isPayment && (<PaymentMode setIsPayment={setIsPayment}  setIsReviewOrder={setIsReviewOrder}/>)}        
    </div>
    )
}

export default Checkout
