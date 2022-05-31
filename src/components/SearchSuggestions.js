import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import {Item_Service} from '../services/Service';

function SearchSuggestions({keyWord, setInput}) {
    const [results, setResults]= useState([]);
    useEffect(()=>{ 
        // console.log("keyword", keyWord);
        if(keyWord !== "")
            getSearchSuggestions(keyWord);
    },[keyWord]);

    const getSearchSuggestions = async (searchKey)=>{
        const response = await Item_Service.getSearchSuggestions(searchKey);
        if(response.status === 200){
            const fetchedData = await response.json();
            let resultsSet=new Set([]);
            fetchedData.forEach((item)=>{
                resultsSet.add(JSON.stringify(item))
            })
            const resultsArr = [...resultsSet].map((item) => {
                if (typeof item === 'string') 
                    return JSON.parse(item);
                else if (typeof item === 'object') 
                    return item;
            });
            //   console.log("formattedSet: ",resultsArr)
            // resultsSet.add(JSON.stringify(obj, Object.keys(obj).sort()))
            setResults(resultsArr.slice(0,15));
            // console.log("Filtered:", filtered.slice(0,15));
        }else if(response.status === 204){
            setResults([]);
        }else if(response.status === 400){
            setResults([]);
            console.log("Bad Request");
        }
    }
    const handleSuggested = (input)=>{
        setInput(input);
        setResults([]);
        // the timeout is used here so that the state input should be set first then 
        // click should be triggered on sumbit button
        setTimeout(()=>{
            const searchBtn = document.querySelector(".searchKeyWord");
            searchBtn.click();
        },0)
        
        // console.log(searchBtn);
    }
  return (
    <>
    {(keyWord !== "" && results.length>0) && ( 
        <SuggestionsOuter>
        <ul>
        {results.map((item, index)=>{
            return  (
            <div key={index}>
             {item.book_name && (
                <li onClick={()=>handleSuggested(item.book_name)}>{item.book_name}</li>
             )}
              {item.category && (
                <li onClick={()=>handleSuggested(item.category)}>{item.category}</li>
             )}
             {item.book_author && (
                <li onClick={()=>handleSuggested(item.book_author)}>{item.book_author}</li>
             )}
             </div>
            )
        })}    
        </ul>
        </SuggestionsOuter>
    )}
   </>
  )
}

const SuggestionsOuter = styled.div`
    display: flex;
    position: absolute;
    background: #fafcff;
    width: 19%;
    border-radius:8px;
    padding:5px;
    @media (max-width:650px){
        width: 98%;
    }
    ul{
        list-style-type: none;
        width: 100%;
        max-height: 300px;
        overflow-y: auto;
        ::-webkit-scrollbar {
            width:0.3rem;
            height:0.3rem;
        }
        ::-webkit-scrollbar-track {
        background: none;
        border-radius: 40vw;
        }
        ::-webkit-scrollbar-thumb {
        background:linear-gradient(to bottom, #f27121a9, #e94057d2);
        border-radius: 40vw;
        }
        ::-webkit-scrollbar-thumb:hover {
        background:linear-gradient(to bottom, #f27121, #e94057);
        }
    }
    li{
        width: 95%;
        margin: 0 auto;
        padding: 5px;
        border-bottom: 1px solid #e3e3e3;
        cursor: pointer;
        font-size: 0.85rem;
        &:hover{
            background-color:white;
        }
    }
   
`;
export default SearchSuggestions
