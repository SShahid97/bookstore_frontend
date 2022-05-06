import styled from 'styled-components';
import React, {useState} from 'react';
import {FaSearch,FaTimes} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
 
function Search() {
    const [input, setInput] = useState("");
    const [showClose, setShowClose]=useState(false);
    const navigate = useNavigate();
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
  return (
    <FormStyle onSubmit={submitHandler}>
        <div className='form-div'>
            <FaSearch></FaSearch>
            <input placeholder='Search'
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
        /* display: none; */
    } 
    .search-bar:hover{
        /* display: block; */
    }
    .form-div{
        width:100%; 
        text-align:end;
        @media (max-width: 1000px){
            text-align:center;
        }
        margin:0 auto;
    }

    input{
        border:none;
        background: linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131);
        font-size:1.2rem;
        background:white;
        color:grey;
        padding:0.4rem 2.5rem;
        border:none;
        outline:none;
        width:98%;
        border-radius: 2px;
        @media (max-width: 850px){
            font-size:1rem;
            width:80%;
        }
        @media (max-width: 550px){
            font-size:0.9rem;
            padding: 0.3rem 2rem;
            width: 90%;
        }
        
    }
    svg{
        position:absolute;
        top:46%;
        transform:translate(100%,-50%);
        color:grey;
        @media (max-width: 1336px){
            top:35%;
        }
        /* @media (max-width: 1150px){
            top:35%;
        } */
        @media (max-width: 1000px){
            top:55%;
        }
        
    }
    @media (max-width: 1000px){
        width:inherit;
    }
    @media (max-width: 550px){
        font-size:smaller;
        width:inherit;
    }
`;
export default Search;
