import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {NavLink } from 'react-router-dom';
import {mobileMenuService} from "../services/LocalService";
// import {FaAngleDown,FaAngleUp,FaAngleRight,FaAngleLeft} from "react-icons/fa";
import {
    Compter_Science,
    Business_Management,
    Science,
    Mathematics,
    Other
} from "../services/MainMenuCategories";
import {motion} from "framer-motion";

function MobileCategory({setmobileView}) {
    const General_Categories = [Compter_Science, Business_Management, Science, Mathematics, Other];
    const [toggleSubMenuOne, setToggleSubMenuOne]= useState(false);
    const [indecies, setIndecies]= useState();
    const [indecies2, setIndecies2]= useState();
    const [indecies3, setIndecies3]= useState();
    const [toggleSubMenuTwo, setToggleSubMenuTwo]= useState(false);
    
    useEffect(()=>{
        // console.log('hash', location.hash);
        // console.log('search', location.search);
    },[indecies3]);

    //for unsetting the previous state of navbar if navigated to other page
    mobileMenuService.onUpdateMobileMenuIndicies().subscribe(indecies => {
        setIndecies(indecies);
        setIndecies2(indecies);
        setIndecies3(indecies);
    });
    const handleSubLink=(e,index)=>{
        // setIsHidden(!isHidden);
        e.stopPropagation();
        setIndecies3(index)
        let ind = indecies3;
        // console.log("indecies3: ", ind)
        // console.log("index: ", index)
        setmobileView(false);
    }
    const handleMainLink =(e,index)=>{
        e.stopPropagation();
        // console.log(e)
        // console.log("Main: ",index)
        setIndecies2("");
        // setActivateLink(false);
        setToggleSubMenuOne(!toggleSubMenuOne);
        setIndecies(index)
    }
    const handleSubMenu = (e,index)=>{
        e.stopPropagation();
        // console.log("Sub:",index)
        setIndecies2(index)
        setIndecies3(null);
        let ind = indecies3;
        // console.log("indecies3: ", ind)
        setToggleSubMenuTwo(!toggleSubMenuTwo);
    }
    const handleHomeLink =(e)=>{
        e.stopPropagation();
        setmobileView(false);
    }
    let i = 0;
  return (
    <List 
        animate={{ opacity:setmobileView?1:0 }}
        transition={{ ease: "easeOut", duration: 2 }}
    className='admin-mobile-sidenav'>
        <SLink 
        style={{borderBottom: '1px solid navajowhite'}} to={"/"} onClick={(e)=>handleHomeLink(e)} >
            <h3 style={{marginLeft:'12px'}} >Home</h3>
        </SLink> 
    {General_Categories.map((item, ind) => {
        ++i;
        return (
            <MainLinks key={ind} onClick={(e)=>handleMainLink(e,ind)}>
                    <h3 className={indecies===ind?"activate":""}>{item.name}</h3>
                    <DropdownOne className={indecies===ind ? "droplinks" : 'hide'}>
                        {General_Categories[ind].categories.map((drop_1, index) => {
                            return (
                                <DropLinks key={index}  onClick={(e)=>handleSubMenu(e,index)} >
                                    <h4 className={indecies2===index?"activate":""}>{drop_1.name}</h4> 
                                    {indecies2===index && 
                                    <DropdownTwo key={index} className={ indecies2===index?'droplinks':'hide'}>
                                        {General_Categories[ind].categories[index].sub_categories.map((drop_link, inde) => {                                           
                                            return (                                              
                                                <SLink  key={inde} to={drop_link.link} onClick={(e)=>handleSubLink(e,inde)} >
                                                    <h4 className={indecies3 === inde ?"activate":""}>{drop_link.name}</h4>
                                                </SLink>                                             
                                            );                                            
                                        })}
                                    </DropdownTwo>
                                     } 
                                </DropLinks>
                            );
                        })}
                    </DropdownOne>
            </MainLinks>
        )
    })}
    </List>
  )
}

const List = styled(motion.div)`
      height: -webkit-fill-available;
      height:100%;
      color:white;
      list-style: none;
      right:0;
      background: grey;
      padding:0.5rem;
      overflow: hidden; 
      display: block;
      position: fixed;
      top: 42px;
      width: 75%;
      z-index: 1200;
      overflow-y: auto;
      font-size: 0.9rem;
      @media (max-width:650px){
        top: 48px;
      }
`;
const MainLinks = styled.span`
        .activate{
            background:linear-gradient(to right, #f27121, #e94057);
        }
        .hide{
            display: none;;
         }
        .droplinks{
            display: block;
        }
        .droplinks_1{
            display: block;
        }
    .angle-down{
        margin-top:5px;
        color:white;
        margin-left:3px;
    }
    display:block;
    text-decoration:none;
    cursor: pointer;
    padding: 0.5rem;
    cursor:pointer;
    h3{
        width:100%;
        padding:3px;
        padding-left:8px;
        font-weight: 500;
    }
    h4{
        color:white;
        font-weight: 500;
        width:100%;
        padding:5px;
        padding-left:8px;
        font-size: 1rem;
    }
    border-bottom: 1px solid navajowhite;
`;
const DropLinks = styled.div`
        .hide{
            display: none;;
         }
        .droplinks_2{
            display: block;
        }
        color:white !important;
        display: block;
        align-items: left;
        padding: 2px;
        h4{
            font-weight: 600;
            color:white;
            font-size:1rem;
        }
        .angle-right{
            margin-top:5px;
            color:white;
            margin-left:3px;
        }
`;
const DropdownOne = styled.div`
        text-align: left;
        color:white !important;
        z-index: 900;
        list-style: none;
        position: relative;
        margin-left: 5px;
        background: grey;
        overflow: hidden; 
        display: none;
`;
const DropdownTwo = styled.div`
        text-align: left;
        color:white !important;
        z-index: 900;
        list-style: none;
        position: relative;
        margin-left: 15px;
        background: grey;
        overflow: hidden; 
        display: none;
        border-bottom: 1px solid navajowhite;
`;
const SLink = styled(NavLink)`
        color:white !important;
        display: flex;
        flex-direction: column;
        align-items: left;
        padding: 3px;
        h4{
            font-weight: 600;
        }
    
`;
export default MobileCategory
