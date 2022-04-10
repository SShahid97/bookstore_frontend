import React, { useState, useEffect } from 'react';
import "./styles.css";
import {useParams, Link} from 'react-router-dom';
import { User_Service } from '../../services/Service';

let Admin = {};
function EditItem() {
  const [formInput, setformInput] = useState({});
  const [Item, setItem] = useState({});
  let params = useParams();
  useEffect(() => {
    getBookItem();

    let curr_user = JSON.parse(localStorage.getItem('user'));
    if (curr_user) {
      if (curr_user && curr_user.role === "admin") {
        Admin = curr_user;
      } else {
        Admin={};
      }
    }
    // console.log("hooolloo")
  }, []);

  const getBookItem = async ()=>{
    const itemDetails = await User_Service.getBookDetails(params.id);
    setItem(itemDetails);
  }
  const handleformInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setItem(values => ({ ...values, [name]: name === "price" ? parseInt(value) : value }))
    setformInput(values => ({ ...values, [name]: name === "price" ? parseInt(value) : value }))
  }

  const onFormSubmit = async (event) => {
    event.preventDefault();
    
    if((Object.keys(formInput).length === 0 )){
      alert("Please edit any field...");
      return;
    }

    try {
      const data = await User_Service.updateBookItem(Item._id, Admin.token,formInput);
      alert("Item Edited Successfully")
      console.log(data)
    } catch (err) {
      console.log("There was some error: ", err)
    }

  }
  return (
    <div className="EditItemFormDiv">
            <h3 className="heading">EDIT ITEM</h3>
            <form className="editItemform" onSubmit={onFormSubmit}>
                <input
                    placeholder="Book Code"
                    type="text"
                    name="book_code"
                    value={Item.book_code || ""}
                    required
                    onChange={handleformInput}
                />

                <input
                    placeholder="Book Name"
                    type="text"
                    name="book_name"
                    value={Item.book_name || ""}
                    required
                    onChange={handleformInput}
                />

                <input
                    placeholder='Author'
                    type="text"
                    name="book_author"
                    value={Item.book_author || ""}
                    required
                    onChange={handleformInput}
                />
                 <input
                    placeholder='Book Image Name'
                    type="text"
                    name="book_image"
                    value={Item.book_image || ""}
                    required
                    onChange={handleformInput}
                />
                <input
                    placeholder='Price'
                    type="number"
                    name="price"
                    value={Item.price || ""}
                    required
                    onChange={handleformInput }
                />
                <input
                    placeholder='Category'
                    type="text"
                    name="category"
                    value={Item.category ||  ""}
                    required
                    onChange={handleformInput}
                />
                <textarea
                    name="book_description"
                    placeholder='Description'
                    value={Item.book_description }
                    required
                    onChange={handleformInput}
                />
                <input className="updateItemBtn"  type="submit" value="Update Item" /><br/>
                
                <Link  to ={"/admin-panel"} >
                  <div className="cancelBtn">Cancel</div><br/>
                </Link>

                
            </form>
        </div>
  )
}

export default EditItem
