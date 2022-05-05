import React, { useEffect, useState } from 'react';
import {FaUserCircle} from "react-icons/fa";
import Rating from "./Rating";

function ReviewAndRating({reviews}) {
    
    // const [rating, setRating]= useState([]);
    // useEffect(()=>{
    //     setRating(reviews.rating);
    // },[])
    return (
        <div className='display-reviews-outer'>
            {
                reviews.map((review) => {
                    return (
                        <div key={review._id} className='book-reviews'>
                            <div className='review-user'>
                                <FaUserCircle className='review-user-icon' />
                                <h4 className='review-username'>{review.user.name}</h4>
                            </div>
                            <Rating rating={review.rating}/>
                            <div className='review-date'>{review.date.split("T")[0]}</div>
                            <div className='review-text'>
                                <p>
                                   {review.review}
                                </p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ReviewAndRating
