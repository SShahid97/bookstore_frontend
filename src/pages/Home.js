import Latest from "../components/Latest";
import Popular from "../components/Popular";
import React from 'react'
import Courosal from "../components/Courosal";

function Home() {
  return (
    <div>
      <Courosal/>      
      <h2 style={{fontWeight: '500'}}>Latest Books</h2>
      <Latest category={'all_in_one'}/>
      <h2 style={{fontWeight: '500'}}>Popular Books</h2>
      <Popular/>
    </div>
  )
}

export default Home

