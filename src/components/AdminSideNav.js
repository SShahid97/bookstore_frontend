import React from 'react'
import { NavLink } from 'react-router-dom';
import styled from "styled-components";
import {
  FaUserFriends,
  FaFileImport,
  FaSearchDollar,
  FaRegEye,
  FaEdit,
  FaChalkboardTeacher
  } from "react-icons/fa";

import {MdLibraryAdd} from "react-icons/md"

function AdminSideNav({toggleArrowMenu,setToggleArrowMenu }) {
  const handleCloseNav = ()=>{
    setToggleArrowMenu(false)
  }
  return (
    <NavOuter>
      <List className={toggleArrowMenu?"mobile-view":"desktop-view"} onClick={handleCloseNav}>
        <SLink to={"dashboard"} className='dropdown-item' style={{marginTop: '20px'}}>         
          <span className='icons'> <FaChalkboardTeacher /></span><h4>Admin Dashboard</h4>
        </SLink>
        <h4 className='headings'>Manage Books</h4>
        <SLink to={'manage-books/view-all-items'}  >
          <span className='icons'> < FaRegEye/> </span><h4>View Books</h4>
        </SLink>
        <SLink to={'manage-books/add-item'} >
        <span className='icons'> < FaFileImport/> </span> <h4>Add New Book</h4>
        </SLink>

        <h4 className='headings'>Manage Users & Orders</h4>
        <SLink to={'manage-users/view-all-users'}  >
        <span className='icons'> < FaUserFriends/> </span><h4>View All Users</h4>
        </SLink>
        <SLink to={'manage-users/search-order'} >
        <span className='icons'> < FaSearchDollar/> </span><h4>Search Order</h4>
        </SLink>

        <h4 className='headings'>Manage Stock</h4>
        <SLink to={'manage-users/add-stock-details'}  >
        <span className='icons'> < MdLibraryAdd/> </span> <h4>Add Stock Details</h4>
        </SLink>
        <SLink to={'manage-users/view-stock-details'} >
        <span className='icons'> < FaEdit/> </span><h4>Edit Stock Details</h4>
        </SLink>

      </List>
    </NavOuter>
  )
}

const NavOuter = styled.div`
  height:auto;
  .mobile-view{
      color:white;
      list-style: none;
      left:0;
      background: grey;
      padding:1rem;
      overflow: hidden; 
      display: block;
      position: fixed;
      top: 50px;
      width: 300px;
      padding-top: 15px;
      z-index: 1200;
      height: 100%;
      /* animation: showUp 100ms; */
      animation: 300ms slide-right;
  }
  

  @keyframes slide-right {
    from {
      margin-left: -100%;
    }
    to {
      margin-left: 0%;
    }
  }
  /* @keyframes showUp {
    from {width: 0;}
    to {width: 50%;}
  } */
  .desktop-view{
      color:white;
      list-style: none;
      left:0;
      background: grey;
      padding:0.4rem;
      overflow: hidden;
      height: 100%;
  }    
    @media (max-width:850px){
      .desktop-view{
        display:none;
      }
    }
`;
const List = styled.div`
    .headings{
        padding: 0.4rem;
        font-size: 1.1rem;
    }
    
`;
const SLink = styled(NavLink)`
    &:hover{
      background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    }
    &.active{
        background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    }

    color:white;
    display: flex;
    align-items: center;
    padding: 0.4rem;
    border-radius: 2px ;
    margin-left:0.6rem;
    .icons{
      margin-right: 5px;
      margin-top: 5px;
      font-size: 1.3rem;
    }
    h4{
        color:white;
        font-size: 1rem;
        font-weight: 500;
    }
`;
export default AdminSideNav
