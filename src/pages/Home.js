import Latest from "../components/Latest";
import Popular from "../components/Popular";
import React, { useEffect, useState } from 'react'
import Courosal from "../components/Courosal";
import AdminPanel from "./Admin_Panel/AdminPanel";

function Home() {
    const [isAdmin, setIsAdmin] = useState(false); 
    
    useEffect(()=>{
      let user = JSON.parse(localStorage.getItem('user'));
     if(user){
      if(user.role === "admin"){
        setIsAdmin(true);
        console.log("i am admin well")
      }
     }
    },[])
  return (
    <div>
      {!isAdmin && (
        <>
          <Courosal/>      
          <h2 style={{fontWeight: '500'}}>Latest Books</h2>
          <Latest category={'all_in_one'}/>
          <h2 style={{fontWeight: '500'}}>Popular Books</h2>
          <Popular/>
        </>
      )}

      {isAdmin && (
        <AdminPanel/>
      )}
    </div>
  )
}

export default Home

