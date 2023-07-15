import React, {useEffect, useState} from 'react';
import emailjs from '@emailjs/browser';
import styled from 'styled-components';
import {mobileMenuService} from "../services/LocalService";

function ContactUs() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    useEffect(()=>{
        window.scrollTo(0, 0);
        mobileMenuService.setMobileMenuIndicies(null);
    },[])
    const handleSubmit = (e) =>{
        e.preventDefault();
        let formObj = {
            name: name,
            email: email,
            subject: subject,
            message: message
        }
        // console.log(formObj);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        // emailjs.send('service_2rgz7hq', 'template_r4gi8ss', formObj, '3DRAqhnj6rTu4Rzmb')
        // .then(response => {
        //     console.log("Success", response);
        // },error => {
        //     console.log("Failed", error);
        // })
        
    }

    const handleName = (e) =>{
        setName(e.target.value);
    }
    const handleEmail = (e) =>{
        setEmail(e.target.value);
    }
    const handleSubject = (e) =>{
        setSubject(e.target.value);
    }
    const handleMessage = (e) =>{
        setMessage(e.target.value);
    }
    return (
        <ContactFormOuter >
            <h3 className='contactHeading'>Contact Us</h3>
            <form onSubmit = {handleSubmit} className='contactFormInner'>
                <label > <strong>Name:</strong> </label><br/>
                    <input placeholder = "Name" type="text" value={name} onChange={handleName} required/>
                <br/>
                <label > <strong> Email:</strong> </label><br/>
                    <input placeholder = "Email"  type="email" value={email} onChange={handleEmail} required/>
                <br/>
                <label > <strong> Subject:</strong></label><br/>
                    <input placeholder = "Subject"  type="text" value={subject} onChange={handleSubject} required/>
                <br/>
                <label > <strong>Message:</strong></label><br/>
                    <textarea placeholder = "Enter your query here..."  rows={5} value={message} onChange={handleMessage} required/>
                <br/>
                <button className='SendBtn' type="submit" > Send Message </button>
            </form>
        </ContactFormOuter>
    )
}

const ContactFormOuter = styled.div`
    width: 60%; 
    height: auto;
    margin: auto; 
    margin-top: auto; 
    box-shadow: 6px 7px 7px 1px #00000036;
    background-color: #f7f7f7; 
    margin-top: 5px; 
    border-radius: 3px;
    margin-bottom:1rem;
    .contactFormInner{
        width:65%;
        margin:0 auto; 
        padding: 20px;
        margin-top: 10px;
    }
    .contactHeading{ 
        text-align: center; 
        background: gray; 
        padding: 10px; 
        color: white;
    }
    .contactFormInner input {
        width: 95%; 
        margin-bottom: 8px; 
        font-size: 15px; 
        padding: 8px 5px; 
        border: 1px solid #9e9e9e73; 
        border-radius: 3px; 
        outline: none;
    }
    .contactFormInner textarea {
        width: 95%; 
    }
    .SendBtn{
        width:150px;
        margin-bottom: 5px; 
        font-size: 15px; 
        padding: 8px 10px; 
        border: 1px solid #9e9e9e73; 
        border-radius: 3px; 
        outline: none;
        background-color: blue;
        color:white;
        cursor: pointer;
    }
    .SendBtn:hover{
        background-color: rgb(15 33 189);
    }
    @media (max-width:650px){
        width:98%;
        margin-top: -20px;
        h3{
            font-size: 1rem;
        }
        .contactFormInner{
            width:95%;
        }
    }
`;

export default ContactUs;