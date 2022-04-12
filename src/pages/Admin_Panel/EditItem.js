import React, { useState, useEffect } from 'react';
import "./styles.css";
import {useParams, Link} from 'react-router-dom';
import { User_Service } from '../../services/Service';

let Admin = {};
function EditItem() {
  const dicountArray = [{name:"Select discount",value:0},{name:"10%",value: 0.1},{name:"15%",value: 0.15}, {name:"20%",value:0.2}, 
  {name:"25%",value:0.25},{name:"30%",value: 0.3}, {name:"35%",value:0.35}, {name:"40%",value:0.4}, 
  {name:"45%",value:0.45},{name:"50%",value: 0.5}, {name:"55%",value:0.55}, {name:"60%",value:0.6}, 
  {name:"65%",value:0.65}, {name:"70%",value:0.7}, {name:"75%",value:0.75}, {name:"80%",value:0.8}, 
  {name:"90%",value:0.9}]
  const [formInput, setformInput] = useState({});
  const [discount, setDiscount] = useState(0);
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
    setDiscount(itemDetails.discount);
    setItem(itemDetails);
  }
  const handleformInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setItem(values => ({ ...values, [name]: name === "price" ? Number(value) : value }))
    setformInput(values => ({ ...values, [name]: name === "price" ? Number(value) : value }))
  }

  const onFormSubmit = async (event) => {
    event.preventDefault();
    
    if((Object.keys(formInput).length === 0 )){
      alert("Please edit any field...");
      return;
    }
    formInput.discount = discount;  
    try {
      const data = await User_Service.updateBookItem(Item._id, Admin.token,formInput);
      alert("Item Edited Successfully")
      console.log(data)
    } catch (err) {
      console.log("There was some error: ", err)
    }

  }
  const handleDiscount = (e)=>{
    console.log(Number(e.target.value));
    setDiscount(Number(e.target.value));
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
  
                <div className='price-discount-fields'>
                        <div className='price-div'>
                            <input style={{width: '100%'}}
                            placeholder='Price'
                            type="number"
                            name="price"
                            value={Item.price || ""}
                            required
                            onChange={handleformInput}
                            />
                        </div>
                        <div style={{width:'2%'}}></div>
                        <div className='discount-div'>
                            <select  className="form-control"
                                    placeholder='discount' 
                                    value={discount || ""} 
                                    onChange={handleDiscount}
                                    >
                                {/* <option value="select" >Select discount</option> */}
                                {dicountArray.map((dis,index)=>{
                                    return <option key={index} value={dis.value}>{dis.name}</option>
                                })}
                            </select><br/>
                        </div>
                   
                  </div>
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
