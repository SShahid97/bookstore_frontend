// import {FaPizzaSlice, FaHamburger} from 'react-icons'
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FaAngleDown, FaAngleUp, FaAngleRight } from "react-icons/fa";
import {
    Compter_Science,
    Business_Management,
    Science,
    Mathematics,
    Other
} from "../services/MainMenuCategories";


function Category() {
    const General_Categories = [Compter_Science, Business_Management, Science, Mathematics, Other];
    const [isHidden, setIsHidden] = useState(false);
    useEffect(() => {
    }, [])

    const handleSubLink = () => {
        setIsHidden(true);
    }
    const handleMainLink = () => {
        setIsHidden(false);
    }
    let i = 0;
    return (
        <List>
            {General_Categories.map((item, ind) => {
                ++i;
                return (
                    <MainLinks key={ind} onMouseEnter={handleMainLink}>
                        <h4>{item.name}</h4><span className='angle-down'><FaAngleDown /></span>
                        <Dropdown className={isHidden ? 'hide' : 'droplinks'}>
                            {General_Categories[ind].categories.map((drop_1, index) => {
                                return (
                                    <DropLinks key={index}>
                                        <h4>{drop_1.name}</h4> <span className='angle-right'><FaAngleRight /></span>
                                        <Dropdown key={index} className={`droplinks_0 sub_${index} subb_${i}`}>
                                            {General_Categories[ind].categories[index].sub_categories.map((drop_link, inde) => {
                                                return (
                                                    <SLink key={inde} to={drop_link.link} onClick={handleSubLink} >
                                                        <h4>{drop_link.name}</h4>
                                                    </SLink>
                                                );
                                            })}
                                        </Dropdown>
                                    </DropLinks>
                                );
                            })}
                        </Dropdown>
                    </MainLinks>
                )
            })}
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
        .droplinks{
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
const DropLinks = styled.div`
        border-bottom: 1px solid white;
        color:white !important;
        display: flex;
        /* flex-direction: column; */
        align-items: left;
        padding: 8px;
        h4{
            font-weight: 600;
            color:white;
            font-size:0.9rem;
        }
        &:hover{
            background:linear-gradient(to right, #f27121, #e94057);
            .droplinks_0{
                display: block;
                position: fixed;
                width: 160px;
                text-align: left;
            }
            .sub_0{ 
                top: 65px;
            }
            .sub_1{
                
                top: 95px;
            } 
            .sub_2{
                top: 153px;
            }
            .sub_3{
                top: 205px;
            } 
            .sub_4{
                top: 245px;
            }  
            .sub_5{
                top: 285px;
            }
            .subb_1{
                left:388px;
            }
            .subb_2{ 
                left: 561px;
            }
            .subb_3{
                left: 767px;
            }
            .subb_4{
                left: 865px;
            }
            .subb_5{
                left: 1000px;
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
        width:200px;
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
