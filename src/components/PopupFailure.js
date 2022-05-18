import React from 'react'
import styled from 'styled-components';
import {MdWarning} from "react-icons/md";
function PopupFailure({messageFailure}) {
  return (
    <PopupFailureOuter className="popup-failure">
       <MdWarning /> <p>{messageFailure}</p>
    </PopupFailureOuter>
  )
}

const PopupFailureOuter = styled.div`
    position: fixed;
    display:flex;
    width:25%;
    background-color: #ef4848;
    border-radius: 2px;
    padding:15px;
    color:yellow;
    z-index:1500;
    transform: translate(505px, -33px);
    animation: fadeOut ease 6s;
    -webkit-animation: fadeOut ease 6s;
    -moz-animation: fadeOut ease 6s;

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
        transform: translate(3px, -38px);
        width: 90%;
    }
    p{
        font-weight: 600;
    }
    svg{
        width:15%;
        transform: scale(2);
        color:yellow;
    }
`;
export default PopupFailure
