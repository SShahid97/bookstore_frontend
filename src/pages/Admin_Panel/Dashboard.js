import React, { useEffect, useState } from 'react';
import styled from "styled-components";

function Dashboard() {
    const [admin, setAdmin]= useState({});
    useEffect(()=>{
        let Admin = JSON.parse(localStorage.getItem('user'));
        setAdmin(Admin);
    },[])
  return (
    
    <DashboardOuter>
        <h3 className='dashboard-heading'>Hello <strong>{admin.name}</strong>, Welcome to Admin Dashboard.</h3>
        <hr/>
        <DashboardInner>
            <Card>
                <h4>Books</h4>
            </Card>
            <Card>
                <h4>Users</h4>
            </Card>
            <Card>
                <h4>Orders</h4>
            </Card>
        </DashboardInner>

    </DashboardOuter>
  )
}

const DashboardOuter = styled.div`
    /* display: flex; */
    background-color: #f7f7f7;
    height: auto;
    box-shadow: 2px 4px 4px 1px #00000036;
    text-align: center;
    padding-bottom: 2rem;
    padding-top: 2rem;
    padding: auto auto;
    .dashboard-heading{
        margin-bottom:0.8rem ;
    }
    
`;
const DashboardInner = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width:90%;
    margin:0 auto;
    margin-top:1rem;
    @media (max-width:1080px){
        justify-content: flex-start;
    }
    @media (max-width:950px){
        justify-content: flex-start;
    }
    @media (max-width:650px){
        flex-direction: column;
    }
`;
const Card = styled.div`
    color: white;
    background: linear-gradient(85deg, blue, #38df63b8);
    padding: 0.8rem;
    min-height:16rem;
    min-width:15rem;
    border-radius:5px;
    overflow:hidden;
    position:relative;
    margin-right:10px;
    @media (max-width:650px){
        margin-bottom:10px ;
    }
    
`;
export default Dashboard