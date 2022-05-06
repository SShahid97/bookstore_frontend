import styled from 'styled-components';
import React, {useState,useEffect} from 'react';
import {FaSearch,FaTimes,FaArrowLeft} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
 
function Search({setShowMobSearch}) {
    const [input, setInput] = useState("");
    const [showClose, setShowClose]=useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        console.log("aav")
    },[])
    const submitHandler = (e)=>{
        navigate("/books/search_"+input);
        e.preventDefault();
    }

    const handleSearch = (evt)=>{
        setInput(evt.target.value);
        setShowClose(true);
        if(evt.target.value === ""){
            setShowClose(false);
        }
    }

    const handleCloseIcon = ()=>{
        setInput("");
        setShowClose(false);
        // navigate("/books/search_clear");
    }

    const closeSearchBar = ()=>{
        setShowMobSearch(false)
    }
  return (
    <FormStyle onSubmit={submitHandler}>
        <div className='form-div' >
            {/* {!showMobSearch && (  */}
                <FaSearch className='search-icon'></FaSearch>
                <FaArrowLeft className='back-icon' onClick={closeSearchBar} ></FaArrowLeft>
            {/* )}    */}
            {/* {showMobSearch && (
             <FaArrowLeft onClick={hideSearchBox}/>
             )} */}
            <input placeholder='Search by book name, author...'
            className='search-bar'
            onChange = {handleSearch}
            type="text" value={input}/>
            {showClose && (
                <span className='close-icon'>
                    <FaTimes onClick={handleCloseIcon} />
                </span>
            )}
        </div>
    </FormStyle>
  )
}

const FormStyle = styled.form`
    width: 100%;
    .close-icon{
        position: absolute;
        margin-left: -38px;
        margin-top: 18px;
        cursor: pointer;
        color:grey;
        @media (max-width:1210px){
            margin-top:  20px;
        }
        @media (max-width:650px){
            margin-top:  20px;
        }
    }
    .close-icon:hover{
        color:black;
    }
    .close-icon:active{
        color:black;
    }
 
    .search-icon{
        position:absolute;
        top:50%;
        transform: translate(42%,-50%);
        color: grey;
        font-size: 15px;
        @media (max-width: 1336px){
            top:40%;
        }

        @media (max-width: 1000px){
            top:55%;
        }

        @media (max-width:650px){
            display: none;
        }
    }

    .back-icon{
        position:absolute;
        top:46%;
        transform: translate(42%,-50%);
        color: grey;
        font-size: 15px;
        
        @media (min-width:650px){
            display: none;
        }
        @media (max-width:650px){
            display: block;
            top: 50%;
        }
    }
    .back-icon:hover{
        color:black;
        cursor: pointer;
    }
    .back-icon:active{
        color:black;
        cursor: pointer;
    }

    .form-div{
        width:100%; 
        text-align:end;
        @media (max-width: 1000px){
            text-align:center;
        }
        margin:0 auto;
        /* @media (max-width:650px){
            display: none;
        } */
    }

    input{
        border:none;
        background: linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131);
        font-size:1.1rem;
        background:white;
        color:grey;
        padding: 0.4rem 1rem;
        padding-left: 1.4rem;
        border:none;
        outline:none;
        width:100%;
        border-radius: 2px;
    
        @media (max-width: 850px){
            font-size:1rem;
            width:80%;
        }
        @media (max-width: 650px){
            font-size:1.1rem;
            padding: 0.3rem 2rem;
            width: 100%;
            height: 3rem;
            border-top: 1px solid grey;
            border-bottom: 1px solid grey;
        }
        
    }


    @media (max-width: 1000px){
        width:inherit;
    }
    @media (max-width: 650px){
        font-size:smaller;
        width:inherit;
    }
`;
export default Search;
