import React, { useState, useEffect } from 'react';
import "./styles.css";
import {useNavigate, useParams} from 'react-router-dom';
import { User_Service } from '../../services/Service';
import styled from "styled-components";
import {FaUpload,FaArrowLeft} from "react-icons/fa";

let Admin = {};
function EditItem() {
  // console.log("id: ",id);
  const dicountArray = [{name:"Select discount",value:0},{name:"10%",value: 0.1},{name:"15%",value: 0.15}, {name:"20%",value:0.2}, 
  {name:"25%",value:0.25},{name:"30%",value: 0.3}, {name:"35%",value:0.35}, {name:"40%",value:0.4}, 
  {name:"45%",value:0.45},{name:"50%",value: 0.5}, {name:"55%",value:0.55}, {name:"60%",value:0.6}, 
  {name:"65%",value:0.65}, {name:"70%",value:0.7}, {name:"75%",value:0.75}, {name:"80%",value:0.8}, 
  {name:"90%",value:0.9}]
  const [formInput, setformInput] = useState({});
  const [discount, setDiscount] = useState(0);
  const [imageFile, setImageFile]= useState(null);
  // const [imageName, setImageName]= useState("");
  const [imagePrevFile, setImagePrevFile] = useState(null);
  const [previewImageURL, setPreviewImageURL] = useState(null);
  const [imageChoosen, setImageChoosen] = useState(false);
  const [Item, setItem] = useState({});
  const [bookImage, setBookImage] = useState([]);


  const navigate = useNavigate()
  let params = useParams();
  
  useEffect(() => {
    // console.log("id: ",id);
    getBookItem(params.id);

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

  useEffect(()=>{
      if(imagePrevFile){
        const reader = new FileReader();
        reader.onload = ()=>{
            if(reader.readyState === 2){
                setPreviewImageURL(reader.result);
            }         
        };
        reader.readAsDataURL(imagePrevFile);
        
        // // for Storing imageName in database
        // setImageName(imagePrevFile.name);    
    }else{
        setPreviewImageURL(null);
    }
  },[imagePrevFile]);

  const getBookItem = async (id)=>{
    const itemDetails = await User_Service.getBookDetails(id);
    // console.log(itemDetails);
    setDiscount(itemDetails.discount);
    let itmImageName = [{id:itemDetails._id ,image: itemDetails.book_image, name:itemDetails.book_name}];
    setBookImage(itmImageName);
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

    console.log(formInput);  
    try {
      const data = await User_Service.updateBookItem(Item._id, Admin.token,formInput);
      alert("Item Updated Successfully");
      console.log(data)
    } catch (err) {
      console.log("There was some error: ", err)
    }

  }
  const handleDiscount = (e)=>{
    // console.log(Number(e.target.value));
    formInput.discount = Number(e.target.value);
    setDiscount(Number(e.target.value));
    
  }
  const handleCancel=()=>{
    navigate(-1);
  }
  const handleImageUpload = (e)=>{
    const file = e.target.files[0];
    // console.log(file.name);
    // formInput.book_image = file.name;
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
        console.log(response);
        
        // for storing in database 
        formInput.book_image = imageFile.name;
        // console.log(formInput);
        // alert("Image Uploaded Successfully");
    }else{
        alert("Image not uploaded");
    }
  }
  const handleBack = ()=>{
    navigate(-1);
  } 
  return (
    <EditOuter>
    <span className='back-arrow-span' title="back" onClick={handleBack}>
            <FaArrowLeft className='back-arrow'/>
    </span>
    <EditItemFormDiv>
      
      {/* <h3 className="heading">EDIT ITEM</h3> */}
      <div className='image-upload-form'>
            <form onSubmit={sumbitImageUpload}>
                <button className='choose-image-btn' type="button" onClick={()=>document.getElementById('getFile').click()}>Change Image</button>
                <button disabled={!imageChoosen}   className={!imageChoosen?"disable-upload-btn":"upload-btn"}  type="submit" title="Upload">
                    <FaUpload/>
                </button>
                <input type="file" id="getFile" accept='image/*' style={{display:'none'}} name="photo" onChange={handleImageUpload}/>
                <div className='image-preview'>
                        {/* <img  src={previewImageURL}  alt="Preview"/> */}
                    {!previewImageURL &&  bookImage.map((item)=>{   
                       return ( 
                        <img key={item.id} className='previewImg' src={require(`../../../public/assets/images/${item.image}`)} alt={item.name}/>
                       )
                    })} 
                        {
                          previewImageURL && ( <img className='previewImg' src={previewImageURL}  alt="Preview"/>)    
                        }  
                    
                </div>
            </form>
      </div>
      <div className='details-form'>
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
                 {/* <input
                    placeholder='Book Image Name'
                    type="text"
                    name="book_image"
                    value={Item.book_image || ""}
                    required
                    onChange={handleformInput}
                /> */}
  
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
                    rows={5}
                    name="book_description"
                    placeholder='Description'
                    value={Item.book_description }
                    required
                    onChange={handleformInput}
                />
                <input className="updateItemBtn"  type="submit" value="Update Item" /><br/>
                
                {/* <Link  to ={"/admin-panel"} > */}
                  <button className="cancelBtn" type="button" onClick={handleCancel} >Cancel</button><br/>
                {/* </Link> */}

                
            </form>                
        </div>  
            
      </EditItemFormDiv>
      </EditOuter>
  )
}

const EditOuter = styled.div`
  height:100%;
`;

const EditItemFormDiv = styled.div`
    display: flex;
    background-color: #f7f7f7;
    height: auto;
    margin: auto;
    box-shadow: 2px 4px 4px 1px #00000036;
    margin-top: 5px;
    text-align: left;
    padding-top:1rem;
    padding-bottom: 1rem;
    
    .disable-btn{
        opacity: 0.5;
        background-color: blue;
        cursor: not-allowed;
        color:white;
    }
   
    .image-upload-form{
        width: 40%;
        text-align: -webkit-center;
    }
    .image-preview{
        height: 280px;
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
    .editItemform input, textarea{
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
        cursor: not-allowed;
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

    .updateItemBtn{
      /* width:85% !important; */
      background-color: blue;
      color:white;
      width:100% !important;
      margin-left: -220px;
    }
    .updateItemBtn:hover{
      cursor: pointer;
      background-color: rgba(12, 12, 194, 0.671);
      color: white;
    }
    .cancelBtn{
      /* width:85% !important; */
      background-color:rgb(218, 21, 21);
      color:white;
      text-align: center;
      margin: 0 auto;
      padding: 8px 5px;
      border-radius: 3px;
      border:none;
      font-size:15px;
      margin-left: -220px;
      width:100% !important;
  }

  .cancelBtn:hover{
    cursor: pointer;
    background-color:rgba(218, 21, 21, 0.781);
  }
  @media (max-width:1105px) { 
    .updateItemBtn{
      margin-left:-170px;
    }
    .cancelBtn{
      margin-left: -170px;
    }
  }
  @media (max-width:800px){
    flex-direction: column;
    text-align: center;
    margin:0 auto;
    .image-upload-form{
        width: 95%;
        margin-bottom: 5px;
    }
    .details-form{
        width:95%;
    }
    .updateItemBtn{
      margin-left:0px;
      width:85% !important;
    }
    .cancelBtn{
      margin-left: 0px;
      width:85% !important;
    }

    .price-discount-fields{
            margin: auto;
        }
  }

  

`;
export default EditItem
