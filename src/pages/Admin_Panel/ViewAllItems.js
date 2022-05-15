import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Item_Service} from "../../services/Service";
import Loader from '../../components/Loader';
import {FaSearch,FaTimes} from "react-icons/fa";
import {
    Compter_Science, 
    Business_Management,
    Science,
    Literature,
    Mathematics,
    Social_Sciences,
    History
} from "../../services/BookCategories";

let Admin = {};
// let name = "";
function ViewAllItems() {
    // const General_Categories = ["Computer Science", "Mathematics","Business Management","English","Science"];
    
    // const categoryNameMapping = {link:'js_book', name:'JavaScript Books'}
    const General_Categories = [{name:"Select"},{name:"All Books"},Compter_Science, Business_Management,Science, Mathematics,Social_Sciences,Literature,History];
    // const Second_GCategories = [];   
    const [allBooks, setAllBooks] = useState([]);
    const [tempBooks, setTempBooks] = useState([]);
    const [books, setBooks] = useState([]);
    const [general, setGeneral] = useState(0);
    const [category, setCategory] = useState(0);
    const [subCategory, setSubCategory] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const [searchedValue, setSearchedValue] = useState("");
    const [showClose, setShowClose] = useState(false);
    const [noResultsFound,setNoResultsFound] = useState(false);
    const [bookFound,setBookFound] = useState(false);

    // let navigate = useNavigate();
    // let params = useParams();
    // const [categoryName, setCategoryName] = useState("");

    useEffect(()=>{
          let curr_user = JSON.parse(localStorage.getItem('user'));
          if (curr_user && curr_user.role === "admin") {
            Admin = curr_user;
            // getAllBooks();
          } else {
            Admin = {};
          }
          console.log("holo")
          let general_cat = JSON.parse(localStorage.getItem('general'));
          if(general_cat){
              setGeneral(general_cat);
              if(general_cat === "1"){
                  localStorage.removeItem("sub_category")
                  setShowLoader(true);
                  getAllBooks();
              } 
          }
          let category = JSON.parse(localStorage.getItem('category'));
          if(category){
              setCategory(category);
          }
          let sub_category = JSON.parse(localStorage.getItem('sub_category'));
          if(sub_category){
              setSubCategory(sub_category);
              getBooks(sub_category);
          }

    },[])

    // const getBooksByCategory = async(category)=>{
    //     const response = await Item_Service.getBooksByCategory(category);
    //     console.log(response);
    //     setTempBooks(response);
    // }  
    const getAllBooks = async()=>{
        const response = await Item_Service.getAllBooks();
        // console.log(response.status);
        if(response.status === 200){
            setShowLoader(false);
            const books = await response.json();
            setAllBooks(books);
            setTempBooks(books);
            setBooks(books);
        }else if(response.status === 400){
            setShowLoader(false);
            console.log("Bad Request");
        }
    }
  
    // Deleting an Item 
    const deleteBook = async(id)=>{
        const confirmation = window.confirm("Do you really want to delete this item?");
        if(confirmation){
            const response = await Item_Service.deleteBookItem(Admin.token,id);
            console.log(response);
            if(response.status === 200){
                const data = await response.json();
                alert(data.message);
                getAllBooks();
            }else if(response.status === 204){  
                console.log("No content");   
            }else {
                alert("There was some error while deleting the book");
            }
        }else{
            console.log("cancelled");
        }
    }
    const handleGeneral = (e)=>{
        const value =e.target.value;
        setGeneral(value);
        if(value === "0"){
            localStorage.removeItem("general");
            localStorage.removeItem("category");
            localStorage.removeItem("sub_category");
            setCategory(0);
            setErrorMsg("");
            setTempBooks([]);
        }else{       
            localStorage.setItem("general",JSON.stringify(value));
            if(value === "1"){
                setShowLoader(true);
                getAllBooks();
                setSearchedValue("");
                return;
            }
            setCategory(0);
        }
        setSearchedValue("");
        // setBookFound(false);
        
    }
    const handleCategory = (e)=>{
        const value = e.target.value;
        setBookFound(false);
        setSearchedValue("");
        localStorage.setItem("category",JSON.stringify(value));
        setCategory(value);
        setSubCategory(0);
        setErrorMsg("");
        setTempBooks([]);
    }
    const handleSubCategory = async(e)=>{
        const value = e.target.value;
        setSearchedValue("");
        setBookFound(false);
        localStorage.setItem("sub_category",JSON.stringify(value));
        setShowLoader(true);
        
        setSubCategory(value);
        await getBooks(value);
        // navigate(category);
        // filterBooks(category);
    }
    const getBooks=async(value)=>{
        const category = value.split("/")[2];
        const response = await Item_Service.getBooksByCategory(category);
        if(response.status === 200){
            setShowLoader(false);
            const data = await response.json();
            setTempBooks(data);
            setBooks(data);
            setErrorMsg("");
        }else if(response.status === 204){
            setShowLoader(false);
            setErrorMsg("No Results found for the given category.");
        }else if(response.status === 400){
            setShowLoader(false);
            setErrorMsg("");
            console.log("Bad Request");
        }
    }
    // const filterBooks = (link)=>{
    //     let booksReturned=allBooks.filter((book)=>{
    //         return book.category === link;
    //     });
    //     // console.log(booksReturned);
    //     setTempBooks(booksReturned);
    // }
    // const handleNaming = (name)=>{
    //     categoryNameMapping.name;
    // }
    const handleSearch = (evt) => {
        const searchkey = evt.target.value;
        setSearchedValue(searchkey);
        setShowClose(true);
        console.log(searchkey);
        let general_cat = JSON.parse(localStorage.getItem('general'));
        if(!general_cat){
            setShowLoader(false);
            return;
        }
        setShowLoader(true);
        if (searchkey === "") {
            setShowClose(false);
            setShowLoader(false);
            let booksReturned=books.filter((book)=>{
                return true;
            });
            setTempBooks(booksReturned);
            // let originalBooks = [books];
            // setTempBooks(originalBooks);
         }else{
            searchkey.toLowerCase();
            let booksReturned=books.filter((book)=>{
                return (book.book_name.toLowerCase().includes(searchkey)
                     || book.book_author.toLowerCase().includes(searchkey)
                     || book.book_description.toLowerCase().includes(searchkey));
            });
            if(booksReturned.length>0){
                setBookFound(true);
                setShowLoader(false);
                setNoResultsFound(false);
                setTempBooks(booksReturned);
            }else{
                setBookFound(false);
                setNoResultsFound(true);
                setShowLoader(false);
                setTempBooks([]);
            }
         }
        
      }
      const handleCloseIcon = () => {
        let originalBooks = [books];
        console.log(originalBooks);
        // setTempBooks(originalBooks);
        setSearchedValue("");
        setBookFound(false);
        setShowClose(false);
      }
    // const handleSubmitSearch = (e)=>{
    //     e.preventDefault(); 
        
    // }
  return (
    <ViewItemsOuter>
      <FormStyle >
        <div className='form-div'>
        <FaSearch></FaSearch>
        <input placeholder='Search book'
            className='search-bar'
            onChange={handleSearch}
            type="text" 
            value={searchedValue}
            />
        {showClose && (
            <span className='close-icon'>
            <FaTimes onClick={handleCloseIcon} title="clear" />
            </span>
        )}
        
        </div>
      </FormStyle>  
    <ViewItemsDiv>
        <div className='header-filter'>
            <div className='total-items'>
                <span ><b>Total Items: </b></span><span style={{fontWeight: '600'}}>{tempBooks.length}</span>
            </div>
            <div className='filters'>
                <strong>General:</strong>&nbsp; 
                <span style={{marginRight:'5px'}}>
                    <select className='selections'
                        value={general} 
                        onChange={handleGeneral}
                        required>        
                        {
                            General_Categories.map((genCat, index)=>{
                              return  <option key={index} value={index}>{genCat.name}</option>
                            })
                        }   
                    </select>
                </span>
                { General_Categories[general].categories  && (
                    <>
                    <strong>Category:</strong>&nbsp; 
                    <span style={{marginRight:'5px'}}>
                    <select className='selections'
                        value={category} 
                        onChange={handleCategory}
                        required>
                        { 
                            General_Categories[general].categories.map((cat, index)=>{
                              return  <option key={index} value={index}>{cat.name}</option>
                            }) 
                        }   
                    </select>
                    </span>
                     {General_Categories[general].categories[category].sub_categories && (
                         <>
                         <strong>Sub Category:</strong>&nbsp; 
                    <span>
                    <select className='selections sub'
                        value={subCategory} 
                        onChange={handleSubCategory}
                        required>
                        {
                            General_Categories[general].categories[category].sub_categories.map((cat, index)=>{
                              return  <option key={index} value={cat.link}>{cat.name}</option>
                            }) 
                        }   
                    </select>
                    </span>
                         </>
                     )}   
                    
                    </>

                )}

                {General_Categories[general].sub_categories && 
                  <>
                    <strong>Category:</strong>&nbsp; 
                    <span>
                    <select className='selections'
                        value={subCategory} 
                        onChange={handleSubCategory}
                        required>
                        {
                            General_Categories[general].sub_categories.map((cat, index)=>{
                                
                              return  <option key={index} value={cat.link}>{cat.name}</option>
                            }) 
                        }   
                    </select>
                    </span>
                  </>
                }
                
               
            </div>   
        </div>
        <hr style={{marginBottom:'1rem'}}/>
        {/* <div className="BookHeading">        
        </div> */}
        
        <ViewItemsInner>
        {showLoader && (<Loader/>)}
        {!showLoader && (
            <>
            {errorMsg && (
                <div ><h3 style={{color:'red'}}>{errorMsg}</h3></div>
            )}
            {(!errorMsg && tempBooks.length < 1 && !noResultsFound) && (
                <div ><h3 style={{color:'red'}}>Please Select Categories!</h3></div>
            )}
            {noResultsFound && (
                 <div ><h3 style={{color:'red'}}>No Results Found</h3></div>
            )} 
                
            {tempBooks.length > 0 && tempBooks.map((book)=>{
               return (
                <Card key={book._id}>
                    <div className='imgDiv'> 
                        <img src={require(`../../../public/assets/images/${book.book_image}`)} alt={book.book_name} />
                    </div>

                    {/* <div className="outer"> */}
                    <div className='bookDetials'>
                        <div className='col_1'> 
                        {/* className={bookFound?"highlight":""} */}
                            <span><strong>Book Name:</strong></span><p >{book.book_name}</p>
                            <span><strong>Book Code:</strong></span><p>{book.book_code}</p>
                            <span><strong>Book Author:</strong></span><p>{book.book_author}</p>
                            <span><strong>Category:</strong></span><p>{book.category}</p>
                        </div>
                        <div className='col_2'>
                            <span><strong>Discount:</strong></span><p>{book.discount*100}%</p>
                            <span><strong>Price:</strong></span><span></span><p>&#8377;{book.price}</p>
                            <span><strong>Description:</strong></span>
                            <section style={{textAlign:'justify'}}>{book.book_description}</section>
                        </div>
                    </div>
                    {/* </div> */}

                    <div className='editDeleteBtn'>
                        <Link to={"view-edit-stock/"+book.book_code}>
                            <div className='btns editBtn'>UPDATE STOCK</div>
                        </Link>
                        <Link to={"edit-item/"+book._id}>
                            <div className='btns editBtn'>EDIT</div>
                        </Link>
                        
                        <div onClick={() => deleteBook(book._id)} className='btns deleteBtn'> DELETE</div>
                    </div> 
                </Card>
            )
         })
        }
        </>)}
        </ViewItemsInner>
    </ViewItemsDiv>
    </ViewItemsOuter>
  )
}
const ViewItemsOuter = styled.div`

`;
const FormStyle = styled.div`
    width: 50%;
    margin: 0 auto;
    margin-bottom: 10px;
    .close-icon{
      position: relative;
      margin-left: -22px;
      margin-top: 10px;
      cursor: pointer;
      color:grey;
      @media (max-width:650px){
        margin-top: 7px;
      }
    } 
    .close-icon svg:hover{
      color:black !important;
    } 
    
    .error-msg{
      color:#b91111c4;
      width: 65%;
      margin-top:5px;
      font-size: 15px;
      padding: 5px 10px;
      border: 1px solid #b91111c4;
      border-radius: 3px;
    }

    .form-div{
        width: 70%;
        display:inline-flex; 
        margin:0 auto;
        @media (max-width: 1000px){
            text-align:center;
        }
        @media (max-width: 850px){
            width:70%; 
        }
        @media (max-width: 650px){
            width:95%; 
            margin:0 auto;
        }
    }
    .form-div>svg{
        position:absolute;
        color:grey;
        margin-top: 10px;
        margin-left: 10px;
        @media (max-width:650px){
          margin-top:8px;
        }        
    }

    input{
        border:none;
        background: linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131);
        font-size:1.2rem;
        background:white;
        color:grey;
        padding:0.5rem 2rem;
        border:1px solid grey;
        outline:none;
        width:100%;
        border-radius: 3px;
        box-shadow: 3px 4px 3px grey;
        @media (max-width: 850px){
            font-size:1rem;
            width:80%;
        }
        @media (max-width: 650px){
            font-size:0.9rem;
            padding: 0.3rem 2rem;
            width: 70%;
            /* margin:0 auto; */
        }   
    }
    button{
      padding: 5px;
      color: white;
      background-color: blue;
      width: 50px;
      border-radius: 3px;
      border: none;
      cursor: pointer;
      margin-left: 10px;
      box-shadow: 3px 4px 3px grey;
    }
    button>svg{
      transform: scale(1.3);
    }
    button:hover {
      background-color: #0404e5db;
    }
    
    @media (max-width: 1000px){
        width:inherit;
    }
    @media (max-width: 550px){
        font-size:smaller;
        width:inherit;
    }
`;
const ViewItemsDiv = styled.div`
    background-color: #f7f7f7;
    margin: auto;
    height:auto;
    box-shadow: 2px 4px 4px 1px #00000036;
    /* margin-top: 5px; */
    text-align: center;
    padding:10px;
    
    .header-filter{
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        @media (max-width:850px){
            flex-direction: column;
        }
    }
    .total-items{
        font-size: 1.2rem;
        @media (max-width:650px){
            font-size: 1rem;
        }
    }
    .filters{
        @media (max-width:850px){
            text-align: left;
        }
    }
    
    .selections{
        padding: 3px;
        cursor: pointer;
        outline:none;
        max-width: 170px;
        @media (max-width:850px){
            width: 70%;
            margin-top: 5px;
        }
    }
    .sub{
        @media (max-width:850px){
            width: 58%;
            margin-top: 5px;
            margin-left: 1px;
        }
    }
    .BookHeading{
        text-align: center;
        padding:5px;
        color:white;
        border-radius: 40px;
        background: skyblue;
    }
    @media screen and (max-width: 600px) and (min-width: 300px) {
        width: 100%; 
    }
    @media screen and (max-width: 950px) and (min-width: 601px) {
        width: 98%; 
    }
`;

