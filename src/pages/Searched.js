import React from 'react';
import {useEffect, useState} from 'react';
import {Link, useParams} from 'react-router-dom';
import styled from 'styled-components';
import {User_Service} from '../services/Service';
import Loader from '../components/Loader';

function Searched() {
    const [searched, setSearched]= useState([]);
    let params = useParams();
     useEffect(()=>{
        getSearched(params.search);
     },[params.search]);

     const getSearched = async (name)=>{
        const fetchedData = await User_Service.getSearched(name);
        setSearched(fetchedData);
     }

    return (
    <Grid>
        {(searched.length < 1) && (<Loader />)}
        { searched.length===0?<h3 style={{color:'red',textAlign:'center'}}>Sorry!! No results found</h3>: 
            searched.map((book)=>{
                return (
                 <Card key = {book._id}>
                 <Link to={"/book/"+book._id}> 
                     <img src={require(`../../public/assets/images/${book.book_image}.jpg`)} alt={book.book_name} /> 
                     <div style={{marginLeft:'0.3rem', marginTop:'0.5rem'}}>
                         <p>{book.book_name}</p>
                         <span>Rs.</span><span>{book.price}</span>
                     </div>
                 </Link> 
                 </Card>
                );
             })
        }
        
    </Grid>
  )
}

const Grid = styled.div`
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(14rem,1fr));
    grid-gap:2rem;
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
export default Searched
