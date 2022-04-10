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
    background:linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131d9);
    padding:3rem;
    /* margin-top:1rem;  */
`;
export default footer