const ViewItemsInner = styled.div`
    height:75vh;
    overflow:auto;
`;
const Card = styled.div`
    display: grid;
    grid-gap:1rem;
    grid-template-columns: 1fr 2fr 12rem;
    /* grid-template-columns: repeat(auto-fit, minmax(200px,2fr)); */
    /* flex-wrap: wrap; */
    margin-bottom:1rem;
    padding: 0.5rem;
    background: white;
    border-radius:5px;
    overflow:hidden;
    position:relative;
    box-shadow: 4px 5px 5px 1px #00000050;
    width: 95%;
    margin: auto;
    margin-bottom: 5px;
    .imgDiv{
        width: 100%;
        height: 200px;
        img{
            height: 100%;
            border-radius:5px;
            left:0;
            width: 13rem;
        }
    }
    /* .outer{
        display: flex;
    } */
    .highlight{
        background-color: yellow;
    }
    .bookDetials{
        display: flex;
        flex-direction: row;
        text-align: left;
        /* padding-left: 3%; */
        width:100%;
    }
    .bookDetials p{
        font-family: sans-serif;
    }
    .col_1{
        width:40%;
    }
    .col_2{
        width:60%;
    }
    .editDeleteBtn{
        margin:auto auto;
        @media (max-width:650px){
            display: flex;
            font-size: small;
            justify-content: space-between;
            margin:0;
        }
    }
    .deleteBtn:hover{
        cursor: pointer;
    }
    span{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size:medium;
    }
    p{
        font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        margin-bottom: 0.5rem;
    }

    @media (max-width:850px){
        grid-template-columns: 2fr 2fr;
    }
    @media (max-width:650px){
        grid-template-columns: 1fr;
        
    }

`;



export default ViewAllItems
