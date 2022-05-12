import React, { useEffect,useState } from 'react';
import styled from "styled-components";
import {mobileMenuService} from "../services/LocalService";
function Faqs(){
    let faqs =   [
        {
            question: "How do I pay for a purchase?",
            answer:"Currently we provide Cash on Delivery as well as Online payment methods for our customers on our platform. A customer can use his/her Debit Card, Credit Card, Net Banking, UPI, Wallet Payment or the likes. If you prefer, you can pre-pay the amount through J&K Bank mPay also after contacting us."
        },
        {
            question: "What is Cash on Delivery?",
            answer:"If you are not comfortable making an online payment, you can opt for the Cash on Delivery (COD) payment method instead. With COD you can pay in cash at the time of actual delivery of the product at your doorstep, without requiring you to make any advance payment online. Foreign currency cannot be used to make a COD payment. Only Indian Rupees accepted."
        },
        {
            question: "What are the delivery charges?",
            answer:"There is a minimum Delivery fees of Rs. 50 on Orders from Re. 1 to Rs. 499. All Orders above Rs.500 do not incur a Delivery charge within Srinagar city limits. Shipping cost for Customers outside city limits is calculated on the basis of Product Quantity + Weight of total order."
        },
        {
            question: "What is My Account? How do I update my information?",
            answer:"It is easy to update your E-Bookstore account and view your orders any time through My Account. My Account allows you complete control over your transactions on E-bookstore. Manage/edit your personal data like address, phone numbers, email ids. Change your password."
        },
        {
            question: "Is it necessary to have an account to shop on E-Bookstore?",
            answer:"You can shop on E-bookstore by providing just your email ID. By creating your own E-bookstore account, you can enjoy a personalized shopping experience, including recommendations, quicker checkout and a wishlist."
        }
    ];
    const [questions, setQuestions] = useState([]);
    const [questionNumber, setQuestionNumber]= useState("");
    useEffect(()=>{
        window.scrollTo(0,0);
        mobileMenuService.setMobileMenuIndicies(null);
        setQuestions(faqs);
    },[]);
    const handleToggle = (e,index)=>{
        setQuestionNumber(index);
        // setToggleQuestion(!toggleQuestion);
    }
    return(
        <FaqsOuter>
        <h3 className='faqHeading'>Frequently Asked Questions</h3>
        <div className='faq-inner'>
            {questions.map((question, index)=>{
                 return (
                    <div className='faq' key={index}>
                        <h4 className={questionNumber === index?'activate faqinnerHeadings':'faqinnerHeadings'} onClick={(e)=>handleToggle(e,index)}>{question.question}</h4>
                         <div className={questionNumber === index?'show':'hide'}>
                            <p className='answer'>
                                {question.answer}
                            </p>     
                        </div>
                    </div>
                 )
            })}
        </div>
    </FaqsOuter>
    )
}

const FaqsOuter = styled.div`
    /* width: calc(100% / 3); */
    width: 70%; 
    height: auto;
    margin: auto; 
    box-shadow: 6px 7px 7px 1px #00000036;
    background-color: #f7f7f7; 
    margin-top: 5px; 
    border-radius: 3px;
    padding-bottom:1rem;
    margin-bottom: 1rem !important;
    .faqHeading{ 
        text-align: center; 
        background: gray; 
        padding: 10px; 
        color: white;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
    }
    .faqinnerHeadings{
        text-align: left; 
        background: #adaaaa; 
        padding: 8px; 
        color: white;
    }

    .show{
        display: block;
        padding:10px; 
    }
   
    .hide{
        display:none;
    }

    .faq{
        width:85%;
        margin:0 auto;
        border: 1px solid #adaaaa;
        border-radius: 2px;
        margin-top:10px;
        @media (max-width:650px){
            width:95%
        }
    }
    h4{
        font-weight: 600;
        cursor: pointer;
    }
    h4:hover{
        background: linear-gradient(to right, #f27121a9, #e94057d2);
    }
    .activate{
        background: linear-gradient(to right, #f27121,#e94057);
    }
    .answer{
        text-align:justify;
    }
    @media (max-width:650px){
        margin-top: -20px;
        width:98%;
        h3{
            font-size: 1.2rem;
        }
    }
`;
export default Faqs;