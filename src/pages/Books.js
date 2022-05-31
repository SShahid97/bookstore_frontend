import React, { useEffect,useState } from 'react';
import styled from 'styled-components';
// import {motion} from 'framer-motion';
import {Link, useParams, useNavigate} from 'react-router-dom';
import Loader from '../components/Loader';
import {Item_Service} from '../services/Service';
import Filters from '../components/Filters';
import {BsSliders} from "react-icons/bs";
import Rating from "../components/Rating";

function Books() {
   let params = useParams();
   const [books, setBooks]=useState([]);
   const [tempBooks, setTempBooks]= useState([]);
   const [bookDummyImage, setBookDummyImage]= useState(['dummy_book_img.png']);
   const [sortByValue, setSortByValue] = useState('');
   const [openSideNav,setOpenSideNav] = useState(false);
   const [category, setCategory] = useState("");
   const [notFound, setNotFound] = useState("");
   const [isFound, setIsFound] = useState(false);
   const [showLoader, setShowLoader] = useState(false);
    let navigate = useNavigate(); 
   //const [isSliderOpen, setIsSliderOpen] = useState(false);
   
    useEffect(()=>{
        // console.log(params.cat);
        setShowLoader(true);
        // const searchKeyword = params.cat.substring(7);
        window.scrollTo(0, 0);
        setTimeout(()=>{
            if(params.cat.substring(0, 7) === "search_"){ 
                let searchKey = params.cat.substring(7); 
                setCategory(searchKey);
                getSearched(searchKey);
            }else{
                // console.log(params.cat);
                setCategory(params.cat);
                getBooksByCategory(params.cat);
            }
        },300)
    },[params.cat]);

    const getSearched = async (searchKey)=>{
        const response = await Item_Service.getSearched(searchKey);
        console.log(response.status);
        if(response.status === 200){
            const fetchedData = await response.json();

            fetchedData.forEach((book)=>{
                if(book.discount>0){
                    book.discountPercent = book.discount*100 + "%";
                    book.newPrice = book.price - (book.price* book.discount);
               }
               if(book.discount===0){
                    book.newPrice = book.price; 
                }
            });
            setTempBooks(fetchedData);
            const data = fetchedData;
            setBooks(data);
            setIsFound(true);
            setNotFound("");
            setShowLoader(false);
        }else if(response.status === 204){
            setShowLoader(false);
            setIsFound(false);
            console.log(response);
            setNotFound("No Results Found");
            setTempBooks([]);
        }else if(response.status === 400){
            setShowLoader(false);
            setIsFound(false);
            console.log("Bad Request");
        }
    }

    const getBooksByCategory = async (category)=>{
       const response = await Item_Service.getBooksByCategory(category);
       if(response.status === 200){ 
            const fetchedBooks = await response.json();
            console.log("fetchedBooks: ",fetchedBooks);
            fetchedBooks.forEach((book)=>{
                if(book.discount>0){
                    book.discountPercent = Math.floor(book.discount*100) + "%";
                    book.newPrice = (book.price - (book.price* book.discount)).toFixed(2) ;
                }
                if(book.discount===0){
                    book.newPrice = book.price; 
                }
            });
            setTempBooks(fetchedBooks); 
            const books = fetchedBooks;
            setBooks(books);
            setIsFound(true);
            setShowLoader(false);
       }else if(response.status === 204){
            setShowLoader(false);
            console.log(response);
            setNotFound("No Results Found");
       }else if(response.status === 400){
            setShowLoader(false);
            // setIsFound(false);
            console.log("Bad Request");
       }
    }

    ///// Filtering  Starts//////// 
    const handleSortBy = (e)=>{
        let value = e.target.value;
        setSortByValue(e.target.value);
        if(value === 'default'){
            let booksOrg = [...books];
            setTempBooks(booksOrg);
            return;
        }
        if(value === 'increase'){
            const temp = tempBooks.slice(0).sort((a,b) => a.newPrice - b.newPrice);
            setTempBooks(temp);
        }
        if(value === 'decrease'){
            const temp = tempBooks.slice(0).sort((a,b) => b.newPrice - a.newPrice);
            setTempBooks(temp);
        }
        if(value === 'discount'){
            const temp = tempBooks.slice(0).sort((a,b) => b.discount - a.discount);
            setTempBooks(temp);
        }
        
    }
    const handleOpenSideNav = ()=>{
        setOpenSideNav(!openSideNav);
    }
   return (
      <> 
    {showLoader && (<Loader/>)} 
     {!showLoader && (  
      <Wrapper>
          
       {isFound && (
           <>
            <SideNav>
           <div>
               <Filters books={books} setTempBooks={setTempBooks} tempBooks={tempBooks} />
               <hr/>
               <div>
                   {/* <h4>Language</h4> */}
               </div>
           </div>
           
            </SideNav>
            <SliderrIcon onClick={handleOpenSideNav}>
                <BsSliders  />  {/*icon*/}
                <div className={openSideNav? 'dropdown-sidenav show_sidenav':'dropdown-sidenav'}>
                    <Filters books={books} setTempBooks={setTempBooks} />  
                    <hr/>
                    <div>
                        {/* <h4>Language</h4> */}
                    </div>
                </div>
            </SliderrIcon>
           </>
       )} 
        {!isFound && (
            <>
            <div></div>
            </>
        ) }
    <Main>
        {!isFound && (
            <>
            <div></div>
            <div className='no-results-found'>
                <p>{notFound}</p>
            </div>
            </>
        ) }
       
        {(isFound) && (
            <Top>
            <div className='results-found'>
                <strong> {tempBooks.length} results found </strong>
            </div>
            <div>
                <span className='category-selected'> {category}</span>
            </div>
            <div className='sortbydiv'>
               <strong>Sort by</strong>&nbsp; 
                <span>
                <select className='sort-by'
                            value={sortByValue} 
                            onChange={handleSortBy}
                            required>
                        <option value="default">Relevance</option>
                        <option value="increase">Price Low to High</option>
                        <option value="decrease">Price High to Low</option>
                        <option value="discount">Maximum Discount</option>
                       
                </select>
                </span>
                
            </div>
        </Top> 
        )}
        {isFound && (
            <Grid>
            {/* <Searched/> */}
          {tempBooks.map((book)=>{
              return (
                  <Card key = {book._id}>
                      {(book.discount>0) && (
                        <span className='discount' >{book.discountPercent}</span>
                      )}
    
                      <Link to={"/book/"+book._id}>
                          
                       <div className='book-item'>
                       {
                        book.book_image &&  <img src={require(`../../public/assets/images/${book.book_image}`)} alt={book.book_name} />
                        }
                        {
                            !book.book_image && <img src={require(`../../public/assets/images/${bookDummyImage}`)} alt={book.book_name}/>
                        }    
                           <div className='book-details'>
                                <p>{book.book_name}</p>
                                <p className="author">by {book.book_author}</p>
                                <p>
                                    {(book.discount===0)  && (
                                        <>
                                        <span>&#8377;</span><span>{book.price}</span>
                                        </>
                                    )}
                                    {(book.discount>0) && (
                                        <>
                                            <span>&#8377; {book.newPrice}</span>
                                            <span className='old-price'>&#8377;{book.price}</span>
                                        </>
                                    )}
                                </p>                               
                                {book.rating>0 && (
                                    <>
                                        <Rating rating={book.rating}/> 
                                    </>
                                )} 
                            </div>
                       </div>
                      </Link> 
                  </Card>
              );
          })}
        </Grid>
        )}
    
    </Main>
    </Wrapper>
    )}
    </>
  )
}

