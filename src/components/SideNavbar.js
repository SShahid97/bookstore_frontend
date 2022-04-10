import React from 'react';
import styled from 'styled-components';
import {NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {userService} from "../services/LocalService";

function SideNavbar() {
    const [isAdmin, setIsAdmin] = useState(false); 
   
   useEffect(()=>{
    let user = JSON.parse(localStorage.getItem("user"));
    if(user){
      if(user.role === "admin"){
        setIsAdmin(true);
      }
    }

    userService.onUser().subscribe(curr_user => {
        if (curr_user) {
            if(curr_user.role === "admin"){
                setIsAdmin(true);
            }
        }     
      });

      return (setIsAdmin(false));
  },[])
    return (
        <>
        {!isAdmin && (
            <OuterDiv >
            <List>
                <SLink to={'/'}  >
                    <h4>HOME</h4>
                </SLink>
                <SLink to={'/books/js_book'} >
                    <h4>JAVASCRIPT</h4>
                </SLink>
                <SLink to={'/books/html_book'} >
                    <h4>HTML</h4>
                </SLink>
                <SLink to={'/books/css_book'}>
                    <h4>CSS</h4>
                </SLink>
                <SLink to={'/books/mysql_book'} >
                    <h4>MYSQL</h4>
                </SLink>
                <SLink to={'/books/php_book'} >
                    <h4>PHP</h4>
                </SLink>
            </List>
        </OuterDiv>
        ) }
        </>
    )
}


const OuterDiv = styled.div`
  margin-top: 58px;
  height: inherit;
  width:20%;
  @media (max-width: 1000px) {
         display:none;

    }
`;
const List = styled.div`
  height:100% ;
  z-index: 1200;
  list-style: none;
  /* position: absolute; */
  /* top:57px; */
  left:0;
  width:100%;
  /* border-radius: 5%; */
  background: linear-gradient(173deg, hsl(0deg 0% 0% / 32%), #313131d9);
  padding:0.8rem;
  overflow: hidden; 
`;

const SLink = styled(NavLink)`
    /* &.active{
        background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    } */
    color:white;
    /* height: 40px; */
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 5px ;
    
    h4{
        color:white;
        font-size: 0.9rem;
    }

    
`;
export default SideNavbar
