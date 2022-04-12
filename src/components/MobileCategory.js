import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {NavLink } from 'react-router-dom';
import {FaAngleDown,FaAngleUp,FaAngleRight,FaAngleLeft} from "react-icons/fa";

function MobileCategory({setmobileView}) {
    const web_Development_Links = [
        {link:"/books/js_book", name:"JavaScript"}, {link:"/books/html_book", name:"Html"},
        {link:"/books/css_book", name:"CSS"}, {link:"/books/mysql_book", name:"MySql"},
        {link:"/books/php_book", name:"PHP"} 
    ]
    const programming_Language_Links = [
        {link:"/books/js_book", name:"C"}, {link:"/books/html_book", name:"C++"},
        {link:"/books/css_book", name:"Java"}, {link:"/books/mysql_book", name:"C#"},
        {link:"/books/php_book", name:"Python"} 
    ]   
    const [webDevelopmentLinks, setWebDevelopmentLinks] = useState([]);
    const [programmingLanguageLinks, setProgrammingLanguageLinks] = useState([]);
    const [isHidden, setIsHidden]= useState(false);
    useEffect(()=>{
        setWebDevelopmentLinks(web_Development_Links);
        setProgrammingLanguageLinks(programming_Language_Links);
    },[])
    const handleSubLink=()=>{
        setIsHidden(true);
        setmobileView(false);
    }
    const handleMainLink =()=>{
        setIsHidden(false);
    }
  return (
    <List>
        <MainLinks onMouseEnter={handleMainLink}>
            <span className='angle-left'><FaAngleLeft /></span>  <h4>Computer Science </h4>
            
            <Dropdown className={isHidden?'hide':'droplinks_1'}>
                    <DropLinks >
                    <span className='angle-left'><FaAngleLeft /></span>  <h4>Web Devlopment</h4> 
                        
                    </DropLinks> 
                    <DropLinks>
                    <span className='angle-left'><FaAngleLeft /></span>  <h4>Programming Languages</h4> 
                       
                    </DropLinks> 
                    <DropLinks>
                        <SLink style={{padding:'0px',borderBottom:'none' }} to={"/books/js_book"} onClick={handleSubLink} >  
                            <h4>Computer Networks</h4>
                        </SLink>
                    </DropLinks> 
                   
                    <DropLinks>
                        <SLink style={{padding:'0px', borderBottom:'none'}} to={"/books/css_book"} onClick={handleSubLink} >  
                            <h4>Wireless Communication</h4>
                        </SLink>
                    </DropLinks> 
                </Dropdown>   
                </MainLinks>
        <MainLinks>
        <span className='angle-left'><FaAngleLeft /></span><h4>Mathematics </h4>
        </MainLinks>  
        <MainLinks>
        <span className='angle-left'><FaAngleLeft /></span> <h4>Business Management </h4>
        </MainLinks>  
        <MainLinks>
        <span className='angle-left'><FaAngleLeft /></span>  <h4>English</h4>
        </MainLinks>   
        <MainLinks>
        <span className='angle-left'><FaAngleLeft /></span>   <h4>Science </h4>
        </MainLinks>   

    </List>
  )
}


const List = styled.div`
  height:100vh ;
  z-index: 1200;
  list-style: none;
  position: absolute;
  top:51px;
  right:0;
  width:250px;
  /* border-radius: 5%; */
  background: grey;
  /* padding:0.3rem; */
  overflow: hidden; 
  @media (max-width: 550px){
    top:50px;
  }
`;
const MainLinks = styled.span`
    .hide{
        display: none;;
    }
    .angle-left{
        margin-top:3px;
        color:white;
        margin-right:2px;
    }
    &:hover{
        .droplinks_1{
            display: block;
            /* position:fixed; */
        }
        background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    }
    display:flex;
    padding:10px;
    text-decoration:none;
    cursor: pointer;
    /* width: 9rem; */
    text-align: center;
    /* background: linear-gradient(275deg,#4949498c,#313131e3); */

    cursor:pointer;

    h4{
        color:white;
        font-weight: 500;
    }
`;

const Dropdown = styled.div`
        text-align: left;
        color:white !important;
        z-index: 900;
        list-style: none;
        position: inherit;  //absolute
        /* top:71px;
        margin-left: -231px; */
        margin-top: 40px;
        margin-left: -145px;
        width:220px;
        /* border-radius: 5px; */
        background: grey;
        /* padding:0.5rem; */
        overflow: hidden; 
        display: none;
        font-size:0.8rem;
`;
const  DropLinks = styled.div`
        border-bottom: 1px solid white;
        color:white !important;
        display: flex;
        /* flex-direction: column; */
        align-items: left;
        padding: 8px;
        h4{
            font-weight: 600;
            color:white;
        }
        &:hover{
            background:linear-gradient(to right, #f27121, #e94057);
            .droplinks_2{
                display: block;
                /* margin-left: 157px; */
                /* z-index: 5000; */
                position: fixed;
                width: 170px;
                left: 409px;
                text-align: left;
            }
            .sub_1{
                
                top: 65px;
            } 
            .sub_2{
                top: 108px;
            }
            .sub_3{
                top: 205px;
            }  
        } 
        .angle-right{
            margin-top:5px;
            color:white;
            margin-left:3px;
        }
`;

const SLink = styled(NavLink)`
        border-bottom: 1px solid white;
        color:white !important;
        /* height: 30px; */
        display: flex;
        flex-direction: column;
        align-items: left;
        padding: 8px;
        /* border-radius: 5px ; */
        h4{
            font-weight: 600;
        }
    &:hover{
        background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    } 
   
`;
export default MobileCategory
