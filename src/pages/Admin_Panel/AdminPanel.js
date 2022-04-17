import React, {useEffect, useState} from 'react';
import AddItem from "./AddItem";
import ViewAllItems from "./ViewAllItems";
import Navigation from "./Navigation";
// import Dashboard from './Dashboard';
import {useParams} from "react-router-dom";
import EditItem from './EditItem';

// import EditItem from "./EditItem";

function AdminPanel() {
  let params = useParams();
  // const [toggleViewItems, setToggleViewItems] = useState(true);
  // const [toggleEditItem, setToggleEditItem] = useState(false);
  // const [toggleAddItem, setToggleAddItem] = useState(false);
  const [noAdmin, setNoAdmin] = useState(false);

  const [showAddItem, setShowAddItem] =  useState(false);
  const [showViewAllItems, setShowViewAllItems] = useState(false);
  const [showEditItem, setShowEditItem] = useState(false);
  const [id, setId] = useState("");
  // const navigate = useNavigate();
  // let id="";
  useEffect(()=>{
    // console.log(params.name);
    if(params.name==="add-item"){
      // console.log("add")
      setShowAddItem(true);
      setShowViewAllItems(false);
      setShowEditItem(false);
    }
    else if(params.name === "viewallitems"){
      console.log("view")
      setShowViewAllItems(true);
      setShowAddItem(false);
      setShowEditItem(false);
    }else{
       setId(params.name);
       setShowEditItem(true);
       setShowAddItem(false);
       setShowViewAllItems(false); 
    }
    let isMounted = true;
    let user = JSON.parse(localStorage.getItem('user'));
    if (isMounted){
      if((!user) || (user && user.role !== "admin")){   //for user
        setNoAdmin(true);
     }
    }
    return () => { isMounted = false };
  },[params])

  
  
  return (
    <div style={{minHeight:'80vh'}}>
      {noAdmin && (
        <div>
          <h3 className="pageNotFound">Sorry! Page Not Found</h3>
        </div>
      )}

      {!noAdmin && (
      <>
        <div className='navigation_btns'>
          <Navigation/>
        </div>
       {showAddItem && (<AddItem/>)} 
       {showViewAllItems && (<ViewAllItems/>)}
       {showEditItem && (<EditItem id={id}/>)} 
      </>   
      )}      
      
    </div>
  )
}

export default AdminPanel
