import Latest from "../components/Latest";
import Popular from "../components/Popular";
import UserDetails from "../components/UserDetails";
import React, { useEffect, useState } from 'react'
import Courosal from "../components/Courosal";
import AdminPanel from "./Admin_Panel/AdminPanel";
// import styled from "styled-components";
import {logOutService,mobileMenuService} from "../services/LocalService";

function Home() {
    const [isAdmin, setIsAdmin] = useState(false); 
    const [user, setUser] = useState(null); 
    let curr_user = JSON.parse(localStorage.getItem('user'));
    useEffect(()=>{
      mobileMenuService.setMobileMenuIndicies(null);
      if(curr_user){
        if(curr_user.role === "admin"){
          setIsAdmin(true);
        }else{
          setIsAdmin(false);
          setUser(curr_user);
        }
     }else{
       setUser(null);
      //  console.log("log out")
     }
    },[]);
    
    logOutService.onUpdateLogOut().subscribe(user => {
      setUser(user);
    });

    return (
    <div className={user?"userOnHome":"userNotOnHome"}>
      {!isAdmin && (
         <>
          {user && (<UserDetails user={user}/>) }
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

// const HomeOuter =  styled.div`


// `;  
export default Home

