import React, {useState,useEffect} from 'react';
import { User_Service } from '../../services/Service';
import "./styles.css";
// import {Service} from "../../services/Service";

let Admin = {};
function AddItem() {
    const dicountArray = [{name:"Select discount",value:0},{name:"0%",value: 0},{name:"10%",value: 0.1},
    {name:"15%",value: 0.15}, {name:"20%",value:0.2}, 
    {name:"25%",value:0.25},{name:"30%",value: 0.3}, {name:"35%",value:0.35}, {name:"40%",value:0.4}, 
    {name:"45%",value:0.45},{name:"50%",value: 0.5}, {name:"55%",value:0.55}, {name:"60%",value:0.6}, 
    {name:"65%",value:0.65}, {name:"70%",value:0.7}, {name:"75%",value:0.75}, {name:"80%",value:0.8}, 
    {name:"90%",value:0.9}]
    const [formInput, setformInput] = useState({ });
    const [discount, setDiscount] = useState(0);
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
        setformInput(values => ({ ...values, [name]: name === "price" ? Number(value) : value }))
    }   

    const addBookItem = async (event) => {
        event.preventDefault();
        // adds discount field
        formInput.discount = discount;  
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
    const handleDiscount = (e)=>{
        console.log(Number(e.target.value));
        setDiscount(Number(e.target.value));
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
               
                <div className='price-discount-fields'>
                        <div className='price-div'>
                            <input style={{width: '100%'}}
                            placeholder='Price'
                            type="number"
                            name="price"
                            value={formInput.price || ""}
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
