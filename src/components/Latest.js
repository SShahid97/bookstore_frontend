import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import "@splidejs/splide/dist/css/splide.min.css";
import { Link } from 'react-router-dom';
import {User_Service} from '../services/Service'

function Latest(props) {
    const [latest, setLatest] = useState([]);
    const ref = useRef();
    let cat;
    cat = props.category;  
    useEffect(() => {
        getLatest();
    },[cat]);

    const getLatest = async()=>{
        const fetchedData = await User_Service.getLatest(cat);
        fetchedData.forEach((book)=>{
            if(book.discount>0){
                book.discountPercent = book.discount*100 + "%";
                book.newPrice = book.price - (book.price* book.discount);
           }
        });
        setLatest(fetchedData);
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
                    autoplay:true,
                    rewind: true,
                    breakpoints: { 
                        1225: {
                          perPage: 4,
                         
                        },
                        1020: {
                          perPage: 2,
                    
                        },
                        380: {
                            perPage: 1,
                      
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
                                    <div style={{ marginLeft: '0.3rem', marginTop: '0.5rem' }}>
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
        @media (max-width:610px) {
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
