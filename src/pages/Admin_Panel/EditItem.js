import React, { useState, useEffect } from 'react';
import "./styles.css";
import {useNavigate, useParams} from 'react-router-dom';
import { Item_Service, Upload_Service } from '../../services/Service';
import styled from "styled-components";
import {FaUpload,FaArrowLeft} from "react-icons/fa";
import PopUp from '../../components/PopUp';
import PopupFailure from "../../components/PopupFailure";
import Loader from "../../components/Loader";

let Admin = {};
function EditItem() {
  const [formInput, setformInput] = useState({});
  const [discount, setDiscount] = useState(0);
  const [imageFile, setImageFile]= useState(null);
  // const [imageName, setImageName]= useState("");
  const [imagePrevFile, setImagePrevFile] = useState(null);
  const [previewImageURL, setPreviewImageURL] = useState(null);
  const [imageChoosen, setImageChoosen] = useState(false);
  const [Item, setItem] = useState({});
  const [bookImage, setBookImage] = useState([]);
  const [messageSuccess, setMessageSuccess] = useState("");
  const [messageFailure, setMessageFailure] = useState("");
  const [invalidInput, setInvalidInput] = useState(false);
  const [duplicateEntryError, setDuplicateEntryError] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [bookDummyImage, setBookDummyImage]= useState(['dummy_book_img.png']);

  const navigate = useNavigate()
  let params = useParams();
  
  useEffect(() => {
    setShowLoader(true);
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
    const response = await Item_Service.getBookDetails(id);
    if(response.status === 200){
      setShowLoader(false);
      const itemDetails = await response.json();
      setDiscount(itemDetails.discount);
      let itmImageName = [{id:itemDetails._id ,image: itemDetails.book_image, name:itemDetails.book_name}];
      setBookImage(itmImageName);
      setItem(itemDetails);
    }else if(response.status === 204){
      setShowLoader(false);
      console.log("No Content")
    }else if(response.status === 400){
      setShowLoader(false);
      console.log("Bad Request")
    }
  }
  
  const handleformInput = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setItem(values => ({ ...values, [name]: name === "price" ? Number(value) : value }))
    setformInput(values => ({ ...values, [name]: name === "price" ? Number(value) : value }))
    setDuplicateEntryError("");
  }

  const onFormSubmit = async (event) => {
    event.preventDefault();
    if((Object.keys(formInput).length === 0 )){
      alert("Please edit any field...");
      return;
    }
    console.log(formInput); 
    const response = await Item_Service.updateBookItem(Item._id, Admin.token,formInput);
    if(response.status === 200){
      const updatedItem = await response.json();
      console.log(updatedItem);
      sumbitImageUpload();
      setMessageSuccess("Item Updated Successfully");
      setTimeout(()=>{
        setMessageSuccess("");
       },5000)
    }else if(response.status === 422){  //if duplicate unique field entered
      const error = await response.json();
      setDuplicateEntryError(error.message);
      return;
  }else if(response.status === 400){
      const error = await response.json();
      console.log(error.message);
      return;
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
    formInput.book_image = file.name;
    // const ext = file.type.split("/")[1];
    // file.name = `image-${Date.now()}.${ext}`;
    // console.log(file.name, ext);
}

const sumbitImageUpload = async ()=>{
    const formData = new FormData();
    if (imageFile !== null){
      formData.append('photo', imageFile);

      const response = await Upload_Service.uploadImage(Admin.token, formData);
      if (response.status === 200){
          const data = await response.json();
          console.log(data);
          console.log("Image uploaded")
          // for storing in database 
          // formInput.book_image = imageFile.name;
        
      }else{
        setMessageFailure("Image not uploaded, try again later.");
        setTimeout(()=>{
            setMessageFailure("");
        },5000);
        return false;
      }
    }
    
  }
 //for Bookcode
  const handleKeys = (e) => {
    if (e.which === 32) {
      // console.log('Space Detected');
      setInvalidInput(true);
      return false;
    } else {
      setInvalidInput(false);
    }
}
  const handleBack = ()=>{
    navigate(-1);
  } 
  return (
    <>
    {showLoader && (<Loader/>)}
    {!showLoader && ( 
    <EditOuter>
    <span className='back-arrow-span' title="back" onClick={handleBack}>
            <FaArrowLeft className='back-arrow'/>
    </span>
    {messageFailure !== "" && (
      <PopupFailure messageFailure={messageFailure}/> 
    )}
    {messageSuccess !== "" && (
      <PopUp messageSuccess={messageSuccess}/> 
    )}
    <EditItemFormDiv>
      
      {/* <h3 className="heading">EDIT ITEM</h3> */}
      <div className='image-upload-form'>
            {/* <form onSubmit={sumbitImageUpload}> */}
                <button className='choose-image-btn' type="button" onClick={()=>document.getElementById('getFile').click()}>Change Image</button>
                <input type="file" id="getFile" accept='image/*' style={{display:'none'}} name="photo" onChange={handleImageUpload}/>
                {/* <button disabled={!imageChoosen}   className={!imageChoosen?"disable-upload-btn":"upload-btn"}  type="submit" title="Upload">
                    <FaUpload/>
                </button> */}
                <div className='image-preview'>
                        {/* <img  src={previewImageURL}  alt="Preview"/> */}
                    {!previewImageURL &&  bookImage.map((item)=>{   
                       return ( 
                        <img key={item.id} className='previewImg' src={require(`../../../public/assets/images/${item.image}`)} alt={item.name}/>
                       )
                    })}
                    {/* {(!previewImageURL && !bookImage.image) &&  bookDummyImage.map((item,index)=>{   
                       return ( 
                        <img key={index} className='previewImg' src={require(`../../../public/assets/images/${bookDummyImage}`)} alt={"Image Not Available"}/>
                       )
                    })}  */}
                        {
                          previewImageURL && ( <img className='previewImg' src={previewImageURL}  alt="Preview"/>)    
                        }  
                    
                </div>
            {/* </form> */}
      </div>
      <div className='details-form'>
            <form className="editItemform" onSubmit={onFormSubmit}>
                {duplicateEntryError !== "" && (
                    <div className='error-msg'>
                    <p>{duplicateEntryError}</p>
                    </div>
                )}
                <input
                    placeholder="Book Code"
                    type="text"
                    name="book_code"
                    value={Item.book_code || ""}
                    required
                    onKeyDown={handleKeys}
                    onChange={handleformInput}
                />
                 {invalidInput && (
                    <div className='error-msg'>
                    <p>White Spaces are not allowed</p>
                    </div>
                )}
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
                <div className='edit_btns'>
                  <input className="updateItemBtn"  type="submit" value="Update Item" /><br/>
                </div>
            </form>                
        </div>  
            
      </EditItemFormDiv>
      </EditOuter>
      )}</>
  )
}

const EditOuter = styled.div`
  height:100%;
  .back-arrow-span{
    @media (max-width:650px){
      display: none;
    }
  }
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
    .edit_btns{
      display:flex;
      justify-content: flex-start;
    }
 
    .updateItemBtn{
      background-color: blue;
      color: white;
      width: 85% !important;
      @media (max-width:650px){
        margin: auto;
      }
    }
    .updateItemBtn:hover{
      cursor: pointer;
      background-color: rgba(12, 12, 194, 0.671);
      color: white;
    }
    .disable-btn{
        opacity: 0.5;
        background-color: blue;
        cursor: none;
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
        width:75%;
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

    
  .error-msg{
        color:#ed1111f2;
        width: 85%;
        margin-bottom: 8px;
        font-size: 15px;
        padding: 5px 5px;
        border: 1px solid #ed1111f2;
        border-radius: 3px; 
        text-align: center;
    }
  .cancelBtn:hover{
    cursor: pointer;
    background-color:rgba(218, 21, 21, 0.781);
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

    .price-discount-fields{
            margin: auto;
        }
  }

  

`;
export default EditItem
