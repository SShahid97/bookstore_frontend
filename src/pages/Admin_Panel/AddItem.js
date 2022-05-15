import React, {useState,useEffect} from 'react';
import styled from "styled-components";
import { Item_Service } from '../../services/Service';
import {FaUpload} from "react-icons/fa";
import "./styles.css";
// import {Service} from "../../services/Service";

let Admin = {};
function AddItem() {
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
        const response = await Item_Service.addBookItem(Admin.token, formInput);
         if(response.status === 201){
            const data = await response.json();
            alert("Item Added Successfully");
            // after form submission reset all values
            setformInput({});
            setPreviewImageURL(null);
            setImagePrevFile(null);
            setDiscount(0);
            console.log(data);
        }else if(response.status === 422){
            const error = await response.json();
            alert(error.message);
        }else if(response.status === 400){
            const error = await response.json();
            console.log(error.message);
        }
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
                                <option value="" disabled={true} >Select discount</option>
                                {[...Array(101)].map((dis,index)=>{
                                    
                                    return <option key={index} value={index/100}>{index}%</option>
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
    text-align: left;
    padding-bottom: 2rem;
    padding-top: 2rem;
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

    @media (max-width:850px){
        flex-direction: column;
        /* width: 90%; */
        text-align: center;
        margin:0 auto;
        .image-upload-form{
            width: 95%;
            margin-bottom: 5px;
        }
        .details-form{
            width:95%;
        }
        .price-discount-fields{
            margin: auto;
        }
    }

`;

export default AddItem
