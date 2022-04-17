import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";

function Navigation() {
    const [addItemActive,setAddItemActive] = useState(false);
    const [viewItemActive,setViewItemActive] = useState(true);
    const navigate = useNavigate();

    function handleAddItem(){
        setAddItemActive(true);
        setViewItemActive(false);
        navigate("/admin-panel/add-item");
    }
    
    function handleViewItems(){
        setViewItemActive(true);
        setAddItemActive(false);
        navigate("/admin-panel/viewallitems");
    }
    
    
  return (
    <div>
         <button className={viewItemActive?'activeBtn':'navBtns'} onClick={handleViewItems}>VIEW ALL ITMES</button>
         <button className={addItemActive?'activeBtn':'navBtns'} onClick={handleAddItem} >ADD ITEM</button>
    </div>
  )
}

export default Navigation
