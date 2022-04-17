import React, { useEffect,useState } from 'react';
import styled from 'styled-components';
// import {motion} from 'framer-motion';
import {Link, useParams} from 'react-router-dom';
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
//    const [isSliderOpen, setIsSliderOpen] = useState(false);
   
    useEffect(()=>{
        window.scrollTo(0, 0);
        setTimeout(()=>{
            getBooksByCategory(params.cat);
        },1000)
    },[params.cat]);

    const getBooksByCategory = async (category)=>{
       const fetchedBooks = await User_Service.getBooksByCategory(category);
        // console.log(fetchedBooks[0])
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
       const booksReceived = await User_Service.getBooksByCategory(category);
       booksReceived.forEach((book)=>{
            if(book.discount>0){
                book.discountPercent = book.discount*100 + "%";
                book.newPrice = book.price - (book.price* book.discount);
            }
            if(book.discount===0){
                book.newPrice = book.price; 
            }
        });
       setBooks(booksReceived);
       
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
    <Wrapper>

    <SideNav>
        <div>
            <Filters books={books} setTempBooks={setTempBooks} />
            <hr/>
            <div>
                <h4>Language</h4>
            </div>
        </div>
        
    </SideNav>
    <SliderrIcon onClick={handleOpenSideNav}>
        <BsSliders  />
    {/* {isSliderOpen && ( */}
        <div className={openSideNav? 'dropdown-sidenav show_sidenav':'dropdown-sidenav'}>
           <Filters books={books} setTempBooks={setTempBooks} />  
            <hr/>
            <div>
                <h4>Language</h4>
            </div>
        </div>
    </SliderrIcon>
    {/* )} */}
    <Main>
        {(tempBooks.length < 1) && (<Loader/>)} 
        {(tempBooks.length > 1) && (
            <Top>
            <div>
                <strong> {tempBooks.length} results found </strong>
            </div>
            <div>
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
    <Grid>
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
                                <p style={{textDecoration: 'line-through', opacity:'0.8'}}>&#8377;{book.price}</p>
                                <p><span>&#8377; {book.newPrice}</span></p>
                            </>
                        )}
                    </div>
                  </Link> 
              </Card>
          );
      })}
    </Grid>
    </Main>
    </Wrapper>
  )
}

const Main = styled.div`
    margin-right:1.5rem;
    padding:5px;
    display:grid;
    grid-template-rows: 2rem 4fr;
`;
const Top = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: space-between;

    .sort-by{
        padding: 3px;
        cursor: pointer;
        outline:none;
    }
`;
const Grid = styled.div`
    /* margin-top: 1rem; */
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem,1fr));
    grid-gap:1rem;
`;

const SliderrIcon = styled.div`
     display:none;
     height:38px;
     .dropdown-sidenav{
        color:white;
        z-index: 800;
        list-style: none;
        position: absolute;
        top:70px;
        left:42px;
        width:65%;
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
