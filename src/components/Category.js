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
                        <DropdownOne className={isHidden ? 'hide' : 'droplinks'}>
                            {General_Categories[ind].categories.map((drop_1, index) => {
                                return (
                                    <DropLinks key={index}>
                                        <h4>{drop_1.name}</h4> <span className='angle-right'><FaAngleRight /></span>
                                        <DropdownTwo key={index} className={`droplinks_0 sub_${index} subb_${i}`}>
                                            {General_Categories[ind].categories[index].sub_categories.map((drop_link, inde) => {
                                                return (
                                                    <SLink key={inde} to={drop_link.link} onClick={handleSubLink} >
                                                        <h4>{drop_link.name}</h4>
                                                    </SLink>
                                                );
                                            })}
                                        </DropdownTwo>
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
    text-align: center;
    cursor:pointer;
    @media (max-width: 1150px) {
        width: 7rem;
        padding:5px;
    }

    @media (max-width: 1000px) {
        display:none;
    }


    h4{
        color:white;
        font-weight: 500;
        @media (max-width: 1205px) {
            font-size: 0.9rem;
        }
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
                @media (min-width:1000px) and (max-width:1030px){
                    left: 365px;
                }
                @media (min-width:1031px) and (max-width:1150px){
                    left:381px;
                }
            }
            .subb_2{ 
                left: 561px;
                @media (min-width:1000px) and (max-width:1030px){
                    left: 477px;
                }
                @media (min-width:1031px) and (max-width:1150px){
                    left:493px;   
                }
                @media (min-width:1151px) and (max-width:1206px){
                    left:549px;
                }
            }
            .subb_3{
                left: 767px;
                @media (min-width:1000px) and (max-width:1030px){
                    left: 589px;
                }
                @media (min-width:1031px) and (max-width:1150px){
                    left: 605px;
                }
                @media (min-width:1151px) and (max-width:1206px){
                    left: 739px;
                }
            }
            .subb_4{
                left: 865px;
                @media (min-width:1000px) and (max-width:1030px){
                    left: 701px;
                }
                @media (min-width:1031px) and (max-width:1150px){
                    left: 717px;
                }
                @media (min-width:1151px) and (max-width:1206px){
                    left: 830px;
                }
            }
            .subb_5{
                left: 1000px;
                @media (min-width:1000px) and (max-width:1030px){
                    left: 813px;
                }
                @media (min-width:1031px) and (max-width:1150px){
                    left: 829px;
                }
                @media (min-width:1151px) and (max-width:1206px){
                    left: 958px;
                }
            }
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

const DropdownTwo = styled.div`
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
