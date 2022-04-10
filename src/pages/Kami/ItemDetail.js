import React, {useState, useEffect} from "react";
// import './App.css';
import {useParams} from 'react-router-dom';

function ItemDetail() {
   
    const [item, setItem]  = useState({});
    let params = useParams();
    // console.log("This is id",id);
    useEffect(() => {
        fetchItem();
    }, []);

    const fetchItem = async () => {
        const response = await fetch(`https://fortnite-api.theapinetwork.com/item/get?id=${params.id}`);
        // console.log(response);
        const data = await response.json();
        console.log("This is data: ", data.data.item);
        setItem(data.data.item);
    }
    return(
        <div>
            <h1>{item.name}</h1>
            <h1>{item.description}</h1>
            {/* <h1>{item.media[0]}</h1> */}
            <img src={item.image.icon} alt = ""/>
        </div>
    );
}
export default ItemDetail;