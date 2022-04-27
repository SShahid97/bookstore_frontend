import React from 'react'
import styled from 'styled-components';
function footer() {
  return (
    <Footer>
      <h4> &copy;All Rights Reserved: 2022 </h4>
    </Footer>
  )
}


const Footer = styled.footer`
    bottom:0;
    /* width: 80%; */
    /* position: absolute; */
    background-color: grey;
    border-top: 1px solid white;
    padding:3rem;
    /* margin-top:1rem;  */
`;
export default footer
