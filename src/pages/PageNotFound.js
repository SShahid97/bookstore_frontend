import React from 'react';
import styled from "styled-components";

function PageNotFound() {
  return (

    <NotFoundOuter >
      {/* <h2 style={{margin:'auto auto'}}>Sorry!! Page Not Found</h2> */}
      <img className='styling_img' src={require("./PageNotFound_Image.png")} alt="Page Not Found"/>
    </NotFoundOuter>
  )
}


const NotFoundOuter = styled.div`
    text-align: center;
    background: #f7f7f7;
    margin-top: -10px;
    margin-left: -10px;
    @media (max-width:650px){
      margin-top: -20px;
    }
    .styling_img{
      height:80vh;
      object-fit: contain;
      @media (max-width:650px){
        width:95%;
        object-fit: contain;
      }
    }
`;
export default PageNotFound
