import { useEffect, useState } from 'react';
import Search from './Search';
import Category from './Category';
import MobileCategory from './MobileCategory';
// import MenuOnScroll from './MenuOnScroll';
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
  FaUserShield,
  FaSearch } from "react-icons/fa";


function Navbar() {
    const [mobileView, setmobileView] = useState(false);
    const [adminMobileView, setAdminMobileView] = useState(false);
    const [toggleDropdown, setToggleDropDown] = useState(false);
    const [toggleAdminNav, setToggleAdminNav] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [user, setUser] = useState({});
    const [userName, setUserName]=useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedOut, setisLoggedOut] = useState(true);
    const [cartItemsLength, setCartItemsLength]= useState(0);
    const [showMobSearch, setShowMobSearch] = useState(false);
    const [showHideSearch, setShowHideSearch] = useState(false);
    const navigate = useNavigate();
    // const [scrollPosition, setScrollPosition] = useState(0);   
    // const [isMenu, setIsMenu] = useState(false);

    useEffect(()=>{
      window.addEventListener('scroll', handleScroll, { passive: true });

    
      // getCartItems();
      // runs for first time
      let user = JSON.parse(localStorage.getItem('user'));
      if(user){
        setUser(user);
        let name = user.name.split(" ")[0];
        name = name.substring(0,5);
        setUserName(name);
        checkUser(user);
      }
      userService.onUser().subscribe(curr_user => {
        if (curr_user) {
          setUser(curr_user);
          let name = curr_user.name.split(" ")[0];
          // console.log(name.substring(0,4));
          name = name.substring(0,5);
          setUserName(name);
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
      
      // // return unsubscribe method to execute when component unmounts
      // return subscription.unsubscribe;   
      return () => {
        window.removeEventListener('scroll', handleScroll);
    };
    },[userName]);

    cartService.onUpdateCartItems().subscribe(cartItemsLen => {
      // debugger;
      if(cartItemsLen){
        setCartItemsLength(cartItemsLen);
      }
    });
    
    const handleScroll = () => {
      // const position = window.pageYOffset;
      // setScrollPosition(position);

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
      setUserName("");
      setUser("");  
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      localStorage.removeItem("customerInfo");
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
    const handleAdminHamburger = ()=>{
      setAdminMobileView(!adminMobileView);
      // if(toggleAdminNav){
        setToggleAdminNav(!toggleAdminNav)
      // }

    }
  
    const handleUserAccount=()=>{
      setToggleDropDown(!toggleDropdown);
      if(mobileView){
        setmobileView(false); 
      }

    }
    const showMobSearchBar = ()=>{
      console.log("clicked")
      setShowMobSearch(true);
    }

    // const handleMenu = ()=>{
    //   setIsMenu(!isMenu);
    // }
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
          {/* {(!isAdmin && mobileView) && ( */}
            <span className={mobileView?"showNav":"hideNav"}>
              <MobileCategory  setmobileView={setmobileView}  />
            </span>
          {/* ) } */}
          {(!isAdmin && (
              <>
                <div className={showMobSearch?'search-box-mobile':'search-box' }>
                 <Search setShowMobSearch={setShowMobSearch}/> 
                </div>
                <FaSearch className="search-icon-mobile" onClick={showMobSearchBar} ></FaSearch>
              </>    
          ))}
          
          

           {/* Cart */}
           {!isAdmin && (
             <>    
             <div className="cart-icon" onClick={handleCart}>
               <span className='cart-bage'>{cartItemsLength}</span>
               <FaShoppingCart className="cart"/>
             </div>
             </>
           )}
           

            {/* User */}
          {(!isAdmin && (
            <div title={user.name} className={toggleDropdown?'activeIcon':'user-icon user-icon-name'} onClick={handleUserAccount}>
              <span className='username'>{userName}</span>
              <FaUserCog />
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
             <>
              <Logo to={"/admin-panel/dashboard"} >
                <SiElasticsearch className='logo-icon-admin' />
                <span className='logo-text-admin'>BookStore</span> 
              </Logo>
             </>
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
         

          {(isAdmin && (
            <div title={user.name} className={toggleDropdown?'activeIcon':'user-icon user-icon-name'} onClick={handleUserAccount}>
              <span className='username'>{userName}</span>
              <FaUserCog />
          </div>
          ))} 
        {/* Admin Screen ends here */}
          {toggleDropdown && (
            <ul className='dropdown' onClick={()=>setToggleDropDown(!toggleDropdown)}> 
              {(isUser || isAdmin) && (
                <>
                {isUser && (
                  <>
                    <NavLinks to={"/user/account"} className='dropdown-item'>         
                    <FaUser/><p className="sign_reg_icons" ><strong>My Account</strong></p>
                    </NavLinks>
                    <li className='dropdown-item' onClick={logout}> 
                    <FaSignOutAlt /><p className="sign_reg_icons" ><strong>Logout</strong></p>
                  </li>
                </>
                )}
                {isAdmin && (
                  <>
                    <NavLinks to={"admin-panel/dashboard"} className='dropdown-item'>         
                    <FaChalkboardTeacher /><p className="sign_reg_icons" ><strong>Dashboard</strong></p>
                    </NavLinks>
                    <li className='dropdown-item' onClick={logout}> 
                      <FaSignOutAlt /><p className="sign_reg_icons" ><strong>Logout</strong></p>
                    </li>
                  </>
                )} 
                
               </>
              )}
              {/* {isAdmin && (
                  <>
                  <NavLinks  to={"/admin-panel"} className='dropdown-item'> 
                    <FaChalkboardTeacher /><p className="sign_reg_icons" ><strong>Admin Panel</strong></p>
                  </NavLinks>
                  </>
              )} */}

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
    @media (max-width:650px){
      transform:scale(1.3);
    }
  }
  .logo-text{
    padding-left:5px;
    color: rgb(247 227 81);
    @media (max-width:650px){
      font-size: medium;
      font-family: sans-serif;
      padding-left: 3px;
      transform: scaleY(1.5);
    }
  }

  .logo-icon-admin{
    transform:scale(2);
    color: rgb(255 116 30);
    @media (max-width:650px){
      transform:scale(1.3);
    }
  }
  .logo-text-admin{
    padding-left:5px;
    color: rgb(247 227 81);
    @media (max-width:650px){
      font-size: medium;
      font-family: sans-serif;
      padding-left: 3px;
      transform: scaleY(1.3);
    }
  }

`;
const Nav = styled.div`
  width: -webkit-fill-available;
  width: -moz-available;
  top:0;
  position: fixed;
  z-index: 1400; 
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  display: grid;
  grid-template-columns: 2rem 9rem 4fr 1fr 4rem 5rem;
  /* padding:0.5rem 0rem; */
  /* background:linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131d9); */
  background: grey;
  margin-bottom: 0.5rem;
  .showNav{
    display: contents;
  }
  .hideNav{
    display: none;
  }
  .username{
    color: white;
    font-size: 9px;
    transform: scaleY(1.4);
  }
  .user-icon-name{
    margin-top:10px;
    display:flex;
    cursor: pointer;
  }
  .main-menu-links{
    @media (max-width:1000px) {
      display: none;
    }
  }

  .search-box{
    margin-top: 0.6rem;
    @media (max-width:1000px){
      margin-top: 0.2rem;
    }
    @media (max-width:650px){
      display:none;
    }
  }
  .search-box-mobile{
    display:block;
    position: absolute;
    width: 100%;
    z-index: 4;
  }
  .search-icon-mobile{
    display: none;
    cursor: pointer;
    @media (max-width:650px){
      display:block;
      color: white;
      margin-top: 12px;
      margin-left: 85%;
      transform: scale(1.2);
    }
  }

  .cart-icon{
    margin-top:11px;
    margin-left: 45px;
    @media (max-width:1000px){
      margin-top:6px;
    } 
    @media (max-width:650px){
      margin-top:8px;
      margin-left: 0px;
    }   
  }
  .cart-bage{
    margin-left: 10px;
    margin-top: -5px;
    position: absolute;
    background-color: orangered;
    color: white;
    border-radius: 50%;
    display: block;
    width: 16px;
    height: 18px;
    text-align: center;
    font-size: small;
    cursor: pointer;
    @media (max-width:650px){
      width: 13px;
      height: 16px;
      margin-top: -8px;
      margin-left: 12px;
      font-size: smaller;
    }
  }

  .user-icon{
    display: flex;
    margin: 0 auto;
    align-items: center;
    font-size: 1.8rem;
    color: white;
    margin-left: 38px;
    @media (max-width:650px){
      font-size: 1.5rem;
      margin-left: 8px;
      margin-top: 5px;
    }
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
    @media (max-width:650px){
      font-size: 1.5rem;
    }
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
      @media (max-width:650px){
        grid-column: 3/5;
        padding:5px;
        h3{
          font-size: 15px;
          margin-top: 5px;
        }
      }
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
    grid-template-columns: 2rem 1fr 3fr 3rem 4rem 3rem;
    padding: 5px;
    padding-right:10px;
    
  }
  
  @media (max-width:650px) {
    grid-template-columns: 1rem 1fr 1fr 2rem 2rem 3rem;
    .admin-icon{
      transform: scale(1);
      margin-right: 5px;
    }
  }
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
