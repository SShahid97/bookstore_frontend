// import {FaPizzaSlice, FaHamburger} from 'react-icons'
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {NavLink } from 'react-router-dom';
import {FaAngleDown,FaAngleUp,FaAngleRight} from "react-icons/fa";

function Category() {
    // const mainNavLinks = ["Computer Science", "Mathematics","Business Management","English","Science"];
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
    }
    const handleMainLink =()=>{
        setIsHidden(false);
    }
    return (
    <List>
        {/* {mainNavLinks.map((link)=>{
            <MainLinks>
                <h4>{link}</h4>
            </MainLinks>
        })}    */}
        <MainLinks onMouseEnter={handleMainLink}>
            <h4>Computer Science </h4><span className='angle-down'><FaAngleDown /></span>
                <Dropdown className={isHidden?'hide':'droplinks_1'}>
                    <DropLinks >
                        <h4>Web Devlopment</h4> <span className='angle-right'><FaAngleRight /></span>
                        <Dropdown className='droplinks_2 sub_1'>
                            {webDevelopmentLinks.map((drop_link, index)=>{
                                return (
                                    <SLink  key={index} to={drop_link.link} onClick={handleSubLink} >  
                                        <h4>{drop_link.name}</h4>
                                    </SLink>
                                );
                            })}
                            
                        </Dropdown>
                    </DropLinks> 
                    <DropLinks>
                        <h4>Programming Languages</h4> <span className='angle-right'><FaAngleRight /></span>
                        <Dropdown className='droplinks_2 sub_2'>
                            {programmingLanguageLinks.map((drop_link, index)=>{
                                return (
                                    <SLink  key={index} to={drop_link.link}  onClick={handleSubLink}>  
                                        <h4>{drop_link.name}</h4>
                                    </SLink>
                                );
                            })}
                        </Dropdown>
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
            <h4>Mathematics </h4><span className='angle-down'><FaAngleDown /></span>
        </MainLinks>  
        <MainLinks>
            <h4>Business Management </h4><span className='angle-down'><FaAngleDown /></span>
        </MainLinks>  
        <MainLinks>
            <h4>English</h4><span className='angle-down'><FaAngleDown /></span>
        </MainLinks>   
        <MainLinks>
            <h4>Science </h4><span className='angle-down'><FaAngleDown /></span>
        </MainLinks>
        <MainLinks>
            <h4>Others </h4><span className='angle-down'><FaAngleDown /></span>
        </MainLinks>    
    </List>
  )
}


  
const List = styled.div`
    display:flex;
    flex-wrap: wrap;
    .dropdown-links{
       
    }  
    .dropdown-item-links{
        color:white;
        display: flex;
        align-items: center;
        padding: 0.3rem;
        border-radius: 5px ;
    }
`;
const MainLinks = styled.span`
    .hide{
        display: none;;
    }
    .angle-down{
        margin-top:5px;
        color:white;
        margin-left:3px;
    }
    &:hover{
        .droplinks_1{
            display: block;
        }
        background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    }
    display:flex;
    padding:12px;
    text-decoration:none;
    cursor: pointer;
    /* width: 9rem; */
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
const Dropdown = styled.div`
        text-align: left;
        color:white !important;
        z-index: 900;
        list-style: none;
        position: absolute;
        top:50px;
        margin-left: -12px;
        width:220px;
        /* border-radius: 5px; */
        background: grey;
        /* padding:0.5rem; */
        overflow: hidden; 
        display: none;
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
export default Category
