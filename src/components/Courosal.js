import React, {useRef} from 'react';
import styled from 'styled-components';
import {Splide, SplideSlide} from '@splidejs/react-splide';
import "@splidejs/splide/dist/css/splide.min.css";
function Courosal() {
    const ref = useRef()
    const imagesArray = [ 
        {
            id:'01',
            imageName:'banner_image_04.jpg'
        },
        {
            id:'02',
            imageName:'banner_image_02.jpg'
        }, 
        {
            id:'03',
            imageName:'banner_image_03.jpg'
        },
        {
            id:'04',
            imageName:'banner_image_01.jpg'
        }     
    ]

  return (
    <Wrapper>
            <Splide
                ref={ref}
                options={{
                    perPage:1,
                    arrows:true,
                    pagination:true,
                    drag:"free",
                    gap:"2rem",
                    autoplay: true,
                    rewind: true

                }}
            >
            {imagesArray.map((image)=>{
                return (
                    <SplideSlide key={image.id} >
                    <Card >
                           <img src={require(`../../public/assets/images/${image.imageName}`)} alt={image.imageName} /> 
                    </Card>
                    </SplideSlide>
                );
            })}
            </Splide>
        </Wrapper>
  )
}
const Wrapper = styled.div`
     /* margin: 0.3rem 0rem 4rem 0rem  !important; */
     margin-bottom: 20px;
    margin-top: -23px;
    margin-left: -8px;
     @media (max-width:650px) {
        /* margin: 0rem 0rem 1rem 0rem !important;    */
       margin: -24px 0px 15px -3px !important;

     }
     @media (max-width:360px){
        margin:-24px 0px 15px -1px !important;
     }
     .splide__arrow {
        width: 3rem;
        height: 3rem;
        margin-left: -10px;
        margin-right: -10px;
        @media (max-width:610px) {
            width: 1.6rem;
            height: 1.6rem;
        }
     }
     /* @media (max-width:1250px) {
        width:70%
     }
     @media (max-width:1050px) {
        width:50%
     }
     @media (max-width:850px) {
        width:40%
     } */
`;

const Card = styled.div`
    /* border:1px solid grey !important; */
    padding: 0.2rem;
    /* min-height:20rem; */
    overflow:hidden;
    position:relative;
    height:20rem;
    /* responsive for mobiles */
    @media (max-width:610px) {
        height:10rem;
    }
    img{
        /* height: 245px;; */
        left:0;
        width:100%;
        height: inherit;
    }
    span{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size:medium;
    }
    p{
        font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    }

`;
export default Courosal
