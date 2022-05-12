import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import "@splidejs/splide/dist/css/splide.min.css";
import { Link } from 'react-router-dom';
import {User_Service} from '../services/Service'

function Latest(props) {
    const [latest, setLatest] = useState([]);
    const ref = useRef();
    
    useEffect(() => {
        // let cat;
        // cat = props.category; 
        if(props.category  !== undefined){
            getLatest(props.category);
        } 
    },[props.category]);

    const getLatest = async(cat)=>{
        const response = await User_Service.getLatest(cat);
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
            setLatest(fetchedBooks);
        }else if (response.status === 404){
            const data = await response.json();
            // setNotFound(data.message);
            console.log(data);
        }else if (response.status === 400){
            console.log("Bad Request");
        }
        
    }

    return (
        <Wrapper>
            <Splide
                ref={ref}
                options={{
                    arrows: true,
                    pagination: false,
                    drag: "free",
                    gap: "1rem",
                    perPage: 5,
                    perMove: 1,
                    // autoplay:true,
                    // rewind: true,
                    breakpoints: { 
                        1225: {
                          perPage: 4,
                         
                        },
                        1020: {
                          perPage: 3,
                    
                        },
                        650: {
                            perPage: 2,
                            gap: "0.8rem",
                      
                        },
                        360: {
                            perPage: 2,
                            gap: "0.7rem",
                        },
                      }

                }}
            >
                {latest.map((book) => {
                    return (
                        <SplideSlide key={book._id} >
                            <Card >
                                {(book.discount>0) && (
                                    <span className='discount' >{book.discountPercent}</span>
                                )}
                                <Link to={"/book/" + book._id}>
                                    <img src={require(`../../public/assets/images/${book.book_image}`)} alt={book.book_name} />
                                    <div className='details' style={{ marginLeft: '0.3rem', marginTop: '0.5rem',marginRight: '0.3rem' }}>
                                        {book.book_name.length<=30? <p>{book.book_name}</p>:<p> {book.book_name.slice(0,30)}...</p> }
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
                        </SplideSlide>
                    );
                })}
            </Splide>
        </Wrapper>
    )
}

const Wrapper = styled.div`
     margin: 0.3rem 0rem 4rem 0rem  !important;
     .splide__arrow {
        width: 3rem;
        height: 3rem;
        margin-left: -13px;
        margin-right: -13px;
        @media (max-width:650px) {
            width: 1.6rem;
            height: 1.6rem;
        }
        .splide__arrow svg {
            fill: grey !important;
        }
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
        padding: 8px;
        min-height: 19rem;
        border-radius:3px;
    }
    @media (max-width:360px){
        padding: 3px;
        min-height: 18rem;
    }
    .details{
        font-size: 0.9rem;
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
        box-shadow: 3px 6px 4px 2px #00000050;
        opacity: 0.9;
    }
    img{
        height: 245px;;
        border-radius:5px;
        left:0;
        width:100%;
        @media (max-width:650px){
            height: 230px;;
            border-radius:3px;
        }
        @media (max-width:360px){
            height: 210px;
        }
    }
    span{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size:medium;
    }
    p{
        font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    }
`;


export default Latest
