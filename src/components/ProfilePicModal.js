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
    },[pic])
    const handleCloseModal = ()=>{
        setShowProfilePicModal(false);
    }
  return (
    <ProfilePicModalOuter className="modal-outer"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}

        transition= {{ease: "easeOut",type:"tween",  duration:0.4}}
    >
     
      
      <div className='modal-inner'>  
      <div className='btn-close-div'>
        <button onClick={handleCloseModal} ><FaTimes/></button>
      </div>
        {userProfilePic.map((item)=>{   
            return ( 
                <img key={item.id}   src={item.image} alt={item.name}/>
            )
        })}
      </div>
    </ProfilePicModalOuter>
  )
}

const ProfilePicModalOuter = styled(motion.div)`
    
    /* position:absolute;
    z-index: 1;
    left: 330px; */

    top: 52px;
    left: 0px;
    position: fixed;
    z-index: 1;
    width: 100%;
    height: 100%;
    padding-top:1rem;
    background-color: #0000009e;
    @media (max-width:650px){
        top: 48px;
        z-index: 1000;
    }
    .btn-close-div{
        position: absolute;
        display: flex;
        width: inherit;
        justify-content: flex-end;
        button{
            cursor: pointer;
            padding: 6px;
            border-radius: 5px;
            background: black;
            color: white;
            margin-right: 10px;
            svg{
                transform: scale(1.5);
            }
        }

    }
    .modal-inner{
        width: 720px;
        height: 550px;
        padding: 5px;
        /* background-color: azure;
        border: 1px solid grey; */
        border-radius:5px;
        margin:auto;
        @media (max-width:650px){
            width: 98vw;
            height:560px;
        }
    }
    .modal-inner img{
        width: 100%;
        height: 100%;
        border-radius: 5px;
    }
    /* transition: all ease-out 2s; */
`;
export default ProfilePicModal
