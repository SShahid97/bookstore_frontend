import React from 'react'
import styled from "styled-components";

function Loader() {
  return (
    <Spinner/>
  )
}


const Spinner = styled.div`
  margin:0 auto ;
  margin-top:5rem;
  border: 8px solid #f3f3f3;
  border-radius: 50%;
  border-top: 8px solid grey;
  width: 60px;
  height: 60px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;

  /* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;
export default Loader
