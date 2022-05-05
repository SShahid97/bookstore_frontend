import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {NavLink } from 'react-router-dom';
import {FaAngleDown,FaAngleUp,FaAngleRight,FaAngleLeft} from "react-icons/fa";
import {
    Compter_Science,
    Business_Management,
    Science,
    Mathematics,
    Other
} from "../services/MainMenuCategories";

function MobileCategory({setmobileView}) {
    const General_Categories = [Compter_Science, Business_Management, Science, Mathematics, Other];
    const [toggleSubMenuOne, setToggleSubMenuOne]= useState(false);
    const [indecies, setIndecies]= useState();
    const [indecies2, setIndecies2]= useState();
    const [indecies3, setIndecies3]= useState();
    const [toggleSubMenuTwo, setToggleSubMenuTwo]= useState(false);

    useEffect(()=>{

    },[indecies3])
    const handleSubLink=(e,index)=>{
        // setIsHidden(!isHidden);
        e.stopPropagation();
        setIndecies3(index)
        let ind = indecies3;
        console.log("indecies3: ", ind)
        console.log("index: ", index)
        setmobileView(false);
    }
    const handleMainLink =(e,index)=>{
        e.stopPropagation();
        // console.log(e)
        console.log("Main: ",index)
        setIndecies2("");
        // setActivateLink(false);
        setToggleSubMenuOne(!toggleSubMenuOne);
        setIndecies(index)
        
        
    }
    const handleSubMenu = (e,index)=>{
        e.stopPropagation();
        console.log("Sub:",index)
        setIndecies2(index)
        setIndecies3(null);
        let ind = indecies3;
        console.log("indecies3: ", ind)
        // setActivateLink(false);
        setToggleSubMenuTwo(!toggleSubMenuTwo);
    }
    let i = 0;
  return (
    <List className='admin-mobile-sidenav'>
    {General_Categories.map((item, ind) => {
        ++i;
        return (
            <MainLinks key={ind} onClick={(e)=>handleMainLink(e,ind)}>
                {/* <span style={{display:"inline-flex", width:'95%'}}> */}
                    <h3 className={indecies===ind?"activate":""}>{item.name}</h3>
                    {/* <span className='angle-down'>
                    {toggleSubMenuOne ? <FaAngleUp/> : <FaAngleDown/>}
                    </span> */}
                {/* </span> */}
                {/* {toggleSubMenuOne &&  */}
                    <DropdownOne className={indecies===ind ? "droplinks" : 'hide'}>
                        {General_Categories[ind].categories.map((drop_1, index) => {
                            return (
                                <DropLinks key={index}  onClick={(e)=>handleSubMenu(e,index)} >
                                    {/* <span style={{display:"inline-flex",width:'95%'}}>  */}
                                    <h4 className={indecies2===index?"activate":""}>{drop_1.name}</h4> 
                                        {/* <span className='angle-right'>
                                            {toggleSubMenuTwo ? <FaAngleUp/> : <FaAngleDown/>}
                                        </span> */}
                                    {/* </span> */}
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
                {/* }  */}
            </MainLinks>
        )
    })}
    </List>
  )
}

const List = styled.div`
      /* height: inherit; */
      height: -webkit-fill-available;
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
      overflow-y: scroll;
      
`;
const MainLinks = styled.span`
        .activate{
            /* color:orange; */
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
        font-weight: 600;
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
    /* &:active{
        background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    } */
        .hide{
            display: none;;
         }
        .droplinks_2{
            display: block;
        }
        /* border-bottom: 1px solid white; */
        color:white !important;
        display: block;
        /* flex-direction: column; */
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
        /* border-radius: 5px; */
        background: grey;
        /* padding:0.5rem; */
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
        /* border-radius: 5px; */
        background: grey;
        /* padding:0.5rem; */
        overflow: hidden; 
        display: none;
        border-bottom: 1px solid navajowhite;
`;
const SLink = styled(NavLink)`
    /* &:active{
        background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    }  */
        /* border-bottom: 1px solid white; */
        color:white !important;
        /* height: 30px; */
        display: flex;
        flex-direction: column;
        align-items: left;
        padding: 3px;
        /* border-radius: 5px ; */
        h4{
            font-weight: 600;
        }
    
`;
export default MobileCategory
