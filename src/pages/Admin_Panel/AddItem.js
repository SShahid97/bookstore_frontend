import React, {useState,useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import { Item_Service, Upload_Service } from '../../services/Service';
// import {FaUpload} from "react-icons/fa";
import PopUp from '../../components/PopUp';
import PopupFailure from "../../components/PopupFailure";
import "./styles.css";

// import {
//     Compter_Science, 
//     Business_Management,
//     Science,
//     Mathematics,
//     Literature,
//     Social_Sciences,
//     History
// } from "../../services/BookCategories";
// import {Service} from "../../services/Service";

let Admin = {};
function AddItem() {
    // let generalCategory = [Compter_Science,Business_Management,Science,Mathematics];
    const categories = ['web development javascript','web development html','web development css','web development react',
        'web development angular','web development backend','programming c','programming c++','programming java',
        'programming csharp','programming php','programming python','networking computer networks',
        'communication wireless mobile','database rdbms','database mysql','database mining','os unix','os microsoft windows',
        'os macintosh','web development','marketing','sales customer services','finance','accounting','business management',
        'applied physics','physics','optical physics','classical mechanics','zoology','general biology','human biology',
        'organic chemistry','inorganic chemistry','physical chemistry','algebra','mathematics','discrete mathematics','number theory',
        'mathematics calculus','applied mathematics','literature','social science','history','religion','miscellaneous'];
    const [formInput, setformInput] = useState({ });
    const [discount, setDiscount] = useState(0);
    // const [general, setGeneral] = useState("");
    // const [category, setCategory] = useState("");
    // const [subCategory, setSubCategory] = useState("");
    // const [categoryIndex, setCategoryIndex] = useState(null);
    // const [subCategoryIndex, setSubCategoryIndex] = useState(null);
    // const [admin, setAdmin] = useState({});
    const [imageFile, setImageFile]= useState(null);
    const [imageName, setImageName]= useState("");
    const [imagePrevFile, setImagePrevFile] = useState(null);
    const [previewImageURL, setPreviewImageURL] = useState(null);
    const [imageChoosen, setImageChoosen] = useState(false);
    const [imageNotUploaded, setImageNotUploaded] = useState(true);
    const [messageSuccess, setMessageSuccess] = useState("");
    const [messageFailure, setMessageFailure] = useState("");
    const [invalidInput, setInvalidInput] = useState(false);
    const [duplicateEntryError, setDuplicateEntryError] = useState("");
    let navigate = useNavigate();
    useEffect(()=>{
        let curr_user = JSON.parse(localStorage.getItem('user'));
        localStorage.removeItem("OrderId")
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
        setDuplicateEntryError("");
        const name = event.target.name;
        const value = event.target.value;
        setformInput(values => ({ ...values, [name]: name === "price" ? Number(value) : value }))
    }   

    // const handleGeneral = (e)=>{
    //     let value= e.target.value;
    //     let generalIndex = value.split("/")[1];
    //     value = value.split("/")[0];
    //     setGeneral(e.target.value);
    //     console.log(value);
    //     console.log(generalIndex);
    //     setCategoryIndex(generalIndex);
    // }
    // const handleCategory = (e)=>{
    //     let value= e.target.value;
    //     let categoryIndex = value.split("/")[1];
    //     value = value.split("/")[0];
    //     setCategory(e.target.value);
    //     console.log(value);
    //     console.log(categoryIndex);
    //     setSubCategoryIndex(categoryIndex);
    // }
    // const handleSubCategory = (e)=>{
    //     setSubCategory(e.target.value);
    // }
    const addBookItem = async (event) => {
        event.preventDefault();
        // adds discount field
        formInput.discount = discount;  
        formInput.book_image = imageName;
        console.log(formInput)
        const response = await Item_Service.addBookItem(Admin.token, formInput);
         if(response.status === 201){
            const data = await response.json();
            sumbitImageUpload();
            setMessageSuccess("Item Added Successfully");
            setTimeout(()=>{
                setMessageSuccess("");
            },5000)
            // after form submission reset all values
            setformInput({});
            setPreviewImageURL(null);
            setImagePrevFile(null);
            setDiscount(0);
            console.log(data);
            setDuplicateEntryError("");
            navigate("add-stock/"+data.book_code);
        }else if(response.status === 422){  //if duplicate unique field entered
            const error = await response.json();
            setDuplicateEntryError(error.message);
            // alert(error.message);
            return;
        }else if(response.status === 400){
            const error = await response.json();
            console.log(error.message);
            return;
        }
        
    }
    const handleDiscount = (e)=>{
        console.log(Number(e.target.value));
        setDiscount(Number(e.target.value));
    }

    const handleImageUpload = (e)=>{
        const file = e.target.files[0];
        // console.log(file);
        if(!file.type.includes("image") ){
          setMessageFailure("Only Images are allowed!");
            setTimeout(()=>{
                setMessageFailure("");
            },5000);
          return;
        }
        setImageFile(file);
        setImagePrevFile(file);
        setImageChoosen(true);
        console.log(file);
    }

    const sumbitImageUpload = async ()=>{
        // e.preventDefault();
        const formData = new FormData();
        formData.append('photo', imageFile);
        const response = await Upload_Service.uploadImage(Admin.token,formData);
        if (response.status === 200){
            const data = await response.json();
            console.log(data);
            console.log("Image Uploaded");
            setImageNotUploaded(false);
            // alert("Image Uploaded Successfully");
        }else{
            setImageNotUploaded(true);
            setMessageFailure("Image not uploaded, try again later.");
            setTimeout(()=>{
                setMessageFailure("");
            },5000);
            return false;
        }
    }
    const handleKeys = (e) => {
        if (e.which === 32) {
          // console.log('Space Detected');
          setInvalidInput(true);
          return false;
        } else {
          setInvalidInput(false);
        }
    }
  return (
    <AddItemFormDiv >
        {messageFailure !== "" && (
            <PopupFailure messageFailure={messageFailure}/> 
         )}
        {messageSuccess !== "" && (
            <PopUp messageSuccess={messageSuccess}/> 
        )}
        <div className='image-upload-form'>
            {/* <form onSubmit={sumbitImageUpload}> */}
                <button className='choose-image-btn' type="button" onClick={()=>document.getElementById('getFile').click()}>Choose Image</button>
                <input type="file" id="getFile" accept='image/*' style={{display:'none'}} name="photo" onChange={handleImageUpload}/>
                {/* <button disabled={!imageChoosen}   className={!imageChoosen?"disable-upload-btn":"upload-btn"}  type="submit" title="Upload">
                    <FaUpload/>
                </button> */}
                <div className='image-preview'>
                        {previewImageURL ? 
                            <img className='previewImg' src={previewImageURL}  alt="Preview"/>:
                            (<div className='image-preview-text'>
                             <p >Image Preview</p>
                             </div>)
                        }  
                </div>
            {/* </form> */}
        </div>
        <div className='details-form'>
            <form className="addItemform" onSubmit={addBookItem}>
                {duplicateEntryError !== "" && (
                    <div className='error-msg'>
                    <p>{duplicateEntryError}</p>
                    </div>
                )}
                <input
                    placeholder="Book Code"
                    type="text"
                    name="book_code"
                    value={formInput.book_code || ""}
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
                                    
                                    return <option key={index} value={ index/100}>{index}%</option>
                                })}
                            </select><br/>
                        </div>
                   
                    </div>
                 {/* <div  style={{width:'50%'}}>
                    <div className='discount-div'>
                        <select style={{ padding: '7px 5px'}}
                            className="form-control"
                            name="general"
                            value={general || ""} 
                            onChange={handleGeneral}
                        >
                        {generalCategory.map((general,index)=>{          
                            return <option key={index} disabled={index===0}  value={general.name+"/"+index}>{general.name}</option>
                        })}
                      </select><br/>
                    </div>
                    </div> */} 
                 <div  style={{width:'85%'}}>
                    <div className='discount-div'>
                        <select style={{ padding: '7px 5px'}}
                            className="form-control"
                            name="category"
                            value={formInput.category || ""} 
                            onChange={handleformInput}
                        >
                        <option value="" disabled={true} >Select Category</option>
                        { categories.map((category,index)=>{          
                            return <option key={index}   value={category}>{category}</option>
                        }) }
                      </select><br/>
                    </div>
                 </div>               
                {/* <input
                    placeholder='Category'
                    type="text"
                    name="category"
                    value={formInput.category || ""}
                    required
                    onChange={handleformInput}
                /> */}
                <textarea
                    name="book_description"
                    placeholder='Description'
                    value={formInput.book_description || ""}
                    required
                    onChange={handleformInput}
                />
                <input className={(!imageChoosen || invalidInput )?"disable-btn":"addItemBtn"} disabled={!imageChoosen || invalidInput}  type="submit" value="Add Item" /><br/>                
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
