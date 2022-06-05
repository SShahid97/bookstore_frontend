import React,{useEffect, useState} from 'react'
import { NavLink,useNavigate } from 'react-router-dom';
import styled from "styled-components";
import {userService} from "../services/LocalService";
import {
  FaUserFriends,
  FaFileImport,
  FaSearchDollar,
  FaRegEye,
  FaChalkboardTeacher,
  FaChartLine,
  FaUserCircle
  } from "react-icons/fa";
import {MdOutlineVpnKey} from "react-icons/md"

function AdminSideNav({toggleArrowMenu,setToggleArrowMenu }) {
  let navigate = useNavigate();
  const [profilePic, setProfilePic] = useState([]);
  let curr_user=JSON.parse(localStorage.getItem("user"));
  useEffect(()=>{
    if(!curr_user ){
      navigate("/");
    }else if(curr_user.role !== "admin"){
      navigate("/");
    }
    let profilePicture; 
    if(curr_user.profile_pic){
      profilePicture = [{id:1 ,image: curr_user.profile_pic, name:curr_user.name}];
      console.log("Before Observable: ",profilePicture)
      setProfilePic(profilePicture);
    }

    let profileImageName;
    try{
      profileImageName  = require(`../../public/assets/images/${profilePicture[0].image}`);
      // console.log("profileImageName: ",profileImageName);
    }catch(err){
      setProfilePic([]);
      console.log(err);
    }
   
  },[]);
  
  
  const handleCloseNav = ()=>{
    setToggleArrowMenu(false)
  }
  return (
    <NavOuter>
      <List className={toggleArrowMenu?"mobile-view":"desktop-view"} onClick={handleCloseNav}>
        <div className="AdminProfileDiv">
          <SLink to={"admin-profile"} className='dropdown-item' style={{borderRadius: '40px', padding:'3px', height:'inherit'}}>         
            {profilePic.length === 0 && <FaUserCircle className="AdminProfileIcon" />}
            {profilePic.length>0?   
               profilePic.map((item)=>{   
                return ( 
                  <img key={item.id}  className='previewImg' src={require(`../../public/assets/images/${item.image}`)} alt={item.name}/>
                )
               }): ("")
            }
          </SLink>
        </div>
      <hr/>
        <SLink to={"dashboard"} className='dropdown-item' style={{marginTop: '3px'}}>         
          <span className='icons'> <FaChalkboardTeacher /></span><h4>Admin Dashboard</h4>
        </SLink>
        <h4 className='headings'>Manage Books</h4>
        <SLink to={'manage-books/view-all-items'}  >
          <span className='icons'> < FaRegEye/> </span><h4>View Books</h4>
        </SLink>
        <SLink to={'manage-books/add-item'} >
        <span className='icons'> < FaFileImport/> </span> <h4>Add New Book</h4>
        </SLink>

        <h4 className='headings'>Manage Users & Orders</h4>
        <SLink to={'manage-users/view-all-users'}  >
        <span className='icons'> < FaUserFriends/> </span><h4>View All Users</h4>
        </SLink>
        <SLink to={'manage-users/search-order'} style={{padding: '2px'}}>
        <span className='icons'> < FaSearchDollar/> </span><h4>Search Order / Genearte Invoice</h4>
        </SLink>

        <h4 className='headings'>Statistics</h4>
        <SLink to={"manage-books/statistics"} className='dropdown-item'>         
          <span className='icons'> <FaChartLine /></span><h4>Statistics and Data Visualization</h4>
        </SLink>
        {/* <SLink to={'manage-books/add-stock'}  >
        <span className='icons'> < MdLibraryAdd/> </span> <h4>Add Stock Details</h4>
        </SLink> */}
        {/* <SLink to={'manage-books/view-all-items/view-edit-stock/:code'} >
        <span className='icons'> < FaEdit/> </span><h4>Edit Stock Details</h4>
        </SLink> */}

      </List>
    </NavOuter>
  )
}

const NavOuter = styled.div`
  height:auto;
  .mobile-view{
      color:white;
      list-style: none;
      left:0;
      background: grey;
      padding:1rem;
      overflow: hidden; 
      display: block;
      position: fixed;
      top: 50px;
      width: 300px;
      padding-top: 15px;
      z-index: 1200;
      height: 100%;
      /* animation: showUp 100ms; */
      animation: 300ms slide-right;
  }
  

  @keyframes slide-right {
    from {
      margin-left: -100%;
    }
    to {
      margin-left: 0%;
    }
  }
  /* @keyframes showUp {
    from {width: 0;}
    to {width: 50%;}
  } */
  .desktop-view{
      color:white;
      list-style: none;
      left:0;
      background: grey;
      padding:0.4rem;
      overflow: hidden;
      height: 100%;
  }    
    @media (max-width:850px){
      .desktop-view{
        display:none;
      }
    }
`;
const List = styled.div`
     .previewImg{
        height: 100%;
        width: 100%;
        border-radius: 35px;
    }
    .AdminProfileDiv{
      width: 90px;
      height: 90px;
      margin: auto;
    }

    .AdminProfileIcon{
      transform: scale(3.5);
    }

    .headings{
        padding: 0.4rem;
        font-size: 1.1rem;
    }
    
`;
const SLink = styled(NavLink)`
    &:hover{
      background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    }
    &.active{
        background:linear-gradient(to right, #f27121, #e94057);
        h4{
            color:white;
        }
    }

    color:white;
    display: flex;
    align-items: center;
    padding: 0.4rem;
    border-radius: 2px ;
    margin-left:0.6rem;
    .icons{
      margin-right: 5px;
      margin-top: 5px;
      font-size: 1.3rem;
    }
    h4{
        color:white;
        font-size: 1rem;
        font-weight: 500;
    }
`;
export default AdminSideNav
