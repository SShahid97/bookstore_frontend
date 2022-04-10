import React, {useEffect, useState} from 'react';
import AddItem from "./AddItem";
import ViewAllItems from "./ViewAllItems";
// import EditItem from "./EditItem";

function AdminPanel() {
  const [toggleViewItems, setToggleViewItems] = useState(true);
  // const [toggleEditItem, setToggleEditItem] = useState(false);
  const [toggleAddItem, setToggleAddItem] = useState(false);
  const [noAdmin, setNoAdmin] = useState(false);
  // const navigate = useNavigate();

  useEffect(()=>{
    let isMounted = true;
    let user = JSON.parse(localStorage.getItem('user'));
    if (isMounted){
      if((!user) || (user && user.role !== "admin")){   //for user
        setNoAdmin(true);
     }
    }
    return () => { isMounted = false };
  },[])

  function handleAddItem(){
    setToggleAddItem(true);
    setToggleViewItems(false);
    // setToggleEditItem(false);
  }

  function handleViewItems(){
    setToggleViewItems(true);
    setToggleAddItem(false);
    // setToggleEditItem(false);
  }

  // function handleEditItem(){
  //   setToggleEditItem(true);
  //   setToggleAddItem(false);
  //   setToggleViewItems(false);

  // }
  
  return (
    <div>
      {noAdmin && (<div>
        <h3 className="pageNotFound">Sorry! Page Not Found</h3>
      </div>)}

      {!noAdmin && (
        <div className='navigation_btns'>
        <button className={toggleViewItems ? 'activeBtn':'navBtns'} onClick={handleViewItems}>VIEW ALL ITMES</button>
        <button className={toggleAddItem ? 'activeBtn':'navBtns'} onClick={handleAddItem}>ADD ITEM</button>
        {/* <button className={toggleEditItem ? 'activeBtn':'navBtns'} onClick={handleEditItem}>EDIT ITEM</button> */}
        </div>
      )}      
      {(toggleViewItems && !noAdmin) && (<ViewAllItems/>)}
      {(toggleAddItem && !noAdmin)  && (<AddItem/>) }
      {/* {toggleEditItem && (<EditItem/>) } */}

    </div>
  )
}

export default AdminPanel
