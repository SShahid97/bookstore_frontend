import React,{useState,useEffect} from 'react';


function Filters({books, setTempBooks }) {
    const [priceRange, setPriceRange] = useState(100);
    const [discountRange, setDiscountRange] = useState(0.1);
    const [filters, setFilters]=useState(false);
    useEffect(()=>{
        setPriceRange(priceRange);
        setDiscountRange(discountRange);
        console.log("hello");
    },[]);
    const handlePriceRange = (e)=>{
        // console.log(e.target.value);
        setPriceRange(e.target.value);
    }
    const handleDiscountRange = (e)=>{
        setDiscountRange(e.target.value)
    }
    const onPriceRange = (e)=>{
        setFilters(true);
        const tempPriceRange = [];
        books.forEach((book)=>{
            if(book.newPrice < e.target.value){
                  tempPriceRange.push(book);
            }
            
        })
        setTempBooks(tempPriceRange);
    }
    const onDiscountRange = (e)=>{
        setFilters(true);
        const tempDiscountRange = [];
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
        setDiscountRange(0.1);
        setFilters(false);
        setTempBooks(books);
    }
    return (
    <div>
       <h3>Refine your search</h3>
        <div className='refine-search'>
            <p>Price Under:&nbsp; <span> &#8377;{priceRange}</span> </p>
            <input className='price-range' type="range" value={priceRange} min={100} max={2000} onChange={handlePriceRange} onMouseUp={onPriceRange}/>
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
            <p>Discount Under: &nbsp;<span>{discountRange*100}%</span> </p>
            <input className='discount-range' type="range" min={0.1} value={discountRange} step={0.05} max={0.9} onChange={handleDiscountRange} onMouseUp={onDiscountRange}/>
            <div style={{display:'flex', justifyContent:'space-between', width:'95%'}}>
                <div>
                &#8377;10%
                </div>
                <div>
                &#8377;90%
                </div>
            </div>
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
