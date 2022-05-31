import React from 'react';
import styled from 'styled-components';
import {motion} from "framer-motion";

function Tooltip({tooltipMessage}) {
  return (
    <TooltipOuter
    animate={
        {opacity:[0.4,1,0]}
        }
    transition={{type:"tween", duration: 0.7 }}
    // transition={{type:"spring",duration: 1 }}
    className="tooltip">
        <div className='tip'>
        </div>
        <p>{tooltipMessage}</p>
    </TooltipOuter>
  )
}

const TooltipOuter = styled(motion.div)`
    position: absolute;
    right: 10px;
    top: 60px;
    display:flex;
    width:fit-content;
    background: black;
    border-radius: 5px;
    padding:8px;
    color:white;
    z-index:1500;
    @media(max-width:1000px){
        right: 50px;
    }

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
