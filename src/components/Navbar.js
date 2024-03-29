import { useEffect, useState } from 'react';
import Search from './Search';
import Category from './Category';
import MobileCategory from './MobileCategory';
import { useNavigate,Link,NavLink } from 'react-router-dom';
import styled from 'styled-components';
import {userService, cartService, logOutService} from "../services/LocalService";
import {motion} from "framer-motion";
import Tooltip from './Tooltip';
// import Loader from './Loader';
import {SiElasticsearch} from 'react-icons/si';
import { GiHamburgerMenu } from "react-icons/gi";
import { 
  FaUserCog, 
  FaTimes,
  FaUserPlus,
  FaSignInAlt,
  FaSignOutAlt, 
  FaUser,
  FaShoppingCart,
  FaUserShield,
  FaSearch,
  FaUserCircle,
  FaGift,
  FaHeart,
  FaWhatsapp } from "react-icons/fa";


function Navbar() {
    const [mobileView, setmobileView] = useState(false);
    const [toggleDropdown, setToggleDropDown] = useState(false);
    const [isUser, setIsUser] = useState(false);
    const [user, setUser] = useState({});
    // const [userName, setUserName]=useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedOut, setisLoggedOut] = useState(true);
    const [cartItemsLength, setCartItemsLength]= useState(0);
    const [showMobSearch, setShowMobSearch] = useState(false);
    const [showToopTip, setShowToopTip] = useState(false);
    const [showCartToopTip, setShowCartToopTip] = useState(false);
    // const [showLoader, setShowLoader] = useState(false);

    const [profilePic, setProfilePic] = useState([]);

    // const [hideOnStart, setHideOneStart] = useState(false);

    const navigate = useNavigate();
    // For animation
    const [rotate, setRotate] = useState(false);
    // const location = useLocation();
    
    // const [adminMobileView, setAdminMobileView] = useState(false);
    // const [toggleAdminNav, setToggleAdminNav] = useState(false);
    // const [showHideSearch, setShowHideSearch] = useState(false);
    // const [scrollPosition, setScrollPosition] = useState(0);   
    // const [isMenu, setIsMenu] = useState(false);

    useEffect(()=>{
      let isMounted = true;
      // setShowLoader(true);
      // window.addEventListener('scroll', handleScroll, { passive: true });
      // setHideOneStart(true);
      // getCartItems();
      // runs for first time
      if(isMounted){
        let user = JSON.parse(localStorage.getItem('user'));
        if(user){
          // console.log("yes yes")
          setUser(user);
          // let name = user.name.split(" ")[0];
          // name = name.substring(0,5);
          // setUserName(name);
          checkUser(user);
          handleSetProfilPicture(user);
  
        }        
      }

      // on refresh
      // let cartLen = JSON.parse(localStorage.getItem('noOfCartItems'));
      // if(cartLen){
      //   setCartItemsLength(cartLen);
      // }
      
      // // return unsubscribe method to execute when component unmounts
      // return subscription.unsubscribe;   
      return () => {
        // window.removeEventListener('scroll', handleScroll);
        isMounted = false;
      };
    },[]);

    // useEffect(()=>{
       userService.onUser().subscribe(curr_user => {
        if (curr_user) {
          setUser(curr_user);
          
          checkUser(curr_user);

          handleSetProfilPicture(curr_user);
          // if(curr_user.name!== undefined){
          //   let name = curr_user.name.split(" ")[0];
          //   // console.log(name.substring(0,4));
          //   name = name.substring(0,5);
          //   setUserName(name);
          // }
          
        }
      });

      // return subscription.unsubscribe;   

    // },[])

    const handleSetProfilPicture = (user)=>{
      let profilePicture; 
      if(user.hasOwnProperty("profile_pic")){
        profilePicture = [{id:1 ,image: user.profile_pic, name:user.name}];
        try{
          let profileImageName  = require(`../../public/assets/images/${profilePicture[0].image}`);
          profilePicture[0].image = profileImageName;
          // console.log("profileImageName: ",profileImageName);
        }catch(err){
          profilePicture[0].image = "dummyProfilePic.png";
          profilePicture[0].image =  require(`../../public/assets/images/${ profilePicture[0].image}`);
          // setProfilePic(profilePicture);
          console.log(err);
        }
        setProfilePic(profilePicture);
        // setShowLoader(false);
      }
    } 


    
    cartService.onUpdateCartItems().subscribe(cartItemsLen => {
      // debugger;
      if(cartItemsLen >= 0){
        setCartItemsLength(cartItemsLen);
      }
    });
    
    // const handleScroll = () => {
      // const position = window.pageYOffset;
      // setScrollPosition(position);

      // if(scrollPosition === 0){
      //   setIsMenu(false);
      // }
      // if(scrollPosition < 2){
      //   setIsMenu(false);
      //   setHideMenuItems(false);
      // }
    // };
    

    function checkUser(curr_user){
      // if(curr_user.token){
        if(curr_user.role === "admin"){
          // setIsUser(true);
          setIsAdmin(true);
          setisLoggedOut(false);
          // console.log("i am admin well")
        }else{
          setIsUser(true);
          setisLoggedOut(false);
          // console.log("i am user")
        }
      // }
    }

    function handleCart(){
      if(isLoggedOut){
        navigate("/login");
        return;
      }
      if(isUser){
        let user = JSON.parse(localStorage.getItem('user'));
        navigate("/cart/"+user._id);
        return;
      }
    }

  
    // isUser,isAdmin

    function logout(){
      setIsUser(false);
      setIsAdmin(false);
      setisLoggedOut(true);
      setCartItemsLength(0);
      // setUserName("");
      setUser("");
      // userService.sendUser({});
      logOutService.setLogOut(null);  
      // localStorage.removeItem("user");
      // localStorage.removeItem("cart");
      // localStorage.removeItem("customerInfo");
      // localStorage.removeItem("general")
      // localStorage.removeItem("category")
      // localStorage.removeItem("sub_category");
      // localStorage.removeItem("area_code_details");
      // localStorage.removeItem("OrderId")
      console.log("Logged out");
      localStorage.clear();
      // window.location.reload();
      navigate("/");
    }

    const handleHamburger=()=>{
      setmobileView(!mobileView);
      if(toggleDropdown){
        setToggleDropDown(false);  
      } 
    }
    // const handleAdminHamburger = ()=>{
    //   setAdminMobileView(!adminMobileView);
    //   // if(toggleAdminNav){
    //     setToggleAdminNav(!toggleAdminNav)
    //   // }

    // }
  
    const handleUserAccount=()=>{
      setToggleDropDown(!toggleDropdown);
      if(mobileView){
        setmobileView(false); 
      }

    }
    const showMobSearchBar = ()=>{
      // console.log("clicked")
      setShowMobSearch(true);
    }

    // const handleMenu = ()=>{
    //   setIsMenu(!isMenu);
    // }
    return (
    <div className='main-navbar'>
       {/* Nav Bar */}
       <Nav>
          {!isAdmin && (
            <Logo to={"/"} >
            <SiElasticsearch className='logo-icon' />
              <motion.span 
              animate={{rotate:rotate?360:0}}
              transition={{type:"tween", duration:1}}
              onMouseOver={()=>{setRotate (!rotate)}}
              className='logo-text'>BookStore</motion.span> 
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
               <div className="search-icon-mobile" onClick={showMobSearchBar}>
                  <FaSearch  ></FaSearch>
               </div>
              </>    
          ))}
          
          

           {/* Cart */}
           {!isAdmin && (
             <>    
             <div 
                 onMouseOver={()=>setShowCartToopTip(true)}
                 onMouseOut={()=>setShowCartToopTip(false)}
                className="cart-icon" onClick={handleCart}>
               <span className='cart-bage'>{cartItemsLength}</span>
               <FaShoppingCart  
               />
               {showCartToopTip && <Tooltip tooltipMessage={"Cart"}/>}
             </div>
             </>
           )}
           

            {/* User */}
          {(!isAdmin && (
            <div 
            onMouseOver={()=>setShowToopTip(true)}
            onMouseOut={()=>setShowToopTip(false)}
            className={toggleDropdown?'user-icon activeIcon':'user-icon '} onClick={handleUserAccount}>
              {/* <span className='username'>{userName}</span> */}
              {isLoggedOut && (<FaUserCog  />)}
              {!isLoggedOut && ( 
                // <FaUserCircle/>
                <>
                  
                  {/* <div className='previewImg'>
      
                    <FaUserCog  />
                  </div> */}
                  { profilePic.length === 0 && <FaUserCircle />}
                  {profilePic.length>0?   
                    profilePic.map((item)=>{   
                      return ( 
                        <img key={item.id}  className='previewImg' src={item.image} alt={item.name}/>
                      )
                    }): ("")
                  }
                </>
              ) }

              {(isLoggedOut && showToopTip) && <Tooltip tooltipMessage={"Account Info"} />}
              {(!isLoggedOut && showToopTip)  && <Tooltip tooltipMessage={user.name} />}
            </div>
            
          ))}


          {/* Hamburger  */}
          {!isAdmin  && (
            <div  onClick={handleHamburger}>
              {!mobileView && (<GiHamburgerMenu className={mobileView?"hamburger-menu active-hamburger-menu":"hamburger-menu"} />)}
              {mobileView && (<FaTimes className={mobileView?"hamburger-menu active-hamburger-menu":"hamburger-menu"}/>)}
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
          {/* {isAdmin && (
            <div >
            </div>
          )} */}
         

          {(isAdmin && (
            // <div title={user.name} className={toggleDropdown?'user-icon activeIcon':'user-icon'} onClick={handleUserAccount}>
            //   {/* <span className='username'>{userName}</span> */}
            //   {isLoggedOut && (<FaUserCog />)}
            //   {!isLoggedOut && ( <FaUserCircle/>) }
            // </div>
            <div className="logout-div" >
               <p onClick={logout} className="logout-btn" ><FaSignOutAlt className='logout-icon' /> <strong>Logout</strong></p>
             </div>
          ))} 
        {/* Admin Screen ends here */}
          {(!isAdmin && toggleDropdown) && (
            <motion.ul  
               animate={{x: 0}}
               initial={{x:30}}
               className='dropdown' onClick={()=>setToggleDropDown(!toggleDropdown)}> 
                {isUser && (
                  <>
                    <NavLinks to={"/user/account"} className='dropdown-item'>         
                      <FaUser/><p className="sign_reg_icons" ><strong>My Account</strong></p>
                    </NavLinks>
                    <NavLinks to={"/user/orders"} className='dropdown-item'>         
                      <FaGift/><p className="sign_reg_icons" ><strong>Orders</strong></p>
                    </NavLinks>
                    <NavLinks to={"/user/wishlist"} className='dropdown-item'>         
                      <FaHeart/><p className="sign_reg_icons" ><strong>Wishlist</strong></p>
                    </NavLinks>
                    <li className='dropdown-item' onClick={logout}> 
                      <FaSignOutAlt /><p className="sign_reg_icons" ><strong>Logout</strong></p>
                    </li>
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
          </motion.ul>
          )}

        
        </Nav>
          {/* {!isAdmin && (
            <Nav2>
              <Category />
            </Nav2>
          )} */}
        {!isAdmin && (
          <WhatsAppOuter>
            <a className="whatsapp-for-desktop" href="https://web.whatsapp.com/send?phone=+919622572247" target="_blank" rel="noopener noreferrer" title='Contact Us'>
              <FaWhatsapp/>
            </a>
            <a className="whatsapp-for-mobile" href="https://wa.me/+919622572247" target="_blank" rel="noopener noreferrer" title='Contact Us'>
              <FaWhatsapp/>
            </a>
          </WhatsAppOuter>
        )}
    </div>
  )
}

const WhatsAppOuter = styled.div`
  position: fixed;
  bottom: 15px;
  right: 15px;
  z-index:1500;
  
  @media (max-width:650px){
      transform: scale(1.3);
      bottom: 15px;
      left: 20px;
      right: unset;
      z-index: 900;
      .whatsapp-for-desktop{
          display: none;
      }
      .whatsapp-for-mobile{
          display: block;
      }
  }
  @media (min-width:650px){
    .whatsapp-for-mobile{
      display: none;
    }
    .whatsapp-for-desktop{
      display: block;
    }
  }
  svg{
    transform: scale(2);
    color: white;
    background: #59bb58;
    border-radius: 7px;
    padding: 1px;
    transition: all ease-in 0.3s;
    -webkit-transition: all ease-in 0.3s;
    -moz-transition: all ease-in 0.3s;
    &:hover{
      transform: scale(2.3);
      transition: all ease-out 0.3s;
      -webkit-transition: all ease-out 0.3s;
      -moz-transition: all ease-out 0.3s;

    }
    
  }
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
  grid-template-columns: 2rem 9rem 3fr 1fr 4rem 5rem;
  /* padding:0.5rem 0rem; */
  /* background:linear-gradient(35deg, hsl(0deg 0% 0% / 32%), #313131d9); */
  background: grey;
  margin-bottom: 0.5rem;

  .lds-spinner{
    transform: translate(220px,140px);
    position: absolute;
    @media (max-width:650px){
        transform: translate(150px,140px); 
    }
  }

  .cart-icon .tooltip{
    right: 60px;
    min-width:fit-content !important ;
    width:fit-content !important; 
    padding:5px 12px;
    @media(max-width:1000px){
      right: 90px;
    }
  }
  .cart-icon .tooltip .tip{
        top: -6px;
        right: 8px;
    }
  .showNav{
    display: contents;
  }
  .hideNav{
    display: none;
  }
  /* .username{
    color: white;
    font-size: 9px;
    transform: scaleY(1.4);
  } */
  /* .user-icon-name{
    margin-top:10px;
    display:flex;
    cursor: pointer;
  } */
  .logout-div{
    display: flex;
    margin-top: 12px;
    flex-direction: column;
    color: white;
    align-items: end;
    @media (max-width:650px){
      margin-top: 8px;
    }
  }
  .logout-btn{
    background: orangered;
    padding: 5px 15px;
    cursor: pointer;
    border-radius: 3px;
    @media (max-width:650px){
      padding: 3px 13px;
      font-size: 0.9rem;
    }
    @media (max-width:360px){
      margin-right: -30px;
    }
  }
  .main-menu-links{
    @media (max-width:1000px) {
      display: none;
    }
  }

  .search-box{
    margin-top: 0.6rem;
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
      display:flex;
      margin:auto auto;
      color: white;
      margin-top: 5px;
      margin-left: 80%;
      transform: scale(1.3);
      border-radius: 50%;
      padding:6px;
      &:hover{
        background: linear-gradient(to right, #f27121, #e94057);
      }
    }
  }

  .hamburger-menu {
      display: none;
      &:hover{
        background: linear-gradient(to right, #f27121, #e94057);
      }
    @media (max-width:1000px){
      display: block;
      color:white;
      font-size: 2rem;
      cursor: pointer;
      margin: auto auto;
      margin-top: 6px;
      padding:3px;

    } 
    @media (max-width:650px){
      margin-top: 5px;
      font-size: 1.9rem;
    }
  }
  .active-hamburger-menu{
    background: linear-gradient(to right, #f27121, #e94057);
  }

  .cart-icon{
    &:hover{
      background: linear-gradient(to right, #f27121, #e94057);
      @media (max-width:650px){
        background:none !important;
        .cart-bage{
          background-color: orangered !important;
        }
      }
      .cart-bage{
        background-color: #959595;
      }
    }
    display: flex;
    margin: auto auto;
    margin-top:8px;
    margin-left: 40px;
    font-size:1.7rem;
    color:white;
    cursor: pointer;
    border-radius: 50%;
    padding:7px;
    @media (max-width:1000px){
      margin-top:3px;
    } 
    @media (max-width:650px){
      margin-top:0px;
      margin-left: -5px;
      padding:5px;
    } 
    @media (max-width:360px){
      margin-top: 2px;
      margin-left: 0px;
      padding: 5px;
      font-size:1.5rem;
    }  
  }

  .cart-bage{
    margin-left: 8px;
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
      margin-top: -5px;
      margin-left: 10px;
      font-size: 10px;
    }
    @media (max-width:360px){
      height: 14px;
    }
  }

  .previewImg{
    height: 32px;
    width: 35px;
    border-radius: 30px;
    @media (max-width:650px){
      height: 27px;
      width: 30px;
    }
  }
  .user-icon{
    &:hover{
      background: linear-gradient(to right, #f27121, #e94057);
      @media (max-width:650px){
        background: none;
      }
    }
    display: flex;
    margin: auto auto;
    font-size: 1.7rem;
    color: white;
    margin-left: 25px;
    border-radius: 50%;
    padding: 6px;
    cursor: pointer;
    margin-top: 8px;
    
    @media (max-width:1000px){
      margin-top: 2px;
      margin-left: 30px;
    }
    @media (max-width:650px){
      font-size: 1.6rem;
      padding: 5px 5px;
      margin-left: 2px;
    }
    @media (max-width:360px){
      margin-left: 0px;
    }
  }
  .activeIcon{
    background: linear-gradient(to right, #f27121, #e94057) !important;;
  }
  /* .user-icon:hover{
    display: flex;
    margin: auto auto;
    font-size: 1.7rem;
    color: white;
    margin-left: 25px;
    border-radius: 50%;
    padding: 6px 6px;
    cursor: pointer;
    margin-top: 8px;
    background: linear-gradient(to right, #f27121, #e94057);
    @media (max-width:1000px){
      margin-top: 2px;
      margin-left: 30px;
    }
    @media (max-width:650px){
      font-size: 1.6rem;
      padding: 5px 5px;
      margin-left: 2px;
    }
    @media (max-width:360px){
      margin-left: 0px;
    }
  } */

  /* .cart{
    display: flex;
    margin: auto auto;
    font-size: 1.7rem;
    color: white;
    cursor: pointer;
    @media (max-width:650px){
      font-size: 1.5rem;
    }
  }

  .cart:hover{
    background: linear-gradient(to right, #f27121, #e94057);
  } */

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
        margin-left: 0;
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
  @media (min-width:1000px) and (max-width:1030px) {
    grid-template-columns: 2rem 8rem 6fr 9rem 4rem 4rem;
  
  }
  @media (max-width:650px) {
    grid-template-columns: 1rem 1fr 1fr 2rem 2rem 3rem;
    .admin-icon{
      transform: scale(1);
      margin-right: 5px;
    }
  }

  @media (max-width:360px) {
    grid-template-columns: 0.5rem 1fr 1fr 2rem 2rem 2rem;
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
