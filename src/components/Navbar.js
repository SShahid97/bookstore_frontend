import { useEffect, useState } from 'react';
import Search from './Search';
import Category from './Category';
import MobileCategory from './MobileCategory';
import MenuOnScroll from './MenuOnScroll';
import { useNavigate } from 'react-router-dom';
import {Link,NavLink} from 'react-router-dom';
import styled from 'styled-components';
import {userService, cartService} from "../services/LocalService";
// import {Service} from '../services/Service';

import {SiElasticsearch} from 'react-icons/si';
import { GiHamburgerMenu } from "react-icons/gi";
import { 
  FaUserCog, 
  FaTimes,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt, 
  FaUser,
  FaChalkboardTeacher,
  FaShoppingCart,
  FaUserShield } from "react-icons/fa";

function Navbar() {
    const [mobileView, setmobileView] = useState(false);
    const [toggleDropdown, setToggleDropDown] = useState(false);
    const [isUser, setIsUser] = useState(false);
    //const [user, setUser] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedOut, setisLoggedOut] = useState(true);
    const [cartItemsLength, setCartItemsLength]= useState(0);
    const navigate = useNavigate();
    const [scrollPosition, setScrollPosition] = useState(0);   
    const [isMenu, setIsMenu] = useState(false);

    useEffect(()=>{
      window.addEventListener('scroll', handleScroll, { passive: true });

    
      // getCartItems();
      // runs for first time
      let user = JSON.parse(localStorage.getItem('user'));
      if(user){
        checkUser(user);
      }
      userService.onUser().subscribe(curr_user => {
        if (curr_user) {
          checkUser(curr_user)
        } else {
          // setIsUser(false);
        }
      });

      // on refresh
      // let cartLen = JSON.parse(localStorage.getItem('noOfCartItems'));
      // if(cartLen){
      //   setCartItemsLength(cartLen);
      // }
      cartService.onUpdateCartItems().subscribe(cartItemsLen => {
        // debugger;
        if(cartItemsLen){
          setCartItemsLength(cartItemsLen);
        }
      })
      // // return unsubscribe method to execute when component unmounts
      // return subscription.unsubscribe;   
      return () => {
        window.removeEventListener('scroll', handleScroll);
    };
    },[]);

   
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);

      // if(scrollPosition === 0){
      //   setIsMenu(false);
      // }
      // if(scrollPosition < 2){
      //   setIsMenu(false);
      //   setHideMenuItems(false);
      // }
    };
    

    function checkUser(curr_user){
      // if(curr_user.token){
        if(curr_user.role === "admin"){
          // setIsUser(true);
          setIsAdmin(true);
          setisLoggedOut(false);
          console.log("i am admin well")
        }else{
          setIsUser(true);
          setisLoggedOut(false);
          console.log("i am user")
        }
      // }
    }

    function handleCart(){
      if(isLoggedOut){
        alert("Please login first");
        return;
      }
      if(isUser){
        let user = JSON.parse(localStorage.getItem('user'));
        navigate("/cart/"+user._id);
      }
    }

  //  const LoginTimedOut = setTimeout(()=>{
  //     if(!isLoggedOut){
  //       console.log("sucessfully logged out");
  //       logout();
  //     }
  //  },86400000);    //timer for 24 hours

    // isUser,isAdmin
    function logout(){
      setIsUser(false);
      setIsAdmin(false);
      setisLoggedOut(true);
      setCartItemsLength(0);
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      // clearTimeout(LoginTimedOut);
      
      // window.location.reload();
      navigate("/");
    }

    const handleHamburger=()=>{
      setmobileView(!mobileView);
      if(toggleDropdown){
        setToggleDropDown(false);  
      } 
    }
  
    const handleUserAccount=()=>{
      setToggleDropDown(!toggleDropdown);
      if(mobileView){
        setmobileView(false); 
      }

    }

    const handleMenu = ()=>{
      setIsMenu(!isMenu);
    }
    return (
    <div>
       {/* Nav Bar */}
       <Nav>
          {!isAdmin && (
            <Logo to={"/"} >
            <SiElasticsearch className='logo-icon' />
              <span className='logo-text'>BookStore</span> 
            </Logo>
          )}
        
          {!isAdmin && (
            <div className='main-menu-links'>
              <Category />
            </div>
          )}

          {/* <Category /> */}
          {(!isAdmin && mobileView) && (
            <MobileCategory setmobileView={setmobileView}  />
          ) }
          {(!isAdmin && (
              <div className='search-box'>
                <Search/> 
              </div>
          ))}
          
          

           {/* Cart */}
           {!isAdmin && (
             <>    
             <div style={{marginTop:'11px',textAlign: '-webkit-center'}} onClick={handleCart}>
               <span className='cart-bage'>{cartItemsLength}</span>
               <FaShoppingCart className="cart"/>
             </div>
             </>
           )}
           

            {/* User */}
          {(!isAdmin && (
            <div style={{marginTop:'10px'}} onClick={handleUserAccount}>
              <FaUserCog className={toggleDropdown?'activeIcon':'user-icon'}/>
            </div>
          ))}


          {/* Hamburger  */}
          {!isAdmin  && (
            <div className="hamburger-menu" onClick={handleHamburger}>
            {!mobileView && (<GiHamburgerMenu className={mobileView?"active-menu":"hamburger-menu"} />)}
            {mobileView && (<FaTimes className={mobileView?"active-menu":"hamburger-menu"}/>)}
          </div>
          )}

           {/*For Admin Screen  */}
           {isAdmin && (
            <Logo to={"/admin-panel/viewallitems"} >
              <SiElasticsearch className='logo-icon' />
              <span className='logo-text'>BookStore</span> 
            </Logo>
          )}

          {isAdmin && (
            <>
              
            <div className='admin-panel-heading'>
            <div className='admin-panel-heading-divone'></div>
             <span className='admin-icon'><FaUserShield/> </span> <h3> Admin Panel</h3>
            </div>
            </>
          )}
          {isAdmin && (
            <div >
            </div>
          )}
          {isAdmin && (
            <div>
            </div>
          )}

          {(isAdmin && (
            <div style={{marginTop:'10px'}} onClick={handleUserAccount}>
              <FaUserCog className={toggleDropdown?'activeIcon':'user-icon'}/>
            </div>
          ))} 
        {/* Admin Screen ends here */}
          {toggleDropdown && (
            <ul className='dropdown' onClick={()=>setToggleDropDown(!toggleDropdown)}> 
              {(isUser || isAdmin) && (
                <> 
                <NavLinks to={"/user/account"} className='dropdown-item'>         
                    <FaUser /><p className="sign_reg_icons" ><strong>Account</strong></p>
                </NavLinks>
                <li className='dropdown-item' onClick={logout}> 
                  <FaSignOutAlt /><p className="sign_reg_icons" ><strong>Logout</strong></p>
                </li>
               </>
              )}
              {isAdmin && (
                  <>
                  <NavLinks  to={"/admin-panel"} className='dropdown-item'> 
                    <FaChalkboardTeacher /><p className="sign_reg_icons" ><strong>Admin Panel</strong></p>
                  </NavLinks>
                  </>
              )}

              {(isLoggedOut) && (
                <>
              <NavLinks to={"/register"} className='dropdown-item'>
                 <FaUserPlus /><p className="sign_reg_icons" ><strong>Register</strong></p>
              </NavLinks>
                <NavLinks to={"/login"} className='dropdown-item'>
                 <FaSignInAlt/><p  className="sign_reg_icons"><strong> Login</strong></p>
                </NavLinks>
                </>
              )}
          </ul>
          )}

        
        </Nav>
          {/* {!isAdmin && (
            <Nav2>
              <Category />
            </Nav2>
          )} */}
        
    </div>
  )
}


