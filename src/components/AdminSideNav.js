import React from 'react'
import { NavLink } from 'react-router-dom';
import styled from "styled-components";

function AdminSideNav({toggleArrowMenu,setToggleArrowMenu }) {
  const handleCloseNav = ()=>{
    setToggleArrowMenu(false)
  }
  return (
    <NavOuter>
      <List className={toggleArrowMenu?"mobile-view":"desktop-view"} onClick={handleCloseNav}>
        <h4 className='headings'>Manage Books</h4>
        <SLink to={'manage-books/view-all-items'}  >
          <h4>View Books</h4>
        </SLink>
        <SLink to={'manage-books/add-item'} >
          <h4>Add New Book</h4>
        </SLink>

        <h4 className='headings'>Manage Users & Orders</h4>
        <SLink to={'manage-users/view-all-users'}  >
          <h4>View All Users</h4>
        </SLink>
        <SLink to={'manage-users/search-order'} >
          <h4>Search Order</h4>
        </SLink>

        <h4 className='headings'>Manage Stock</h4>
        <SLink to={'manage-users/add-stock-details'}  >
          <h4>Add Stock Details</h4>
        </SLink>
        <SLink to={'manage-users/view-stock-details'} >
          <h4>View Stock Details</h4>
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
      top: 49px;
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
    }
    
`;
const SLink = styled(NavLink)`
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
    h4{
        color:white;
        font-size: 0.9rem;
        font-weight: 500;
    }
`;
export default AdminSideNav
