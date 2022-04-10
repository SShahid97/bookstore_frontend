import styled from 'styled-components';
import {useState} from 'react';
import {FaSearch} from 'react-icons/fa';
import {useNavigate} from 'react-router-dom';
 
function Search() {
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const submitHandler = (e)=>{
        navigate("/search/"+input);
        e.preventDefault();
    }
  return (
    <FormStyle onSubmit={submitHandler}>
        <div style={{width:'100%', textAlign:'center'}}>
        <FaSearch></FaSearch>
            <input placeholder='Search'
            onChange = {(evt)=>setInput(evt.target.value)} 
            type="text" value={input}/>
        </div>
        
    </FormStyle>
   
  )
}

const FormStyle = styled.form`
  display: grid;
  /* grid-template-columns: 3fr repeat(3, 1fr); */
  /* align-items: center; */
  /* justify-content: center; */

    /* margin:0rem 10rem; */
    /* text-align:-webkit-right;
    margin-right: auto; */
    @media (max-width: 550px){
            font-size:smaller;
    }
    position: relative; 
    div{ 
        /* align-items: center;
        justify-content: center; */
        /* align-items: right;
        text-align: right; */
        margin:0 auto;
        /* width:%; */
    }
    input{
        border:none;
        background: linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131);
        font-size:1.3rem;
        background:white;
        color:grey;
        padding:0.4rem 2.5rem;
        border:none;
        outline:none;
        width:65%;
        border-radius: 5px;
        @media (max-width: 850px){
            font-size:1rem;
        }
        @media (max-width: 550px){
            font-size:0.9rem;
            padding:0.3rem 2rem;
        }
        
    }
    svg{
        position:absolute;
        top:50%;
        transform:translate(100%,-50%);
        color:grey;
        
    }
    
`;
export default Search;
