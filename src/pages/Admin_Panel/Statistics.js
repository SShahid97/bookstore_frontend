import React, {useEffect} from 'react';
import styled from "styled-components";

function Statistics() {
    useEffect(()=>{
        window.scrollTo(0,0);
    },[])
  return (
    <StatisticsOuter>
      <StatisticsInner>
            <p>Working</p>
      </StatisticsInner>
    </StatisticsOuter>
  )
}

const StatisticsOuter = styled.div`
    width:100%;
    height:100%;
    padding:10px;

`;

const StatisticsInner = styled.div`
    width:80%;
`;

export default Statistics
