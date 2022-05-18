import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import {
    FaUserFriends,
    FaEye,
    FaGift
} from "react-icons/fa";


function Dashboard() {
    const [admin, setAdmin]= useState({});
    useEffect(()=>{
        let Admin = JSON.parse(localStorage.getItem('user'));
        localStorage.removeItem("OrderId")
        setAdmin(Admin);
    },[])
  return (
    
    <DashboardOuter>
        <h3 className='dashboard-heading'>Hello <strong>{admin.name}</strong>, Welcome to Admin Dashboard.</h3>
        <hr/>
        <DashboardInner>
            <Card>
                <div className='card-text'>
                    <p>1586</p>
                    <p>Registered Users</p>
                </div>
                <div className='icon'><FaUserFriends/></div>
            </Card>
            <Card>
                <div className='card-text'>
                    <p>100</p>
                    <p>Daily Views</p>
                </div>
                <div className='icon'><FaEye/></div>
            </Card>
            <Card>
                <div className='card-text'>
                    <p>450</p>
                    <p>Orders Delivered so far</p>
                </div>
                <div className='icon'><FaGift/></div>
            </Card>
            <div className='sales-img-div'>
                <img src={require("./sales_image.png")} alt="Sales " />
            </div>

        </DashboardInner>

    </DashboardOuter>
  )
}

const DashboardOuter = styled.div`
    /* display: flex; */
    background-color: #f7f7f7;
    height: auto;
    box-shadow: 2px 4px 4px 1px #00000036;
    /* text-align: center; */
    padding-bottom: 1rem;
    padding-top: 1rem;
    padding: auto auto;
    .dashboard-heading{
        text-align: center;
        margin-bottom:0.8rem ;
        font-weight: 500;
        @media (max-width:650px){
            font-size: 0.9rem;
        }
        @media (max-width:360px){
            font-size: 0.8rem;
        }

    }
    
`;
const DashboardInner = styled.div`
    display: flex;
    flex-wrap: wrap;
    /* justify-content: flex-start; */
    width:95%;
    margin:0 auto;
    margin-top:1rem;
    margin-bottom:1rem;
    .sales-img-div{
        min-width: 10rem;
        width: 70%;
        height: auto;
        margin: 0 auto;
        border: 1px solid lightgrey;
        border-radius: 3px;
        margin-top: 15px;
        @media (max-width:650px){
            width: 97%;
            margin-top: 5px;
        }
    }
    .sales-img-div img{
        width: 100%;
        height: inherit;
        border-radius: 3px;
    }
    @media (max-width:1080px){
        justify-content: flex-start;
    }
    @media (max-width:950px){
        justify-content: flex-start;
    }
    @media (max-width:650px){
        width:100%;
        flex-direction: column;
    }
`;
const Card = styled.div`
    color: white;
    background: linear-gradient(85deg,#0000ffb3,#38dfd7d1);
    padding: 1.5rem 0.5rem;
    height:auto;
    width:19rem;
    border-radius:3px;
    overflow:hidden;
    position:relative;
    margin: 0 auto;
    display:flex;
    @media (max-width:1250px){
        width:16rem;
    }
    @media (max-width:1000px){
        width:14rem;
    }
    @media (max-width:650px){
        margin-bottom:10px ;
        width:18rem;
    }
    .icon{
        width: 25%;
        font-size: 2.5rem;
        border: 1px solid darkcyan;
        border-radius: 50%;
        background: white;
        color:  #0000ffbd;
        padding: 5px 16px;
        @media (max-width:1000px){
            font-size: 2rem;
            padding: 5px 11px;
        }
        @media (max-width:650px){
            width: 20%;
            font-size: 1.5rem;
            padding: 8px 16px;
        }
    }
    .card-text{
        width:75%;
        @media (max-width:650px){
            padding-left: 10px;
        }
    }
    p{
        font-size: 20px;
        font-weight: 600;
        @media (max-width:1250px){
            font-size: 18px;
        }
        @media (max-width:1000px){
            font-size: 16px;
        }
        @media (max-width:650px){
            font-size: 15px;
        }
    }
    
`;
export default Dashboard