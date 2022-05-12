import React, { useEffect,useState } from 'react';
import styled from 'styled-components';
// import {motion} from 'framer-motion';
import {Link, useParams, useNavigate} from 'react-router-dom';
import Loader from '../components/Loader';
import {User_Service} from '../services/Service';
import Filters from '../components/Filters';
import {BsSliders} from "react-icons/bs";

function Books() {
   let params = useParams();
   const [books, setBooks]=useState([]);
   const [tempBooks, setTempBooks]= useState([]);
   const [sortByValue, setSortByValue] = useState('');
   const [openSideNav,setOpenSideNav] = useState(false);
//    const [searchKeyword, setSearchKeyword] = useState("");
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
                getSearched(searchKey);
            }else{
                getBooksByCategory(params.cat);
            }
        },300)
    },[params.cat]);

    const getSearched = async (searchKey)=>{
        const response = await User_Service.getSearched(searchKey);
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
       const response = await User_Service.getBooksByCategory(category);
       if(response.status === 200){ 
            const fetchedBooks = await response.json();
            fetchedBooks.forEach((book)=>{
                if(book.discount>0){
                    book.discountPercent = book.discount*100 + "%";
                    book.newPrice = book.price - (book.price* book.discount);
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
            setTempBooks([...books]);
            return;
        }
        if(value === 'increase'){
            tempBooks.sort((a,b) => a.newPrice - b.newPrice);
        }
        if(value === 'decrease'){
            tempBooks.sort((a,b) => b.newPrice - a.newPrice);
        }
        if(value === 'discount'){
            tempBooks.sort((a,b) => b.discount - a.discount);
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
               <Filters books={books} setTempBooks={setTempBooks} />
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
                        <option value="discount">Discount</option>
                       
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
                          
                       <img src={require(`../../public/assets/images/${book.book_image}`)} alt={book.book_name} />
                        <div style={{marginLeft:'0.3rem', marginTop:'0.5rem'}}>
                            <p>{book.book_name}</p>
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
            padding-top: 10px;
        }
    }
    .sort-by{
        padding: 3px;
        cursor: pointer;
        outline:none;
    }
    @media (max-width:600px){
        font-size: 0.8rem;
        .sortbydiv{
            text-align: -webkit-center;
        }
        .sort-by{
            width: 96px;
        }

    }
`;
const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem,1fr));
    grid-gap:1rem;

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
     /* .slider-icon{
         display:none;
     }
     .slider-icon:hover{
         cursor: pointer;
         background: #d4dbe1e3;
     } */
       
     @media (max-width:850px) {
        grid-template-columns: 2rem 4fr;
    }
    /* flex-direction: row; */
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
    img{
        height: 245px;;
        border-radius:5px;
        left:0;
        width:100%;
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
