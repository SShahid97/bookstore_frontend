import React from 'react';
import styled from 'styled-components';
import {NavLink } from 'react-router-dom';

function MenuOnScroll() {

  return (
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
    <SLink to={'/books/php_book' } >  
        <h4>PHP</h4>
    </SLink>
    </List>
  )
}


const List = styled.div`
  height:100vh ;
  z-index: 1200;
  list-style: none;
  position: absolute;
  left:0 !important;
  top:57px;
  width:250px;
  /* border-radius: 5%; */
  background: linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131d9);
  padding:0.8rem;
  overflow: hidden; 
  @media (max-width: 550px){
    top:50px;
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
    /* height: 40px; */
    display: flex;
    align-items: center;
    padding: 0.5rem;
    border-radius: 5px ;

    h4{
        color:white;
        font-size: 0.9rem;
        font-weight: 500;
    }
`;
export default MenuOnScroll
