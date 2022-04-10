import React from 'react'

function PaymentMode({setIsPayment, setIsReviewOrder}) {

 
    const handlePrev=()=>{
        setIsPayment(false);
        setIsReviewOrder(true);
    }

    const handleNext=()=>{
        
    }
  
  return (
    <div className="payment-method-screen" >
        <h3 className='payment-heading'>Select Payment Method</h3>
        <div className='payment-method-screen-inner'>
            <div className="form-check" style={{marginTop:'1.5rem'}}>
                <input className="pay-online-input" type="radio" name="payMethod"  value="1" checked />
                <label className="pay-online-label" htmlFor="exampleRadios1">
                    Pay Online
                </label>
            </div>
            <div className="form-check">
                <input className="cod-input" type="radio" name="payMethod" value="2" />
                <label className="cod-label" htmlFor="exampleRadios2">
                Cash On Delivery
                </label>
            </div>
            <div className="prev-next-btns" style={{marginTop:'1.5rem'}}>
                    <button type="button"  name="pre" className="btn-prev " onClick={handlePrev} >PREVIOUS</button>
                    <button type="button"  name="next" className="btn-next" onClick={handleNext} >NEXT</button>
            </div>
        </div>        
    </div>
  )
}

export default PaymentMode
