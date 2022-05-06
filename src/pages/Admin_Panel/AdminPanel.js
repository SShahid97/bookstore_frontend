import React, { useState,useEffect } from 'react';
import AdminSideNav from "../../components/AdminSideNav";
import {Outlet, useNavigate } from 'react-router-dom';
import styled from "styled-components";
import "./styles.css";
import {FaAngleLeft,FaAngleRight} from "react-icons/fa";

function AdminPanel() {
  const [toggleArrowMenu, setToggleArrowMenu]= useState(false);
  let navigate = useNavigate();
  useEffect(()=>{
    window.scrollTo(0, 0);
    let user = JSON.parse(localStorage.getItem('user'));
    if(!user ){
      navigate("/login");
    }else{
      if(user.role !== "admin"){
        navigate("/login");
      }
    }

  },[])
  const handleMenuArrow = ()=>{
    setToggleArrowMenu(!toggleArrowMenu);
  }
  return (
    <AdminPanelConatiner >
      <AdminSideNav toggleArrowMenu={toggleArrowMenu} setToggleArrowMenu={setToggleArrowMenu}/>
      <span className={toggleArrowMenu?"arrow-active arrow-menu":"arrow-menu"} onClick={handleMenuArrow}>
        {!toggleArrowMenu && <FaAngleRight className='arrow'/>}
        {toggleArrowMenu && <FaAngleLeft className='arrow'/>}
      </span>
      <AdminContainer>
          <Outlet/>
      </AdminContainer>
    </AdminPanelConatiner>

  )
}

const AdminPanelConatiner = styled.div`
    display: flex;
    margin-top: -5px;
    margin-left: -10px;
    min-height: 82vh;
    .arrow-menu{
      display: none;
      position: fixed;
    }
    .side-nav{
      display: none !important;
    }
    @media (max-width:850px){
        width: 100%;
        .arrow-menu{
          display: block;
          height: 30px;
          width: 25px;
          background: grey;
          color: white;
          padding: 0px;
          margin-top: 9px;
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
          z-index:1300;
          opacity: 0.5;
      }
      .arrow{
        margin-left: 3px;
        margin-top: 8px;
        transform: scale(1.5);
        
      }
      .arrow-menu:hover{
        background: linear-gradient(to right, #f27121, #e94057);
        cursor: pointer;
        opacity: 1;
      }
      .arrow-active{
        background: linear-gradient(to right, #f27121, #e94057);
        cursor: pointer;
        position: absolute;
        margin-left: 275px;
        opacity: 1;
        position: fixed;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
        border-top-right-radius: unset;
        border-bottom-right-radius: unset;
        animation: 310ms slide-right;

      }
      @keyframes slide-right {
        from {
          margin-left: -100%;
        }
        to {
          margin-left: 0%;
        }
      }
    }
   
     @media (max-width:650px){
      .arrow-menu{
        margin-top: -10px;
      }
     }
    
`;
const AdminContainer = styled.div`
    width: 80%;
    position: relative;
    padding: 15px;
    margin: 0 auto;
    @media (max-width:950px){
        width: 100%;
    }
`;


export default AdminPanel

