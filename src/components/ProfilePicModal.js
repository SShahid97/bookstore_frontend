import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {FaTimes} from "react-icons/fa";
import {motion} from "framer-motion";

function ProfilePicModal({setShowProfilePicModal, pic}) {
    const [userProfilePic, setUserProfilePic] = useState([]);
    useEffect(()=>{
        let profilePicture = [{id:1 ,image: pic, name:"Profile Picture"}];
        // console.log(profilePicture);
        setUserProfilePic(profilePicture);
    },[])
    const handleCloseModal = ()=>{
        setShowProfilePicModal(false);
    }
  return (
    <ProfilePicModalOuter className="modal-outer"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}

        transition= {{ease: "easeOut",type:"tween",  duration:0.6}}
    >
      <div className='btn-close-div'>
        <button onClick={handleCloseModal} ><FaTimes/></button>
      </div>
      
      <div className='modal-inner'>  
        {userProfilePic.map((item)=>{   
            return ( 
                <img key={item.id}   src={require(`../../public/assets/images/${item.image}`)} alt={item.name}/>
            )
        })}
      </div>
    </ProfilePicModalOuter>
  )
}

const ProfilePicModalOuter = styled(motion.div)`
    
    position:absolute;
    z-index: 1;
    left: 330px;
    @media (max-width:650px){
        top: 55px;
        left: 3px;
        z-index: 1000;
    }
    .btn-close-div{
        position: absolute;
        right: 0px;
        button{
            background: none;
            cursor:pointer;
            padding:8px;
            border-radius: 5px;
            border:none;
            &:hover{
                border:1px solid grey;
                background:black;
                color:white;
            }
            svg{
                transform: scale(2);
            }
        }

    }
    .modal-inner{
        width: 700px;
        height: 600px;
        padding: 5px;
        background-color: azure;
        border: 1px solid grey;
        border-radius:5px;
        @media (max-width:650px){
            width: 98vw;
            height:560px;
        }
    }
    .modal-inner img{
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }
    /* transition: all ease-out 2s; */
`;
export default ProfilePicModal
