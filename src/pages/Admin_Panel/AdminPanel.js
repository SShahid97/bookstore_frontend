import React from 'react';
import AdminSideNav from "./AdminSideNav";
import {NavLink,Outlet } from 'react-router-dom';
import styled from "styled-components";
import "./styles.css";

function AdminPanel() {
  return (
    <div className="admin-panel-container">
        <List>
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
            <SLink to={'manage-users/search-user'}  >  
                <h4>Serach User</h4>
            </SLink>
            <SLink to={'manage-users/search-order'} >  
                <h4>Search Order</h4>
            </SLink>
            
        </List>
      
      <AdminContainer>
          <Outlet/>
      </AdminContainer>
    </div>

  )
}

const List = styled.div`
    .headings{
        padding: 0.4rem;
    }
    height: inherit;
    min-height: 80vh;
  color:white;
  /* height:100% ; */
  list-style: none;
  /* position: absolute; */
  /* top:57px; */
  left:0;
  width:20%;
  /* border-radius: 5%; */
  background: grey;
  padding:0.4rem;
  overflow: hidden; 
  @media (max-width:950px){
    display:none;
  }
`;
const AdminContainer = styled.div`
    width: 80%;
    position: relative;
    padding: 20px;
    @media (max-width:950px){
        width: 100%;
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
export default AdminPanel