const Main = styled.div`
    margin-right:1.5rem;
    padding:5px;
    display:grid;
    grid-template-rows: 2rem 4fr;
    @media (max-width:650px){
        margin-top: -15px;
    }
    .no-results-found{
        width: 50%;
        margin: auto auto;
        color: red;
        font-size: 1.2rem;
        font-weight: 700;
    }
`;
const Top = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: space-between;

    .results-found{
        @media (max-width:650px){
            /* padding-top: 10px; */
        }
    }
    .category-selected{
        background: #e9e9e9;
        padding: 6px;
        font-size: 0.8rem;
        border-radius: 30px;
        color: darkblue;
    }
    .sort-by{
        padding: 3px;
        cursor: pointer;
        outline:none;
    }
    @media (max-width:600px){
        font-size: 0.8rem;
        flex-wrap: wrap;
        .sortbydiv{
            text-align: -webkit-center;
            margin-top: 15px;
        }
    }
`;
const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem,12rem));
    grid-gap:1rem;
    @media (max-width:650px){
        margin-top: 30px;
        grid-template-columns: repeat(auto-fit,minmax(19rem,1fr));
        margin-left: -25px;
    }
    .rating-div{
        display: flex;
        justify-content: space-between;
        width: 70%;
        transform: scale(1.1);
        margin-left: 5px;
        margin-top: 5px;
    }
    .rating-div span{
        color:#ffcb0e;
    }
`;

