import React, { useEffect } from 'react';
import styled from "styled-components";
import {mobileMenuService} from "../services/LocalService";
function AboutUs(){
    useEffect(()=>{
        window.scrollTo(0,0);
        mobileMenuService.setMobileMenuIndicies(null);
    },[])
    return(
        <AboutOuter>
            <h3 className='aboutHeading'>About Us</h3>
            <div className='about-inner'>
                <div className='eboostore about'>
                    <h4 className='aboutinnerHeadings'>E-Bookstore</h4>
                    <p style={{textAlign:'justify'}}>
                        E-bookstore is an online shopping web application for Books.
                        Our E-bookstore can be used by the startups who want to sell books online. They will get a very easy-to-use
                        user interface for maintaining their books inventory, like adding new books, editing existing books, or 
                        removing books. They also get some advanced features of customization. Also, they can keep track of customers
                        order history for future use.
                            Our e-bookstore is a single-page web application, developed using <b>MERN</b> stack, which will make it 
                        quite fast, giving a nice user experience, as compared to multipage web applications.
                    </p>
                </div>
                <div className='email about'>
                <h4 className='aboutinnerHeadings'>Email</h4>
                    <p>
                        ebookstore368@gmail.com
                    </p>
                </div>
                <div className='phone about'>
                    <h4 className='aboutinnerHeadings'>Phone</h4>
                    <p>
                        9622752247
                    </p>
                </div>
                <div className='address about'>
                    <h4 className='aboutinnerHeadings'>Address</h4>
                    <p>
                        Lapataganj
                    </p>
                </div>
            </div>
        </AboutOuter>
    )
}

const AboutOuter = styled.div`
    /* width: calc(100% / 3); */
    width: 70%; 
    height: auto;
    margin: auto; 
    box-shadow: 6px 7px 7px 1px #00000036;
    background-color: #f7f7f7; 
    margin-top: 5px; 
    border-radius: 3px;
    padding-bottom:0.7rem;
    margin-bottom: 1rem !important;

    .aboutHeading{ 
        text-align: center; 
        background: gray; 
        padding: 10px; 
        color: white;
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
    }
    .aboutinnerHeadings{
        text-align: left; 
        background: #adaaaa; 
        padding: 5px; 
        color: white;
    }
    p{
        padding:10px;
    }
    /* .about-inner{
        padding:10px; 
    } */
    .about{
        width:85%;
        margin:0 auto;
        border: 1px solid #adaaaa;
        border-radius: 2px;
        margin-top:10px;
        @media (max-width:650px){
            width:95%
        }
    }

    @media (max-width:650px){
        width:98%;
        margin-top: -20px;
        h3{
            font-size: 1.2rem;
        }
 
    }
`;
export default AboutUs;