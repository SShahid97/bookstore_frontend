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

import {SiWinmate} from 'react-icons/si';
import { GiHamburgerMenu } from "react-icons/gi";
import { 
  FaUserCog, 
  FaTimes,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt, 
  FaUser,
  FaChalkboardTeacher,
  FaShoppingCart } from "react-icons/fa";
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

    // isUser,isAdmin
    function logout(){
      setIsUser(false);
      setIsAdmin(false);
      setisLoggedOut(true);
      setCartItemsLength(0);
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
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
       {(scrollPosition > 0) && (
         <>
         {!isMenu && (<GiHamburgerMenu className='menu' onClick={handleMenu} />) }
         {isMenu && (<FaTimes className='menu' onClick={handleMenu}/>)}
         </>
       )}
       {isMenu && (
         < MenuOnScroll/>
       )}
       {mobileView}
            
          <Logo to={"/"} >
            <SiWinmate style={{fontSize: 'xx-large',background:'linear-gradient(to right, #f27121, #e94057)'}} />
            <span>ebPro</span> 
          </Logo>
          {/* {!isAdmin && (
          <div >
            <Category />
          </div>)} */}
          {(!isAdmin && mobileView) && (
            <MobileCategory />
          ) }
          <div className='search-box'>
            <Search/> 
          </div>
          

           {/* Cart */}
           {!isAdmin && (
             <>    
             <div style={{marginTop:'10px',textAlign: '-webkit-center'}} onClick={handleCart}>
               <span className='cart-bage'>{cartItemsLength}</span>
               <FaShoppingCart className="cart"/>
             </div>
             </>
           )}
           

            {/* User */}
           <div style={{marginTop:'10px'}} onClick={handleUserAccount}>
            <FaUserCog className={toggleDropdown?'activeIcon':'user-icon'}/>
          </div>

          {/* Hamburger  */}
          {!isAdmin  && (
            <div className="hamburger-menu" onClick={handleHamburger}>
            {!mobileView && (<GiHamburgerMenu className={mobileView?"active-menu":"hamburger-menu"} />)}
            {mobileView && (<FaTimes className={mobileView?"active-menu":"hamburger-menu"}/>)}
          </div>
          )}

          {/* {hideMenuItems && (
            
             <GiHamburgerMenu  />
          ) } */}

          

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
          <Nav2>
            <Category />
          </Nav2>
        
    </div>
  )
}


const Nav = styled.div`
  width: -webkit-fill-available;
  top:0;
  position: fixed;
  z-index: 1000; 
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  display: grid;
  grid-template-columns: 4rem 1fr 3fr 5rem 5rem;
  padding:0.5rem 0rem;
  /* background:linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131d9); */
  background: grey;
  margin-bottom: 0.5rem;
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

/* responsive for mobiles */
@media (max-width:1000px) {
  grid-template-columns: 1rem 1fr 3fr 3rem 3rem 3rem;
  
}

@media (max-width:600px) {
  grid-template-columns: 1rem 1fr 3fr 2rem 2rem 2rem;
}

`;

const Nav2 = styled.div`
    top: 59px;
    padding-left: 3rem;
    position: relative;
    display: grid;
    background:linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131d9); 
`;

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
`;

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
