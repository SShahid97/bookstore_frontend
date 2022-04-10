import React, {useState,useEffect} from 'react';
import { User_Service } from '../../services/Service';
import "./styles.css";
// import {Service} from "../../services/Service";

let Admin = {};
function AddItem() {
    const [formInput, setformInput] = useState({ });
    const [admin, setAdmin] = useState({});
    useEffect(()=>{
        let curr_user = JSON.parse(localStorage.getItem('user'));
        if(curr_user){
            if (curr_user && curr_user.role === "admin") {
                setAdmin(curr_user);
                Admin = curr_user;
          } else {
            setAdmin({});
          }
        }
    //   console.log("hooolloo")
    },[]);  

    const handleformInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setformInput(values => ({ ...values, [name]: name === "price" ? parseInt(value) : value }))
    }   

    const addBookItem = async (event) => {
        event.preventDefault(); 
        console.log(formInput)
            try{
                const data = await User_Service.addBookItem(Admin.token, formInput);
                alert("Item Added Successfully")
                console.log(data)
            }catch(err){
                console.log("There was some error: ",err)
            }
            // if(response.status === 201){
            //     const data = await response.json();
            //     console.log(data)
            // }
            // if (response.status === 400) {
            //     console.log("There was some error: ",response.statusText)
            // }
        
    }
  return (
    <div className="AddItemFormDiv">
            <form className="addItemform" onSubmit={addBookItem}>
                <input
                    placeholder="Book Code"
                    type="text"
                    name="book_code"
                    value={formInput.book_code || ""}
                    required
                    onChange={handleformInput}
                />

                <input
                    placeholder="Book Name"
                    type="text"
                    name="book_name"
                    value={formInput.book_name || ""}
                    required
                    onChange={handleformInput}
                />

                <input
                    placeholder='Author'
                    type="text"
                    name="book_author"
                    value={formInput.book_author || ""}
                    required
                    onChange={handleformInput}
                />
                 <input
                    placeholder='Book Image Name'
                    type="text"
                    name="book_image"
                    value={formInput.book_image || ""}
                    required
                    onChange={handleformInput}
                />
                <input
                    placeholder='Price'
                    type="number"
                    name="price"
                    value={formInput.price || ""}
                    required
                    onChange={handleformInput}
                />
                <input
                    placeholder='Category'
                    type="text"
                    name="category"
                    value={formInput.category || ""}
                    required
                    onChange={handleformInput}
                />
                <textarea
                    name="book_description"
                    placeholder='Description'
                    value={formInput.book_description}
                    required
                    onChange={handleformInput}
                />
                <input className="addItemBtn" type="submit" value="Add Item" /><br/>

                
            </form>
        </div>
  )
}

export default AddItem
