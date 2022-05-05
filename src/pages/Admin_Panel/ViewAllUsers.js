import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Auth_Service } from "../../services/Service";
import {Link} from "react-router-dom";

function ViewAllUsers() {
  let i=1;
  const [users, setUsers] = useState([]);
  useEffect(() => {
    let curr_user = JSON.parse(localStorage.getItem('user'));
    if (curr_user && curr_user.role === "admin") {
      // setAdmin(curr_user);
      getAllUsers(curr_user.token);
    }
  }, [])

  const getAllUsers = async (token) => {
    const usersReturned = await Auth_Service.getUsers(token);
    // console.log(usersReturned);
    let onlyUsers = [];
    usersReturned.forEach((user) => {
      if (user.role !== "admin") {
        onlyUsers.push(user);
      }
    });
    // console.log(onlyUsers);
    setUsers(onlyUsers)
  }
  return (
    <UsersOuter  className='user-outer' style={{}}>
      <table className="all-users-table">
        <thead >
          <tr>
            <th>S.No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Order History</th>
          </tr>
        </thead>
        {
          users.map((user, index) => {
            return (
              <tbody key={user._id}>
                <tr>
                  <td>{i++}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Link to={"user-address/"+user._id}>
                      <p>user address</p>
                    </Link>
                  </td>
                  <td>
                  <Link to={"user-orderhistory/"+user._id}>
                      <p>order history</p>
                  </Link>
                  </td>
                </tr>
              </tbody>
            )
          })}
          </table>
    </UsersOuter>
  )
}

const UsersOuter = styled.div`
  border:1px solid grey;
  border-radius:3px;
  min-height: 70vh; 
  overflow-x:auto;  
  .all-users-table{
    border-radius:3px;
  }
 
  a{
    color:blue;
    text-decoration: underline;
  }
  a:hover{
    color:#0a5aadcc;
  }
  a:active{
    color:red;
  }
  table {
    
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    /* border: 1px solid #ddd; */
  }
  tbody{
    font-weight:500;
  }
  thead{
    text-align: left;
    background: #999999;
    color: white;
  }
  tr{
    border-bottom: 1px solid #d9d9d9;
  }
  th, td {
    text-align: left;
    padding: 16px;
  }
  /* tr:nth-child(even) td {
    background-color: cyan;
  } */

  @media (max-width:650px){
    th, td {
      padding: 5px;
    }
  }
  

`;
export default ViewAllUsers
