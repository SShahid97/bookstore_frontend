import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {User_Service} from "../../services/Service";
// import Loader from '../../components/Loader';
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
    const [general, setGeneral] = useState(0);
    const [category, setCategory] = useState(0);
    const [subCategory, setSubCategory] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    // let navigate = useNavigate();
    // let params = useParams();
    // const [categoryName, setCategoryName] = useState("");

    useEffect(()=>{
        // console.log(params.cat);
        // getAllBooks();
        let curr_user = JSON.parse(localStorage.getItem('user'));
          if (curr_user && curr_user.role === "admin") {
            Admin = curr_user;
          } else {
            Admin = {};
          }
        //   getBooksByCategory()
        //   console.log(General_Categories);
    },[])

    // const getBooksByCategory = async(category)=>{
    //     const response = await User_Service.getBooksByCategory(category);
    //     console.log(response);
    //     setTempBooks(response);
    // }  
    const getAllBooks = async()=>{
        const response = await User_Service.getAllBooks();
        // console.log(response.status);
        if(response.status === 200){
            const books = await response.json();
            setAllBooks(books);
        }else if(response.status === 400){
            console.log("Bad Request");
        }
    }
  
    // Deleting an Item 
    const deleteBook = async(id)=>{
        const confirmation = window.confirm("Do you really want to delete this item.");
        if(confirmation){
            // console.log("ID: ",id)
            const response = await fetch(`http://localhost:5001/api/books/${id}`, {
                method: 'DELETE',
                headers: {
                    'auth-token': Admin.token
                },
            }); 
            console.log(response);
            if(response.status === 200){
                const data = await response.json();
                alert(data.message);
                // console.log(data.message);
                // getAllBooks();
            }else if(response.status === 401){  //when token is missing
                const data = await response.json();
                alert(data.message);   
            }else {
                alert("There was some error while deleting the book");
            }
        }else{
            console.log("cancelled");
        }
    }
    const handleGeneral = (e)=>{
        setGeneral(e.target.value);
        // console.log(e.target.value);
        if(e.target.value === "1"){
            // console.log("yess")
            getAllBooks();
            setTempBooks(allBooks);
            return;
        }
        setCategory(0);
        setErrorMsg("");
        setTempBooks([]);
        
        // console.log(e.target.value);
    }
    const handleCategory = (e)=>{
        setCategory(e.target.value);
        setSubCategory(0);
        setErrorMsg("");
        setTempBooks([]);
    }
    const handleSubCategory = async(e)=>{
        const value = e.target.value;
        setSubCategory(e.target.value);
        const category = value.split("/")[2];
        // console.log(value, category);
        const response = await User_Service.getBooksByCategory(category);
        if(response.status === 200){
            const data = await response.json();
            setTempBooks(data);
            setErrorMsg("");
        }else if(response.status === 404){
            const data = await response.json();
            setErrorMsg(data.message);
        }else if(response.status === 400){
            setErrorMsg("");
            console.log("Bad Request");
        }
        // navigate(category);
        // filterBooks(category);
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
  return (
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
            {errorMsg && (
                <div ><h3 style={{color:'red'}}>{errorMsg}</h3></div>
            )}
        {(!errorMsg && tempBooks.length < 1) && (
            <div ><h3 style={{color:'red'}}>Please Select Categories!</h3></div>
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
                            <span><strong>Book Name:</strong></span><p>{book.book_name}</p>
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
                        <Link to={"edit-item/"+book._id}>
                            <div className='btns editBtn'>EDIT</div>
                        </Link>
                        
                        <div onClick={() => deleteBook(book._id)} className='btns deleteBtn'> DELETE</div>
                    </div> 
                </Card>
            )
         })
        }
        </ViewItemsInner>
    </ViewItemsDiv>
  )
}

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
