import React from 'react';
import styled from 'styled-components';
import {motion} from "framer-motion";

function Tooltip({tooltipMessage}) {
  return (
    <TooltipOuter
    animate={
        {opacity:[0.2,0.5,1]}
        }
    transition={{type:"tween", duration: 0.5 }}
    // transition={{type:"spring",duration: 1 }}
    className="tooltip">
        <div className='tip'>
        </div>
        <p>{tooltipMessage}</p>
    </TooltipOuter>
  )
}

const TooltipOuter = styled(motion.div)`
    position: fixed;
    display:flex;
    min-width:100px;
    width:fit-content;
    background: black;
    border-radius: 5px;
    padding:8px;
    color:white;
    z-index:1500;
    transform: translate(-60px, 43px);
    /* animation: fadeOut ease 6s;
    -webkit-animation: fadeOut ease 6s;
    -moz-animation: fadeOut ease 6s; */
    .tip{
        width: 10px;
        height: 10px;
        display: block;
        position: absolute;
        background: black;
        padding: 8px;
        top: -8px;
        right: 16px;
        transform: rotate(45deg) !important;
    }
    @keyframes fadeOut {
        0% {
            opacity:1;
        }
        50%{
            opacity:0.5;
        }
        100% {
            opacity:0.5;
        }
    }

    @-moz-keyframes fadeOut {
        0% {
            opacity:1;
        }
        50%{
            opacity:0.5;
        }
        100% {
            opacity:0.5;
        }
    }

    @-webkit-keyframes fadeOut {
        0% {
            opacity:1;
        }
        50%{
            opacity:0.5;
        }
        100% {
            opacity:0.5;
        }
    }
    @media (max-width:650px){
        width: fit-content;
    }
    p{
        font-size: 0.9rem;
        font-weight: 500;
    }
`;
export default Tooltip
