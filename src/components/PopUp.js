import React from 'react'
import styled from 'styled-components';
import {FaCheckCircle} from "react-icons/fa";
function PopUp({messageSuccess}) {
  return (
    <PopupOuter className="pop-up">
       <FaCheckCircle /> <p>{messageSuccess}</p>
    </PopupOuter>
  )
}

const PopupOuter = styled.div`
position: fixed;
right: 0;
top: 51px;
display:flex;
width:25%;
background-color: #11b511;
border-radius: 2px;
padding:15px;
color:yellow;
z-index:1500;
/* transform: translate(505px, -33px); */
animation: fadeOut ease 6s;
-webkit-animation: fadeOut ease 6s;
-moz-animation: fadeOut ease 6s;
@media (max-width:650px){
    width: 90%;
    left: 15px;
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

p{
    font-weight: 600;
}
svg{
    width:15%;
    transform: scale(2);
    color:yellow;
}
`;
export default PopUp
