import React, {useState,useEffect} from 'react';
import styled from "styled-components";
import { User_Service } from '../../services/Service';
import {FaUpload} from "react-icons/fa";
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
    // const [admin, setAdmin] = useState({});
    const [imageFile, setImageFile]= useState(null);
    const [imageName, setImageName]= useState("");
    const [imagePrevFile, setImagePrevFile] = useState(null);
    const [previewImageURL, setPreviewImageURL] = useState(null);
    const [imageChoosen, setImageChoosen] = useState(false);
    const [imageNotUploaded, setImageNotUploaded] = useState(true);
    useEffect(()=>{
        let curr_user = JSON.parse(localStorage.getItem('user'));
        if(curr_user){
            if (curr_user && curr_user.role === "admin") {
                // setAdmin(curr_user);
                Admin = curr_user;
          } else {
            // setAdmin({});
            Admin = {};
          }
        }
        if(imagePrevFile){
            const reader = new FileReader();
            reader.onload = ()=>{
                if(reader.readyState === 2){
                    setPreviewImageURL(reader.result);
                }         
            };
            reader.readAsDataURL(imagePrevFile);
            // for Storing imageName in database
            setImageName(imagePrevFile.name);    
        }else{
            setPreviewImageURL(null);
        }
         
    },[imagePrevFile]);  

    const handleformInput = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setformInput(values => ({ ...values, [name]: name === "price" ? Number(value) : value }))
    }   

    
    const addBookItem = async (event) => {
        event.preventDefault();
        // adds discount field
        formInput.discount = discount;  
        formInput.book_image = imageName;
        console.log(formInput)
            try{
                const data = await User_Service.addBookItem(Admin.token, formInput);
                alert("Item Added Successfully");
                // after form submission reset all values
                setformInput({});
                setPreviewImageURL(null);
                setImagePrevFile(null);
                setDiscount(0);
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

    const handleImageUpload = (e)=>{
        const file = e.target.files[0];
        setImageChoosen(true);
        setImageFile(file);
        setImagePrevFile(file);
        // const ext = file.type.split("/")[1];
        // file.name = `image-${Date.now()}.${ext}`;
        // console.log(file.name, ext);
    }

    const sumbitImageUpload = async (e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append('photo', imageFile);
  
        const response = await fetch("http://localhost:5001/api/upload", {
            method: 'POST',
            headers:{
                'auth-token': Admin.token  
            },
            body:formData
        });
        if (response.status === 200){
            const data = response.json();
            console.log(data);
            setImageNotUploaded(false);
            
            // alert("Image Uploaded Successfully");
        }else{
            alert("Image not uploaded");
        }
    }
    // const handleChooseImage = ()=>{
    //     const clikcc = 
    // }
    
  return (
    <AddItemFormDiv >
        <div className='image-upload-form'>
            <form onSubmit={sumbitImageUpload}>
                <button className='choose-image-btn' type="button" onClick={()=>document.getElementById('getFile').click()}>Choose Image</button>
                <button disabled={!imageChoosen}   className={!imageChoosen?"disable-upload-btn":"upload-btn"}  type="submit" title="Upload">
                    <FaUpload/>
                </button>
                <input type="file" id="getFile" accept='image/*' style={{display:'none'}} name="photo" onChange={handleImageUpload}/>
                <div className='image-preview'>
                    
                        {previewImageURL ? 
                            <img className='previewImg' src={previewImageURL}  alt="Preview"/>:
                            (<div className='image-preview-text'>
                             <p >Image Preview</p>
                             </div>)
                        }  
                    
                </div>
            </form>
        </div>
        <div className='details-form'>
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
                 {/* <input
                    placeholder='Book Image Name'
                    type="text"
                    name="book_image"
                    value={formInput.book_image || ""}
                    required
                    onChange={handleformInput}
                /> */}
               
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
                            <select style={{ padding: '7px 5px'}}
                                    className="form-control"
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
                    value={formInput.book_description || ""}
                    required
                    onChange={handleformInput}
                />
                <input className={imageNotUploaded?"disable-btn":"addItemBtn"} disabled={imageNotUploaded}  type="submit" value="Add Item" /><br/>                
            </form>
        </div>
    </AddItemFormDiv>
  )
}
const AddItemFormDiv = styled.div`
    display: flex;
    background-color: #f7f7f7;
    height: auto;
    box-shadow: 2px 4px 4px 1px #00000036;
    text-align: center;
    padding-bottom: 2rem;
    padding-top: 2rem;
    padding: auto auto;
    .disable-btn{
        opacity: 0.5;
        background-color: blue;
        cursor: auto;
        color:white;
    }
   
    .image-upload-form{
        width: 40%;
        text-align: -webkit-center;
    }
    .image-preview{
        height: 270px;
        width: 75%;
        background: #e3e1e1;
        border: 1px solid grey;
        border-radius: 3px;
        margin-top: 5px;
        display:flex;
    }
    .previewImg{
        height: 100%;
        width: 100%;
        padding: 5px;
        border-radius: 9px;
    }
    .image-preview-text{
        color: #605151;
        margin: auto auto;
        font-size: larger;
        font-weight: 700;
    }
    .details-form{
        width:60%;
    }
    .addItemform input, textarea{
        width: 85%;
        margin-bottom: 8px;
        font-size: 15px;
        padding: 8px 5px;
        border: 1px solid #9e9e9e73;
        border-radius: 3px;
        outline:none;
    }
    .choose-image-btn{
        display:inline-block;
        width:60%;
        background-color: #3caf4d;
        color:white;
        font-size: 15px;
        padding: 8px 5px;
        border: 1px solid #9e9e9e73;
        border-radius: 3px;
        outline:none;
    }

    .choose-image-btn:hover{
        cursor: pointer;
        background-color: #22a736;
        color: white;
    }
    .upload-btn{
        margin-top:5px;
        margin-left: 5px;
        display:inline-block;
        width:13%;
        background-color: blue;
        color:white;
        font-size: 15px;
        padding: 6px 3px;
        border: 1px solid #9e9e9e73;
        border-radius: 3px;
        outline:none;
    }
    .disable-upload-btn{
        opacity: 0.5;
        cursor: auto;
        margin-top:5px;
        margin-left: 5px;
        display:inline-block;
        width:13%;
        background-color: blue;
        color:white;
        font-size: 15px;
        padding: 6px 3px;
        border: 1px solid #9e9e9e73;
        border-radius: 3px;
        outline:none;
    }
    .upload-btn:hover{
        cursor: pointer;
        background-color: rgb(12 12 194 / 90%);
    }
    .price-discount-fields{
        display: flex;
        width:85%;
        margin:auto;
    }
    .price-div{
        width:100%;
    }
    .discount-div{
        width:100%;
    }

    .addItemBtn{
        width:85% !important;
        background-color: blue;
        color:white;
    }
    .addItemBtn:hover{
        cursor: pointer;
        background-color: rgb(12 12 194 / 90%);
        color: white;
    }

    @media (max-width:800px){
    flex-direction: column;
    width: 85%;
    .image-upload-form{
        width: 95%;
        margin-bottom: 5px;
    }
    .details-form{
        width:95%;
    }

  }
`;

export default AddItem
