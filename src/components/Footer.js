import React , {useState, useEffect} from 'react'
import styled from 'styled-components';
import {Link} from 'react-router-dom';
function Footer() {
  const [isAdmin, setIsAdmin]=useState(false);
  useEffect(()=>{
    let curr_user = JSON.parse(localStorage.getItem("user"));
    if (curr_user){
      if(curr_user.role === "admin"){
        setIsAdmin(true);
      }else{
        setIsAdmin(false);
      }
    }
  },[isAdmin])
  return (
    <FooterOuter className="main-footer">
      {!isAdmin && ( 
      <div className='header-head'> 
        <ul>
          <h3>More</h3>
          <li><Link to = '/about-us'>About Us</Link></li>
          <li><Link to = '/contact-us'>Contact Us</Link></li>
          <li><Link to = '/faqs'>FAQs</Link></li>
        </ul>
        <ul>
          <h3>Popular</h3>
          <li><Link to = '/books/js_book'>JavaScript</Link></li>
          <li><Link to = '/books/cn_book'>Computer Networks</Link></li>
          <li><Link to = '/books/html_book'>Discrete Maths</Link></li>
        </ul>
      </div>
      )}
      <div className='header-foot'>
        <h4> &copy;All Rights Reserved: 2022 </h4>
      </div>
    </FooterOuter>
  )
}


const FooterOuter = styled.footer`
    bottom:0;
    color: white;
    background-color: grey;
    border-top: 1px solid white;
    padding:1.5rem;
    /* margin-top:1rem;  */
    
  .header-head {
    display: inline-flex; 
    justify-content: space-around; 
    width: 100%;
  }
  a{
    color:white;
  }
  a:hover{
    color:wheat;
    text-decoration: underline;
  }
  .header-head h3 { 
    margin-bottom: 10px;
  }
  .header-head li { 
    list-style: none;
    margin-bottom: 5px;
  }
  .header-foot { 
    margin-top: 20px;
    text-align: center;
  }
`;
export default Footer
