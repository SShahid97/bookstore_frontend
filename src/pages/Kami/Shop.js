import React, {useState, useEffect} from "react";
// import './App.css';
import {Link} from 'react-router-dom';

function Shop() {
    useEffect(() => {
        fetchItems();
    }, []);

    const [items, setItems]  = useState([]);
    // console.log(items);
    const fetchItems = async () => {
        const response = await fetch('https://fortnite-api.theapinetwork.com/upcoming/get');
        // console.log('This is response',response);
        const data = await response.json();
        console.log("This is data", data);
        setItems(data.data);
        console.log(data.data)
    };
    // console.log(data.data);
    return(
        <div>
            {items.map(item => (
                <h1 key={item.itemId}>
                    <Link to={"/shop/"+item.itemId}>{item.item.name}</Link>
                </h1>
            ))}
        </div>
    );
}
export default Shop;