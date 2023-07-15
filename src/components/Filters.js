import React,{useState,useEffect} from 'react';


function Filters({books, setTempBooks,tempBooks }) {
    const [priceRange, setPriceRange] = useState(100);
    const [discountRange, setDiscountRange] = useState(0.01);
    const [filters, setFilters]=useState(false);
    const [checked, setChecked] = useState(false);
    const [ondiscount, setOnDiscount] = useState(false);
    const [onpricerange, setOnPriceRange] = useState(false);
    useEffect(()=>{
        setPriceRange(priceRange);
        setDiscountRange(discountRange);
        // console.log("hello");
    },[]);
    const handlePriceRange = (e)=>{
        // console.log(e.target.value);
        setPriceRange(e.target.value);
        setFilters(true);
        const tempPriceRange = [];
        setOnPriceRange(true);
        books.forEach((book)=>{
            if(book.newPrice < e.target.value){
                  tempPriceRange.push(book);
            }
        })
        setTempBooks(tempPriceRange);
    }
    const handleDiscountRange = (e)=>{
        setDiscountRange(e.target.value);
        setFilters(true);
        const tempDiscountRange = [];
        setOnDiscount(true);
        books.forEach((book)=>{
            if(book.discount>0){
                if(book.discount < e.target.value){
                   return tempDiscountRange.push(book)
                }
            }
        })
        tempDiscountRange.sort((a,b) => b.discount - a.discount);
        setTempBooks(tempDiscountRange);

    }
   
    ////Filtering Ends//////
    const handleClearFilter = ()=>{
        setPriceRange(100);
        setDiscountRange(0.01);
        setFilters(false);
        setTempBooks(books);
        setChecked(false);
        setOnDiscount(false);
        setOnPriceRange(false);
    }
    const handleTopRatedCheck = (e)=>{
        setChecked(!checked);
        const topRated= e.target.checked;
        // console.log(topRated);
        if(topRated){
            setFilters(true);
            if(ondiscount || onpricerange){
                let temp = [...tempBooks];
                const tmp = temp.slice(0).sort((a,b) => b.rating - a.rating);
                setTempBooks(tmp);
            }else{
                let booksTemp = [...books];
                const temp = booksTemp.slice(0).sort((a,b) => b.rating - a.rating);
                setTempBooks(temp);
            }
        }else if(!topRated){
            setFilters(false);
            setTempBooks(books);
        }
        
    }
    return (
    <div>
       <h3>Refine your search</h3>
        <div className='refine-search'>
            <p style={{fontWeight: '500'}}>Price Under:&nbsp; <span> &#8377;{priceRange}</span> </p>
            <input className='price-range' type="range" value={priceRange} min={100} max={2000} onChange={handlePriceRange} />
            <div style={{display:'flex', justifyContent:'space-between', width:'95%'}}>
                <div>
                &#8377;100
                </div>
                <div>
                &#8377;2000
                </div>
            </div>    
        </div>
        <div className='refine-search'>
            <p style={{fontWeight: '500'}}>Discount upto: &nbsp;<span>{Math.round(discountRange*100)}%</span> </p>
            <input className='discount-range' type="range" min={0.01} value={discountRange} step={0.01} max={1} onChange={handleDiscountRange} />
            <div style={{display:'flex', justifyContent:'space-between', width:'95%'}}>
                <div>
                &#8377;1%
                </div>
                <div>
                &#8377;100%
                </div>
            </div>
        </div>

        <div className='top-rated-books'>
            <input
            style={{transform: 'scale(1.3)'}}
            type="checkbox"
            checked={checked}
            onChange={handleTopRatedCheck}
            />
            <label style={{fontSize:'1.1rem', fontWeight:'500'}}> Top Rated Books</label>
        </div>
        {filters && (
                <div style={{textAlign:'center'}}>
                    <button className='clear-filter-btn' onClick={handleClearFilter}>Clear Filters</button>
                </div>
        )}
    </div>
  )
}

export default Filters
