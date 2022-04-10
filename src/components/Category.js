// import {FaPizzaSlice, FaHamburger} from 'react-icons'
import React from 'react';
import styled from 'styled-components';
import {NavLink } from 'react-router-dom';

function Category() {
  return (
    <List>
        <SLink to={'/books/js_book'}  >  
            <h4>JAVASCRIPT</h4>
        </SLink>
        <SLink to={'/books/html_book'}  >  
            <h4>HTML</h4>
        </SLink>
        <SLink to={'/books/css_book'} >  
            <h4>CSS</h4>
        </SLink>
        <SLink to={'/books/mysql_book'}>  
            <h4>MYSQL</h4>
        </SLink>
        <SLink to={'/books/php_book' } >  
            <h4>PHP</h4>
        </SLink>
    </List>
  )
}

const List = styled.div`
    display:flex;
    flex-wrap: wrap;
    width:60%;
    
    /* margin: 0 auto; */
    /* margin:2rem 0rem; */
    /* @media (max-width: 850px) {
        
    }   */
`;

const SLink = styled(NavLink)`
    &:hover{
        background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    }
    padding:12px;
    text-decoration:none;
    cursor: pointer;
    width: 8rem;
    text-align: center;
    /* background: linear-gradient(275deg,#4949498c,#313131e3); */

    cursor:pointer;
    /* transform:scale(0.8); */
    @media (max-width: 1150px) {
        width: 7rem;
    }

    @media (max-width: 1000px) {
        display:none;
    }


    h4{
        color:white;
        font-weight: 500;
    }

    
`;
export default Category
