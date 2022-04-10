import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import {User_Service} from "../../services/Service";

let Admin = {};
function ViewAllItems() {
    const [allBooks, setAllBooks] = useState([]);

    useEffect(()=>{
        getAllBooks();
        let curr_user = JSON.parse(localStorage.getItem('user'));
          if (curr_user && curr_user.role === "admin") {
            Admin = curr_user;
          } else {
            Admin = {};
          }
    },[])

    const getAllBooks = async()=>{
        const books = await User_Service.getAllBooks();
        setAllBooks(books);
    }
  
    // Deleting an Item 
    const deleteBook = async(id)=>{
        // console.log("ID: ",id)
        const response = await fetch(`http://localhost:5001/api/books/${id}`, {
            method: 'DELETE',
            headers: {
                'auth-token': Admin.token
            },
        }); 
        console.log(response);
        if(response.status === 200){
            const data = await response.json();
            alert(data.message);
            // console.log(data.message);
            getAllBooks();
        }else if(response.status === 401){  //when token is missing
            const data = await response.json();
            alert(data.message);   
        }else {
            alert("There was some error while deleting the book");
        }
    }
  return (
    <div className="ViewItemsDiv">
        <div style={{textAlign:'left', fontSize:'1.2rem',marginBottom:'1rem'}}>
            <span ><b>Total Items: </b></span><span>{allBooks.length}</span>
        </div>
        {allBooks.map((book)=>{
            return (
                <Card key={book._id}>
                    <div className='imgDiv'> 
                        <img src={require(`../../../public/assets/images/${book.book_image}.jpg`)} alt={book.book_name} />
                    </div>

                    {/* <div className="outer"> */}
                    <div className='bookDetials'>
                            <span><strong>Book Name:</strong></span><p>{book.book_name}</p>
                            <span><strong>Book Code:</strong></span><p>{book.book_code}</p>
                            <span><strong>Book Author:</strong></span><p>{book.book_author}</p>
                            <span><strong>Category:</strong></span><p>{book.category}</p>
                            <span><strong>Price:</strong></span><span>Rs.</span><p>{book.price}</p>
                            <span><strong>Description:</strong></span><section>{book.book_description}</section>
                    </div>
                    {/* </div> */}

                    <div className='editDeleteBtn'>
                        <Link to={/edit-item/+book._id}>
                            <div className='btns editBtn'>EDIT</div>
                        </Link>
                        
                        <div onClick={() => deleteBook(book._id)} className='btns deleteBtn'> DELETE</div>
                    </div> 
                </Card>
            )
         })
        }
    </div>
  )
}

const Card = styled.div`
    display: grid;
    grid-gap:1rem;
    /* grid-template-columns: 2fr 3fr 1fr; */
    grid-template-columns: repeat(auto-fit, minmax(200px,2fr));
    /* flex-wrap: wrap; */
    margin-bottom:1rem;
    padding: 0.6rem;
    background: white;
    border-radius:5px;
    overflow:hidden;
    position:relative;
    box-shadow: 4px 5px 5px 1px #00000050;
    &:hover{
        outline:1px solid grey;
        opacity: 0.9;
        cursor: pointer;
    }
    .imgDiv{
        width:95%;
        img{
            height: 100%;
            border-radius:5px;
            left:0;
            width: 15rem;
        }
    }
    /* .outer{
        display: flex;
    } */
    .bookDetials{
        text-align: left;
        /* padding-left: 3%; */
        width:98%;
    }
    .editDeleteBtn{
        margin:auto auto;
    }
    span{
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        font-size:medium;
    }
    p{
        font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
        margin-bottom: 0.5rem;
    }
`;


export default ViewAllItems
