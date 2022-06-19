import styled from 'styled-components';
import React, {useState,useEffect,useCallback} from 'react';
import {FaSearch,FaTimes,FaArrowLeft} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
import SearchSuggestions from "./SearchSuggestions";
 
function Search({setShowMobSearch}) {
    const [input, setInput] = useState("");
    const [keyWord, setKeyWord] = useState("");
    const [showClose, setShowClose]=useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        // console.log("aav");
    },[input])
    const submitHandler = (e)=>{
        setKeyWord("");
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
        setKeyWord("");
        setShowClose(false);
        // navigate("/books/search_clear");
    }

    const closeSearchBar = ()=>{
        setShowMobSearch(false)
    }
    function debounce(func, delay){
        let timeoutId;
        return function(){
            let context = this;
            let args = arguments;
            if (timeoutId){
                clearTimeout(timeoutId);  //clears the previous timeout callback 
            }
            timeoutId = setTimeout(()=>{
                func.apply(context,args);
            },delay);
        }
    }
    
    function  handleSuggestions (e){
        console.log("Suggestion for ",e.target.value);
        setKeyWord(e.target.value);
    }
    /*
        There is a caveat in function components. Local variables inside a function expires after every call.
         Every time the component is re-evaluated, the local variables gets initialized again.
    */
    const handleDecoratedSuggestions = useCallback(debounce(handleSuggestions,300),[]);
    const handleOnFocus = ()=>{
        setKeyWord(input);
    }
  return (
      <>
    <FormStyle onSubmit={submitHandler}>
        <div className='form-div' >
            {/* {!showMobSearch && (  */}
                <FaSearch className='search-icon'></FaSearch>
                <FaArrowLeft className='back-icon' onClick={closeSearchBar} ></FaArrowLeft>
            {/* )}    */}
            {/* {showMobSearch && (
             <FaArrowLeft onClick={hideSearchBox}/>
             )} */}
            <input placeholder='Search by book name, category...'
            className='search-bar'
            onInput={handleDecoratedSuggestions}
            onChange = {handleSearch}
            onFocus = {handleOnFocus}
            type="text" value={input}/>
            <input className='searchKeyWord' hidden={true} type="submit" value="search"/>
            {showClose && (
                <span className='close-icon'>
                    <FaTimes onClick={handleCloseIcon} />
                </span>
            )}
        </div>
    </FormStyle>
    <SearchSuggestions keyWord={keyWord} setInput={setInput}/>
    </>
  )
}

const FormStyle = styled.form`
    width: 100%;
    .close-icon{
        position: absolute;
        margin-left: -20px;
        margin-top: 8px;
        cursor: pointer;
        color:grey;
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
        top:51%;
        transform: translate(42%,-50%);
        color: grey;
        font-size: 15px;
        @media (max-width: 1336px){
            top:51%;
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
        font-size:0.95rem;
        background:white;
        color:grey;
        padding: 0.4rem 0.7rem;
        padding-left: 1.6rem;
        border:none;
        outline:none;
        width:100%;
        border-radius: 2px;
    
        @media (max-width: 850px){
            font-size:0.95rem;
            width:80%;
        }
        @media (max-width: 650px){
            font-size:0.9rem;
            padding: 0.3rem 2rem;
            width: 100% !important;
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