const Logo= styled(Link)`
   display: flex;
  /* background-color: #3b5998; */
  grid-column: 2/3;
  justify-content: start;
  align-items: center;

  color:white;
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: 400;
  font-family: 'Lobester Two', cursive;

  .logo-icon{
    transform:scale(2);
    color: rgb(255 116 30);
    @media (max-width:600px){
      transform:scale(1.2);
    }
  }
  .logo-text{
    padding-left:5px;
    color: rgb(247 227 81);
    @media (max-width:600px){
      font-size: medium;
    }
  }

`;
const Nav = styled.div`
  width: -webkit-fill-available;
  width: -moz-available;
  top:0;
  position: fixed;
  z-index: 1000; 
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  display: grid;
  grid-template-columns: 2rem 9rem 4fr 12rem 4rem 4rem;
  /* padding:0.5rem 0rem; */
  /* background:linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131d9); */
  background: grey;
  margin-bottom: 0.5rem;

  .main-menu-links{
    @media (max-width:1000px) {
      display: none;
    }
  }

  .search-box{
    margin-top: 0.4rem;
  }

  .user-icon{
    display: flex;
    margin: 0 auto;
    align-items: center;
    font-size: 1.8rem;
    color: white;
  }

  .user-icon:hover{
    cursor: pointer;
    color:antiquewhite;
  }

  .cart{
    /* grid-column: 6/6; */
    display: flex;
    margin: 0 auto;
    align-items: center;
    font-size: 1.8rem;
    color: white;
  }

  .cart:hover{
    cursor: pointer;
    color:rgb(228, 218, 206);
  }
  .menu{
    font-size: x-large;
    color: white;
    margin: 0 auto;
    margin-top: 9px;
    cursor: pointer;
    @media (max-width:1000px) {
      display: none;
    }
  }

  .admin-panel-heading{
      margin: 0 auto;
      color: white;
      padding: 12px;
      font-size: larger;
      display: flex;
  }
  .admin-panel-heading-divone{
      width:200px;
      display:block;
      @media (max-width:1000px) {
        display: none;
      }
  }
  .admin-icon{
    transform: scale(1.5);
    margin-top: 3px;
    margin-right: 10px;
  }
/* responsive for mobiles */
@media (max-width:1000px) {
  grid-template-columns: 2rem 1fr 3fr 3rem 3rem 3rem;
  padding:3px;
  
}

@media (max-width:600px) {
  grid-template-columns: 1rem 1fr 3fr 2rem 2rem 2rem;
  padding:5px;

}

`;

// const Nav2 = styled.div`
//     top: 59px;
//     padding-left: 3rem;
//     position: relative;
//     display: grid;
//     background:linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131d9); 
// `;


const NavLinks = styled(NavLink)`
 /* background: grey; */
  &.active{
        background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    }
`;
export default Navbar