const SliderrIcon = styled.div`
     display:none;
     height:34px;
     .dropdown-sidenav{
        color:white;
        z-index: 800;
        list-style: none;
        top: 52px;
        left: 32px;
        width:70%;
        border-radius: 3px;
        background: #a9a9a9;
        padding:0.7rem;
        overflow: hidden; 
        padding: 10px;
        border: 1px solid #808080a3;
        display:none;
    }

     &:hover{
        cursor: pointer;
        background: #d4dbe1e3;
        /* .dropdown-sidenav{
             display:block;
             font-size:0.9rem;
        } */
     }
     .show_sidenav{
        display:block;
        font-size:0.9rem;
        position: absolute;
     }
     @media (max-width:850px) {
            display: inline-block;
            background: #d4dbe1;
            padding: 3px;
            font-size: 1.7rem;
            margin-top: 0px;
            border: 1px solid grey;
            border-radius: 3px;
     }

     @media (max-width:650px){
        padding: 2px;
        font-size: 1.6rem;
        margin-top: -18px;
        border-radius: 2px;
  
     }
`; 
const Wrapper = styled.div`
     display: grid;
     grid-template-columns: 1fr 4fr;
     @media (max-width:850px) {
        grid-template-columns: 2rem 4fr;
    }
`;


const SideNav =  styled.div`
    min-width:200px;
    height: inherit;
    position: relative;
    padding: 10px;
    margin-right: 1.5rem;
    border-right: 1px solid #808080a3;

    .refine-search{
        margin-top:2rem;
    }
    .price-range{
        cursor: pointer;
        width:95%;
    }
    .discount-range{
        cursor: pointer;
        width:95%
    }
    .clear-filter-btn{
        padding: 0.3rem 1.2rem;
        background: white;
        margin-bottom: 1rem;
        font-weight: 500;
        border:1px solid grey;
        font-size:1.1rem;
    }
    .clear-filter-btn:hover{
        cursor: pointer;
        background: black;
        color: white;
    }
    span{
        color:#e70000f2;
        font-weight: 500;
    }
    @media (max-width:850px) {
            display: none;
    }
`;
const Card = styled.div`
    border:1px solid #80808038 !important;
    padding: 0.8rem;
    min-height:20rem;
    border-radius:5px;
    overflow:hidden;
    position:relative;
    @media (max-width:650px){
        padding: 5px;
        min-height: 0;
    }
    .author{
        font-size: 0.9rem;
        font-weight: 600;
        margin: 5px 0px
    }
    .book-item{
        @media (max-width:650px){
            display: flex;
        }
    }
    img{
        height: 245px;;
        border-radius:5px;
        left:0;
        width:100%;
        @media (max-width:650px){
            height: 150px;
            width: 40%;
             border-radius:3px;
        }
    }
    .book-details{
        margin-left:0.3rem;
        margin-top:0.5rem;
        @media (max-width:650px){
            width: 60%;
            padding: 5px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
    }
    .discount{
        position: absolute;
        top: 0px;
        left: 0px;
        background: #e30606;
        padding: 10px 5px;
        border-radius: 50%;
        color:white;
    }
    .old-price{
        text-decoration: line-through; 
        font-size: 0.9rem;
        margin-left: 8px;
        color: #cf0000;
        font-family: sans-serif;
    }
    &:hover{
        /* border:1px solid black !important; */
        box-shadow: 1px 3px 3px 1px #00000050;
        opacity: 0.9;
    }
    
    span{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size:medium;
    }
    p{
        font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    }
`;
export default Books
